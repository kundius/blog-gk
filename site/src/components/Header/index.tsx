import React, { useState, useEffect, useContext } from 'react'
import { FaRss } from 'react-icons/fa'
import { useSpring, animated } from 'react-spring'
import { throttle } from 'throttle-debounce'

import { ScrollTop } from '@components/ScrollTop'
import { Container } from '@components/Container'
import { HeaderMenu } from '@components/HeaderMenu'
import { MobileMenu } from '@components/MobileMenu'
import { ThemeContext } from '@components/ThemeContext'

import { useLightToggle } from './useLightToggle'
import { Search } from './Search'
import { Garland } from './Garland'
import styles from './styles.module.css'

export const Header = () => {
  const [isFixed, setIsFixed] = useState(false)
  const { colorMode, setColorMode } = useContext(ThemeContext)
  const lightToggle = useLightToggle({ theme: colorMode })
  const headerSpring = useSpring({
    y: isFixed ? 0 : -100
  })

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler)
    return () => {
      window.removeEventListener('scroll', onScrollHandler)
    }
  }, [])

  const onScroll = () => {
    setIsFixed(window.pageYOffset > 300)
  }

  const onScrollHandler = throttle(100, onScroll)

  const handleToggleTheme = () => {
    setColorMode?.(colorMode === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={isFixed ? 'isHeaderFixed' : undefined}>
      <div className={`${styles.Placeholder} ${isFixed ? 'block' : 'hidden'}`} />
      <animated.div
        className={styles.Wrapper}
        style={{
          transform: isFixed ? headerSpring.y.to(y => `translateY(${y}%)`) : undefined
        }}
      >

{/*         <div className={styles.Garland1}></div> */}
{/*         <div className={styles.Garland2}></div> */}
        <Container style={{ position: 'relative' }}>
{/*           <div className={styles.Garland3}></div> */}
{/*           <div className={styles.Garland4}></div> */}
{/*           <div className={styles.Garland5}></div> */}
        <Garland />
          <div className={styles.Inner}>
            <div className={styles.Search}>
              <Search />
            </div>
            <div className={styles.Buttons}>
              {colorMode && (
                <button className={styles.Button} onClick={handleToggleTheme}>
                  {lightToggle}
                </button>
              )}
              <a href="/rss" target="_blank">
                <button className={styles.Button}>
                  <FaRss />
                </button>
              </a>
            </div>
            <HeaderMenu />
            <div className={styles.Slogan}>
              АВТОРСКИЙ БЛОГ
            </div>
          </div>
        </Container>
      </animated.div>
      <MobileMenu />
      <ScrollTop />
    </div>
  )
}
