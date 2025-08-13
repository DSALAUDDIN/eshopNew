import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"

export const metadata: Metadata = {
  title: "My Amazin Store",
  description: "Its a good shop",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My Amazin Store</title>
        <link rel="preload" href="/fonts/Brandon_reg.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="font-brandon antialiased">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
