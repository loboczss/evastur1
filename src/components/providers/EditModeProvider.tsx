'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

export type EditModeContextValue = {
  isEditing: boolean;
  enableEdit: () => void;
  disableEdit: () => void;
  toggleEdit: () => void;
};

export const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

const EDITABLE_SELECTOR = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'small',
  'strong',
  'em',
  'li',
  'a',
  'blockquote',
  'figcaption',
  'label',
].join(',');

type Props = {
  children: ReactNode;
};

function isElementVisible(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export default function EditModeProvider({ children }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const pathname = usePathname();
  const trackedElements = useRef(new Map<HTMLElement, string | null>());

  const enableEdit = useCallback(() => setIsEditing(true), []);
  const disableEdit = useCallback(() => setIsEditing(false), []);
  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const applyEditingToElements = useCallback(() => {
    if (!isEditing) return;
    if (typeof window === 'undefined') return;

    const nodes = document.querySelectorAll<HTMLElement>(EDITABLE_SELECTOR);
    nodes.forEach((node) => {
      if (!isElementVisible(node)) return;
      if (node.dataset.inlineEditing === 'true') return;

      trackedElements.current.set(node, node.getAttribute('contenteditable'));
      node.setAttribute('contenteditable', 'true');
      node.dataset.inlineEditing = 'true';
      node.classList.add('inline-editing-element');
    });
  }, [isEditing]);

  const clearEditingState = useCallback(() => {
    if (typeof window === 'undefined') return;
    trackedElements.current.forEach((previousValue, element) => {
      if (!document.body.contains(element)) return;
      if (previousValue === null || previousValue === '') {
        element.removeAttribute('contenteditable');
      } else {
        element.setAttribute('contenteditable', previousValue);
      }
      element.classList.remove('inline-editing-element');
      delete element.dataset.inlineEditing;
    });
    trackedElements.current.clear();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      clearEditingState();
      return;
    }

    applyEditingToElements();

    const observer = new MutationObserver(() => {
      applyEditingToElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [isEditing, applyEditingToElements, clearEditingState]);

  useEffect(() => {
    if (!isEditing) return;
    const id = window.requestAnimationFrame(() => {
      applyEditingToElements();
    });
    return () => window.cancelAnimationFrame(id);
  }, [isEditing, pathname, applyEditingToElements]);

  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return undefined;
    const timeout = window.setTimeout(() => {
      document.body.classList.add('editing-mode-active');
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      document.body.classList.remove('editing-mode-active');
    };
  }, [isEditing]);

  const value = useMemo<EditModeContextValue>(
    () => ({ isEditing, enableEdit, disableEdit, toggleEdit }),
    [isEditing, enableEdit, disableEdit, toggleEdit]
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
          <span className="rounded-full bg-indigo-500/90 px-4 py-1 text-sm font-medium text-white shadow-lg">
            Modo edição ativo
          </span>
          <button
            type="button"
            onClick={() => {
              alert('Edições salvas localmente.');
              disableEdit();
            }}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Salvar Edições
          </button>
        </div>
      )}
    </EditModeContext.Provider>
  );
}
