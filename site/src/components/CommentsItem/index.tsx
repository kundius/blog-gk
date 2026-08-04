import React from 'react'
import { MdAccessTime } from 'react-icons/md'
import { FaUserAlt } from 'react-icons/fa'
import { BsFillChatQuoteFill } from 'react-icons/bs'
import { AiOutlineEdit } from 'react-icons/ai'
import { DateTime } from 'luxon'

import * as styles from './styles.module.css'
import * as api from './api'
import useSWR from 'swr'

export interface CommentsItemData {
  id: string
  content: string
  raw: string
  isBlocked: boolean
  isChanged: boolean
  createdAt: string
  updatedAt: string
  authorName: string
  parent?: {
    id: string
    content: string
    authorName: string
  }
}

export interface CommentsItemProps {
  data: CommentsItemData
  onReply?: (data: CommentsItemData) => void
  scrollToComment?: (id: string) => void
  isHighlight?: boolean
}

export function CommentsItem ({
  data,
  onReply,
  scrollToComment,
  isHighlight = false
}: CommentsItemProps) {
  const { parent, authorName, id, createdAt, updatedAt, content, isChanged } = data

  const [avatarKey, avatarFetcher] = api.getAvatar({ id })

  const { data: avatarResult } = useSWR<api.GetAvatarData>(avatarKey, avatarFetcher)

  return (
    <div
      className={`${styles.Wrapper} ${isHighlight ? styles.WrapperHighlight : ''}`}
      id={`comment-${id}`}
    >
      <div className={styles.Avatar}>
        <img src={avatarResult?.data} alt="" />
      </div>
      <div className={styles.Body}>
        <div className={styles.Headline}>
          <div className={styles.Name}>{authorName}</div>
          <div className={styles.Date}>
            <MdAccessTime /> {DateTime.fromISO(createdAt).setLocale('ru').toRelative()}
          </div>
          {isChanged && (
            <span
              className="italic text-gray-400 text-base ml-4"
              title={`изменен ${DateTime.fromISO(updatedAt).setLocale('ru').toRelative()}`}
            >
              <AiOutlineEdit />
            </span>
          )}
        </div>
        {renderParent()}
        <div className={styles.Text}>
          {content}
        </div>
        <div className="flex space-x-4">
          {onReply && (
            <button
              className={styles.Action}
              onClick={() => onReply(data)}
              type="button"
            >
              Ответить
            </button>
          )}
        </div>
      </div>
    </div>
  )
  
  function renderParent () {
    if (!parent) return

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      scrollToComment?.(parent.id)
    }

    return (
      <a className={styles.Quote} href={`#comment-${parent.id}`} onClick={handleClick}>
        <span className={styles.QuoteIcon}>
          <BsFillChatQuoteFill />
        </span>
        <span className={styles.QuoteText}>
          <em>{parent.authorName} пишет:</em><br />
          {parent.content}
        </span>
      </a>
    )
  }
}
