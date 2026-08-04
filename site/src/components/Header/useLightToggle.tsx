import React from 'react'
import { useTrail, useSpring, animated } from 'react-spring'

import { ColorMode } from '@components/ThemeContext'

export interface UseLightToggleProps {
  theme?: ColorMode
}

const items = [{
  cx: '17',
  cy: '9'
}, {
  cx: '13',
  cy: '15.928203230275509'
}, {
  cx: '5.000000000000002',
  cy: '15.92820323027551'
}, {
  cx: '1',
  cy: '9.000000000000002'
}, {
  cx: '4.9999999999999964',
  cy: '2.071796769724492'
}, {
  cx: '13',
  cy: '2.0717967697244912'
}]

export const useLightToggle = ({
  theme = 'light'
}: UseLightToggleProps) => {
  const dots = useTrail(items.length, {
    config: {
      mass: theme === 'light' ? 10 : 0,
      tension: theme === 'light' ? 2000 : 1000,
      friction: 200
    },
    scale: theme === 'light' ? 1 : 0,
    opacity: theme === 'light' ? 1 : 0
  })
  const wrap = useSpring({
    config: {
      mass: theme === 'light' ? 1 : 12,
      tension: 320,
      friction: 40
    },
    rotate: theme === 'light' ? 90 : 40
  })
  const middle = useSpring({
    config: {
      tension: 320,
      friction: 40
    },
    r: theme === 'light' ? 5 : 8
  })
  const shadow = useSpring({
    cx: theme === 'light' ? 25 : 10,
    cy: theme === 'light' ? 0 : 2
  })

  const id = Math.random().toString(36).substring(7)
  
  return (
    <animated.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={{
        transform: wrap.rotate.to(rotate => `rotate(${rotate}deg)`)
      }}
    >
      <mask id={`moon-mask-main-nav-${id}`}>
        <rect x="0" y="0" width="18" height="18" fill="#FFF" />
        <animated.circle
          cx={shadow.cx.to(cx => cx)}
          cy={shadow.cy.to(cy => cy)}
          r="8"
          fill="black"
        />
      </mask>
      <animated.circle
        cx="9"
        cy="9"
        fill="currentColor"
        mask={`url(#moon-mask-main-nav-${id})`}
        r={middle.r.to(r => r)}
      />
      <g>
        {dots.map(({ scale, ...rest }, index) => (
          <animated.circle
            key={index}
            cx={items[index].cx}
            cy={items[index].cy}
            r="1.5"
            fill="currentColor"
            style={{
              ...rest,
              transform: scale.to(scale => `scale(${scale})`),
              transformOrigin: 'center center'
            }}
          />
        ))}
      </g>
    </animated.svg>
  )
}
