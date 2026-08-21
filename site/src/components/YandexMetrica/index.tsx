'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

export interface YandexMetricaProps {
  id: number
}

declare global {
  interface Window {
    ym?: (id: number, action: string, payload?: unknown) => void
  }
}

const CounterInit = ({ id }: YandexMetricaProps) => (
  <Script id="yandex-metrika" strategy="afterInteractive">
    {`
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${id}, "init", {
        defer: true,
        trackHash: true,
        clickmap: true,
        accurateTrackBounce: true,
        trackLinks: true,
        referrer: document.referrer,
        url: location.href
      });
    `}
  </Script>
)

const HitTracker = ({ id }: YandexMetricaProps) => {
  const pathname = usePathname()

  useEffect(() => {
    window.ym?.(id, 'hit', window.location.href)
  }, [id, pathname])

  return null
}

export const YandexMetrica = ({ id }: YandexMetricaProps) => {
  return (
    <>
      <CounterInit id={id} />
      <HitTracker id={id} />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{
              position: 'absolute',
              left: '-9999px'
            }}
            alt=""
          />
        </div>
      </noscript>
      <a
        href={`https://metrika.yandex.ru/stat/?id=${id}&from=informer`}
        target="_blank"
        rel="nofollow"
      >
        <img
          src={`https://informer.yandex.ru/informer/${id}/3_0_FFFFFFFF_EFEFEFFF_0_pageviews`}
          style={{
            width: 88,
            height: 31,
            border: 0
          }}
          alt="Яндекс.Метрика"
          title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
          className="ym-advanced-informer"
          data-cid={id}
          data-lang="ru"
        />
      </a>
    </>
  )
}
