import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import EditModeProvider from '@/components/providers/EditModeProvider'

export const metadata: Metadata = {
  title: 'Evastur',
  description: 'Viagens e Turismo com Evastur',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        <EditModeProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </EditModeProvider>
      </body>
    </html>
  )
}
