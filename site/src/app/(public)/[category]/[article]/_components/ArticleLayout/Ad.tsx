'use client'
import React from 'react'

import * as styles from './styles.module.css'
import Link from 'next/link'

export function ArticleLayoutAd () {
  return (
    <div className={styles.ad}>
      <div className={styles.adText}>
        — Рекламное место —<br />
        По вопросам рекламы пишите на <Link href={`https://t.me/kundius`} target='_blank' className='underline'>@kundius</Link>
      </div>
    </div>
  )
}
