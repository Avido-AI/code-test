import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import Link from "next/link";
import Image from "next/image";
import {ReactNode} from "react";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="/AvidoIcon.png"
                    alt="Avido"
                    className="size-6"
					width={32} height={32}
                  />
                  <span className="font-semibold">Avido</span>
                </div>
              </SidebarHeader>
              <SidebarSeparator />
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/">Home</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="px-3 py-3 text-xs text-muted-foreground">
                v1.0.0
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="flex h-12 items-center gap-2 border-b px-4">
                <SidebarTrigger />
              </header>
              <main className="p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
