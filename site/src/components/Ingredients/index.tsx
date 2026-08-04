import React from 'react'

import styles from './styles.module.css'

export interface IngredientsProps {
  items: {
    name: string
    value: string
  }[]
}

export function Ingredients({ items }: IngredientsProps) {
  return (
    <div className={styles.Wrapepr}>
      <div className="text-lg mb-4 uppercase tracking-widest">Ингредиенты</div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            className="flex items-end leading-none justify-between gap-2"
            key={i}
            itemProp="recipeIngredient"
          >
            <div>{item.name}</div>
            {item.value && (
              <>
                <div className="transition duration-300 ease-out flex-grow border-b border-dotted border-gray-300 dark:border-gray-600"> </div>
                <div className="text-right">{item.value}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
