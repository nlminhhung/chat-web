// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Inter } from 'next/font/google'
import { cn } from '@/src/lib/utils'
import './globals.css'
import { ReactNode } from 'react'
import Providers from '../components/Providers'
import type { Metadata } from 'next'
import { CustomCursor } from '@/src/components/chat/(cursor)/customCursor'

export const metadata: Metadata = {
  title: 'ChatterBox',
  description: 'chat with your friends',
}

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children } : LayoutProps) {
  return (
    <html lang="en">
      <body
          className={cn(
            'antialiased',
            fontHeading.variable,
            fontBody.variable
          )}
      >
        {/* <CustomCursor/> */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}