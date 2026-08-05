import React from 'react'

import '@components/ThemeContext/globals.css'
import '@components/Pagination/styles.css'

import { Providers } from './providers'
import {
  VARIABLES,
  COLOR_MODE_KEY,
  INITIAL_COLOR_MODE_CSS_PROP
} from '@components/ThemeContext/constants'
import { CLIENT_URL } from '@app/utils/config'

export const metadata = {
  metadataBase: new URL(CLIENT_URL)
}

function setColorsByTheme () {
  const variables = '🌈';
  const colorModeKey = '🔑';
  const colorModeCssProp = '⚡️';

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDarkFromMQ = mql.matches;
  const persistedPreference = localStorage.getItem(colorModeKey);

  let colorMode = 'light';

  if (typeof persistedPreference === 'string') {
    colorMode = persistedPreference;
  } else {
    colorMode = prefersDarkFromMQ ? 'dark' : 'light';
  }

  let root = document.documentElement;

  root.style.setProperty(colorModeCssProp, colorMode);
  root.classList.add(colorMode);

  Object.entries(variables).forEach(([name, varByTheme]) => {
    const cssVarName = `--${name}`;

    root.style.setProperty(cssVarName, varByTheme[colorMode]);
  });
}

const MagicScriptTag = () => {
  const boundFn = String(setColorsByTheme)
    .replace("'🌈'", JSON.stringify(VARIABLES))
    .replace('🔑', COLOR_MODE_KEY)
    .replace('⚡️', INITIAL_COLOR_MODE_CSS_PROP)

  let calledFunction = `(${boundFn})()`

  return <script dangerouslySetInnerHTML={{ __html: calledFunction }} />
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <MagicScriptTag />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
