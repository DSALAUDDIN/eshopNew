import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"

export const metadata: Metadata = {
  title: "SOUTHERN FASHION & DÉCOR BD.",
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
        <title>SOUTHERN FASHION & DÉCOR BD.</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
