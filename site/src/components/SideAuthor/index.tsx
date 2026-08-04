import React from 'react'

import styles from './styles.module.css'

export function SideAuthor () {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Image}>
        <img src="/images/author.jpg" alt="" />
      </div>
      <div className={styles.Name}>Галина Кундиус</div>
      <div className={styles.Sub}>автор блога</div>
      <div className={`${styles.Desc} text-gray-700 dark:text-gray-400`}>
        Приветствую Вас на&nbsp;моем блоге.<br />
        Здесь Вы найдете кулинарные рецепты, по&nbsp;которым я готовила для&nbsp;своей семьи в&nbsp;повседневной жизни и&nbsp;на&nbsp;торжества. Моим близким и&nbsp;друзьям очень нравится мое кулинарное мастерство, может быть Вам тоже понравится. Здесь все рецепты проверенные мной, это рецепты наших бабушек, подруг и&nbsp;знакомых. Ещё&nbsp;расскажу как я&nbsp;похудела без диеты, лекарств и&nbsp;препаратов.
      </div>
    </div>
  )
}
