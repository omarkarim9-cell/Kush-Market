import type { Metadata } from "next"
import { LangProvider } from "@/contexts/lang-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kush Shop | متجر كوش",
  description: "Kush Educational Services Official Store | المتجر الرسمي لخدمات كوش التعليمية",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "DM Sans, Cairo, sans-serif" }}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  )
}
