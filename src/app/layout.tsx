import '../styles/base.css'
import '../styles/var.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@components/ThemeContext'
import NavBar from '@components/NavBar'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'yzy_geometry',
  description: 'a graphic editor'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
