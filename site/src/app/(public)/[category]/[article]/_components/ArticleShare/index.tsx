import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleShareProps {
  url: string
  title?: string
  heading?: string
}

function ShareButton ({
  href,
  label,
  icon,
  children
}: {
  href: string
  label: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <a
      className={styles.btn}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <span className={`${styles.icon} ${styles[icon]}`} />
      <span>{children}</span>
    </a>
  )
}

export function ArticleShare ({ url, title = '', heading = 'Поделиться' }: ArticleShareProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <section className={styles.block}>
      <h3 className={styles.title}>{heading}</h3>
      <div className={styles.buttons}>
        <ShareButton
          label="Поделиться в ВКонтакте"
          icon="vk"
          href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
        >
          ВКонтакте
        </ShareButton>
        <ShareButton
          label="Поделиться в Одноклассниках"
          icon="ok"
          href={`https://connect.ok.ru/offer?url=${encodedUrl}&title=${encodedTitle}`}
        >
          Одноклассники
        </ShareButton>
        <ShareButton
          label="Поделиться в MAX"
          icon="max"
          href={`https://max.ru/:share?text=${encodedTitle} ${encodedUrl}`}
        >
          MAX
        </ShareButton>
      </div>
    </section>
  )
}
