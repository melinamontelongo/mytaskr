import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "react-hot-toast";
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
    <html lang="en">
      <body className={`${inter.className} bg-base-200`}>
        <Providers>
          <Navbar />
          <div className="md:pt-4 pt-20">
            {children}
          </div>
          <Toaster toastOptions={{
            className: 'notification',
            position: "bottom-right",
          }} />
        </Providers>
      </body>
    </html>
  )
}
