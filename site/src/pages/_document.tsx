import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import {
  VARIABLES,
  COLOR_MODE_KEY,
  INITIAL_COLOR_MODE_CSS_PROP
} from '@components/ThemeContext/constants'

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
    .replace('⚡️', INITIAL_COLOR_MODE_CSS_PROP);

  let calledFunction = `(${boundFn})()`;

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: calledFunction }} />;
}

export default class MyDocument extends Document {
  render () {
    return (
      <Html lang="ru">
        <Head />
        <body>
          <MagicScriptTag />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
