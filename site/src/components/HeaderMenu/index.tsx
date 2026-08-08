import React from 'react'
import Link from 'next/link'

import styles from './styles.module.css'

interface MenuItem {
  href: string
  title: string
  children: {
    href: string
    title: string
  }[]
}

const leftItems: MenuItem[] = [{
  href: '/first-courses',
  title: 'Первые блюда',
  children: [{
    href: '/entrees',
    title: 'Первые блюда'
  }]
}, {
  href: '/second-courses',
  title: 'Вторые блюда',
  children: [{
    href: '/mjasnye-bljuda',
    title: 'Мясные блюда'
  }, {
    href: '/fish-dishes',
    title: 'Рыбные блюда'
  }, {
    href: '/ovoshhnye-bljuda',
    title: 'Овощные блюда'
  }, {
    href: '/gribnye-blyuda',
    title: 'Грибные блюда'
  }, {
    href: '/kartofelnye-bljuda',
    title: 'Картофельные блюда'
  }, {
    href: '/main-dishes',
    title: 'Вторые блюда'
  }]
}, {
  href: '/vypechka',
  title: 'Выпечка',
  children: [{
    href: '/pirogi',
    title: 'Пироги'
  }, {
    href: '/cookies',
    title: 'Печенье'
  }, {
    href: '/baking',
    title: 'Выпечка'
  }]
}]

const rightItems: MenuItem[] = [{
  href: '/salaty-i-zakuski',
  title: 'Салаты и Закуски',
  children: [{
    href: '/salads',
    title: 'Салаты и закуски'
  }]
}, {
  href: '/sladkij-stol',
  title: 'Сладкий стол',
  children: [{
    href: '/cakes',
    title: 'Торты и пирожные'
  }, {
    href: '/drinks',
    title: 'Напитки и десерты'
  }, {
    href: '/krem-i-glazur-dlya-tortov',
    title: 'Крем и глазурь для тортов'
  }]
}, {
  href: '/zagotovki',
  title: 'Заготовки',
  children: [{
    href: '/conservation',
    title: 'Консервация'
  }]
}]

export const HeaderMenu = () => {
  return (
    <div className={styles.Wrapper}>
      <ul className={styles.List}>
        {leftItems.map((item) => (
          <React.Fragment key={item.href}>{renderMenuItem(item)}</React.Fragment>
        ))}
      </ul>
      <Link href="/" className={styles.Logo}>
          <img src="/images/logo.png" alt="" />
        </Link>
      <ul className={styles.List}>
        {rightItems.map((item) => (
          <React.Fragment key={item.href}>{renderMenuItem(item)}</React.Fragment>
        ))}
      </ul>
    </div>
  )
}

function renderMenuItem (item: MenuItem) {
  return (
    <li>
      <Link href={item.href} ><span>{item.title}</span></Link>
      <ul className={styles.SecondList}>
        {item.children.map((child) => (
          <li key={child.href}>
            <Link href={child.href} >{child.title}</Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
