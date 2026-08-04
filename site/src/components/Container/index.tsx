import React from 'react'

import * as styles from './styles.module.css'

export const Container = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) =>
  <div className={`${styles.Container} ${className}`} {...props} />
