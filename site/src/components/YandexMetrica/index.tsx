import React from 'react'

export interface YandexMetricaProps {
  id: number
}

export const YandexMetrica = ({
  id
}: YandexMetricaProps) => {
  return (
    <>
      <a
        href={`https://metrika.yandex.ru/stat/?id=${id}&amp;from=informer`}
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
      <script dangerouslySetInnerHTML={{ __html: `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${id}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              trackHash:true
        });
      ` }} />
    </>
  )
}
