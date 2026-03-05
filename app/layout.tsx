import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './components/auth-provider'

export const metadata: Metadata = {
  title: 'Velour — Ресторан высокой кухни',
  description: 'Забронируйте столик в ресторане Velour',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}