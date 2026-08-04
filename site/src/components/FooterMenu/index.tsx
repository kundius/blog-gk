import React from 'react'
import Link from 'next/link'

import styles from './styles.module.css'

export interface FooterMenuProps {
  section: {
    href: string
    title: string
    icon: React.ReactNode
  }
  items: {
    href: string
    title: string
  }[]
}

export function FooterMenu ({
  section,
  items
}: FooterMenuProps) {
  return (
    <div className={styles.Wrapper}>
      <Link href={section.href} passHref>
        <a className={styles.Section}>
          <span className={`${styles.SectionIcon} text-gray-600 dark:text-gray-300`}>
            {section.icon}
          </span>
          <span className={styles.SectionName}>
            {section.title}
          </span>
        </a>
      </Link>
      <ul className={styles.List}>
        {items.map((item, i) => (
          <li key={i}>
            <Link href={item.href} passHref>
              <a>{item.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
