import React from 'react'

import '@components/ThemeContext/globals.css'
import '@components/Pagination/styles.css'

import { Providers } from './providers'
import { COLOR_MODE_KEY } from '@components/ThemeContext/constants'
import { CLIENT_URL } from '@app/utils/config'
import { Golos_Text } from "next/font/google";
import { cn } from "@app/lib/utils";

const golos = Golos_Text({subsets:['latin','cyrillic'],variable:'--font-sans'});

export const metadata = {
  metadataBase: new URL(CLIENT_URL)
}

function themeInitScript () {
  const key = JSON.stringify(COLOR_MODE_KEY)

  return `(function(){try{var p=localStorage.getItem(${key});var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var c=typeof p==='string'?p:(d?'dark':'light');document.documentElement.classList.add(c)}catch(e){}})()`
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={cn("font-sans", golos.variable)}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
