import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduManage - Educational Management System',
  description: 'A comprehensive educational management system for teachers, parents, and administrators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
