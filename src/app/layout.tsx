import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'mytaskr',
  description: 'A web app where you can manage your tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="coffee">
      <body className={`${inter.className}`}>
        <Providers>
          <Navbar />
          <div className="container">
          {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
