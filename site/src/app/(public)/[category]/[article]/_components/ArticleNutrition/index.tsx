import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleNutritionProps {
  calories?: string | null
  protein?: string | null
  fat?: string | null
  carbs?: string | null
}

const ITEMS: {
  key: 'calories' | 'protein' | 'fat' | 'carbs'
  label: string
}[] = [
  { key: 'calories', label: 'ккал' },
  { key: 'protein', label: 'Белки' },
  { key: 'fat', label: 'Жиры' },
  { key: 'carbs', label: 'Углеводы' }
]

export function ArticleNutrition (data: ArticleNutritionProps) {
  const hasValue = ITEMS.some(
    (item) => data[item.key] != null && data[item.key] !== ''
  )
  if (!hasValue) return null

  return (
    <section className={styles.card}>
      <div className={styles.block}>
        <div className={styles.title}>ПИЩЕВАЯ ЦЕННОСТЬ (на 100 г)</div>
        <div className={styles.grid}>
          {ITEMS.map((item) => {
            const value = data[item.key]
            if (value == null || value === '') return null
            return (
              <div key={item.key} className={styles.item}>
                <span className={styles.value}>{value}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            )
          })}
        </div>
        <div className={styles.note}>
          Приблизительный расчёт для сырых продуктов
        </div>
      </div>
    </section>
  )
}
