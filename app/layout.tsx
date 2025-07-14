import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ethiopia Blockchain Week 2025',
  description: 'Ethiopia Blockchain week, generate image',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
