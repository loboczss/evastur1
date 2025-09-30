import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Evastur',
  description: 'Viagens e Turismo com Evastur',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}
