import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nordastro - Personalized Astrology",
  description: "Take a 1-minute quiz to get your unique birth chart reading",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          {children}
          <Toaster position="bottom-center" />
        </NuqsAdapter>
      </body>
    </html>
  )
}