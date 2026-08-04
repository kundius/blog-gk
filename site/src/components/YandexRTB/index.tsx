import React, { useRef, useEffect } from 'react'

export interface YandexRTBProps {
  id: string
  horizontalAlign?: boolean
}

export const YandexRTB = ({
  id,
  horizontalAlign = true
}: YandexRTBProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.innerHTML = ''

    const yaDiv = document.createElement('div')
    yaDiv.setAttribute('id', `yandex_rtb_${id}`)
    ref.current.appendChild(yaDiv)
  
    const yaScript = document.createElement('script')
    yaScript.setAttribute('type', 'text/javascript')
    yaScript.innerHTML = `
window.yaContextCb.push(()=>{
  Ya.Context.AdvManager.render({
    renderTo: 'yandex_rtb_${id}',
    blockId: '${id}',
    horizontalAlign: ${horizontalAlign ? 'true' : 'false'},
  })
})
`
    ref.current.appendChild(yaScript)
  }, [])

  return (
    <div ref={ref} />
  )
}
