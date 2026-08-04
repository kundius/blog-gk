import React from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { VscClose } from 'react-icons/vsc'
import md5 from 'blueimp-md5'
import { BsFillChatQuoteFill } from 'react-icons/bs'
import { TiArrowBackOutline } from 'react-icons/ti'
import TextareaAutosize from 'react-textarea-autosize'

import { Spinner } from '@components/Spinner'

import * as styles from './styles.module.css'

export interface CommentsFormReply {
  id: string
  content: string
  authorName: string
}

export interface CommentsFormProps {
  placeholder?: string
  formId?: string
  formRef?: React.MutableRefObject<HTMLDivElement | null>
  fieldRef?: React.MutableRefObject<HTMLTextAreaElement | null>
  reply?: CommentsFormReply
  avatar?: string
  isLoading?: boolean
  content?: string
  onChangeContent?: (value: string) => void
  authorName?: string
  onChangeAuthorName?: (value: string) => void
  authorEmail?: string
  onChangeAuthorEmail?: (value: string) => void
  onRemoveReply?: () => void
  scrollToComment?: (value: string) => void
  onCancel?: () => void
  onSubmit?: () => void
}

export function CommentsForm ({
  formId,
  placeholder,
  formRef,
  fieldRef,
  isLoading = false,
  onCancel,
  onSubmit,
  content,
  onChangeContent,
  authorEmail,
  authorName,
  onChangeAuthorEmail,
  onChangeAuthorName,
  reply,
  avatar,
  onRemoveReply,
  scrollToComment
}: CommentsFormProps) {
  return (
    <div className={styles.Wrapper} ref={formRef}>
      <div className={`${styles.Avatar} mt-10`}>
        <img src={getAvatar()} alt="" />
      </div>
      <div className={styles.Form}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className={styles.Input}
            value={authorName}
            onChange={e => onChangeAuthorName?.(e.target.value)}
            placeholder="Ваше имя:"
          />
          <input
            className={styles.Input}
            value={authorEmail}
            onChange={e => onChangeAuthorEmail?.(e.target.value)}
            placeholder="Ваш e-mail:"
          />
        </div>
        <label className={styles.Field} htmlFor={formId}>
          {renderReply()}
          <span className="flex">
            <TextareaAutosize
              className={styles.Textarea}
              id={formId}
              ref={fieldRef}
              minRows={1}
              readOnly={isLoading}
              placeholder={placeholder}
              value={content}
              onChange={e => onChangeContent?.(e.target.value)}
            />
            {onCancel && (
              <button
                className={styles.Action}
                type="button"
                onClick={onCancel}
              >
                <TiArrowBackOutline />
              </button>
            )}
            {onSubmit && (
              <button
                className={styles.Action}
                disabled={isLoading}
                type="button"
                onClick={onSubmit}
              >
                {isLoading ? <Spinner /> : <AiOutlineSend />}
              </button>
            )}
          </span>
        </label>
      </div>
    </div>
  )

  function renderReply () {
    if (!reply) return

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      scrollToComment?.(reply.id)
    }

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      onRemoveReply?.()
    }

    return (
      <a className={styles.Quote} href={`#comment-${reply.id}`} onClick={handleClick}>
        <span className={styles.QuoteIcon}>
          <BsFillChatQuoteFill />
        </span>
        <span className={styles.QuoteText}>
          <em>{reply.authorName} пишет:</em><br />
          {reply.content}
        </span>
        {onRemoveReply && (
          <button className={styles.QuoteRemove} type="button" onClick={handleRemove}>
            <VscClose />
          </button>
        )}
      </a>
    )
  }

  function getAvatar() {
    return avatar || `https://www.gravatar.com/avatar/${md5(authorEmail)}?d=robohash`
  }
}
