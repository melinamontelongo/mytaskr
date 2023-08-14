import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "react-hot-toast";
import Providers from './providers'
import Navbar from '@/components/navigation/Navbar'
import BackgroundImage from '@/components/ui/BackgroundImage';

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
    <html lang="en" className="bg-base-100">
      <body className={`${inter.className} bg-base-100 h-full`}>
        <Providers>
          <BackgroundImage>
            <Navbar />
            <div>
              {children}
            </div>
            <Toaster toastOptions={{
              className: 'notification',
              position: "bottom-right",
            }} />
          </BackgroundImage>
        </Providers>
      </body>
    </html >
  )
}
