import React from 'react'

import { YandexRTB } from '@components/YandexRTB'

import styles from './styles.module.css'

export function SideAdvert () {
  return (
    <div className={styles.Wrapper}>
      <YandexRTB id={"R-A-2214092-1"} horizontalAlign={false} />
    </div>
  )
}
