import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import './globals.css'
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Provider from "./Provider"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Akhil Live Docs',
  description: "Your go-to collaborative Editor"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#3371FF",
            fontSize: '16px'
          }
        }}
      >
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              "min-h-screen font-sans antialiased",
              fontSans.variable
            )}
          >
            <Provider>
              {children}
              <Analytics />
              <SpeedInsights />
            </Provider>
          </body>
        </html>
      </ClerkProvider>
  )
}