import React, { createContext, useEffect, useState } from 'react'

import {
  VARIABLES,
  COLOR_MODE_KEY,
  INITIAL_COLOR_MODE_CSS_PROP
} from './constants'
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
    const root = window.document.documentElement
    const initialColorValue = root.style.getPropertyValue(
      INITIAL_COLOR_MODE_CSS_PROP
    ) as ColorMode
    rawSetColorMode(initialColorValue)
  }, [])

  const setColorMode = (value: ColorMode) => {
    const root = window.document.documentElement
    rawSetColorMode(value)
    localStorage.setItem(COLOR_MODE_KEY, value)
    root.style.setProperty(INITIAL_COLOR_MODE_CSS_PROP, value)
    root.classList.remove('light', 'dark')
    root.classList.add(value)
    Object.entries(VARIABLES).forEach(([name, colorByTheme]) => {
      const cssVarName = `--${name}`
      root.style.setProperty(cssVarName, colorByTheme[value])
    })
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode, focusVisible }}>
      {children}
    </ThemeContext.Provider>
  )
}
