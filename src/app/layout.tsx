import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brand Voice Generator',
  description: 'AI-powered brand voice generator using Perplexity API and Supertone TTS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className} style={{ backgroundColor: 'rgb(220, 220, 220)', margin: 0, padding: 0 }}>
        <div className="min-h-screen" style={{ backgroundColor: 'rgb(220, 220, 220)' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
