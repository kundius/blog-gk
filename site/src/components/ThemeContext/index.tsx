import React, { createContext, useEffect, useState } from 'react'

import { COLOR_MODE_KEY } from './constants'
import { useFocusVisible } from './useFocusVisible'

export type ColorMode = 'light' | 'dark'

export const ThemeContext = createContext<{
  colorMode?: ColorMode,
  setColorMode?: (value: ColorMode) => void,
  focusVisible?: boolean,
}>({})

export const ThemeProvider = ({ children }) => {
  const [focusVisible] = useFocusVisible()
  const [colorMode, rawSetColorMode] = useState<ColorMode | undefined>(undefined)

  useEffect(() => {
    rawSetColorMode(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    )
  }, [])

  const setColorMode = (value: ColorMode) => {
    const root = window.document.documentElement
    rawSetColorMode(value)
    localStorage.setItem(COLOR_MODE_KEY, value)
    root.classList.remove('light', 'dark')
    root.classList.add(value)
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode, focusVisible }}>
      {children}
    </ThemeContext.Provider>
  )
}
