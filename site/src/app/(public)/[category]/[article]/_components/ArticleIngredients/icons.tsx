import React from 'react'

export type IngredientKind =
  | 'egg'
  | 'milk'
  | 'cheese'
  | 'butter'
  | 'oil'
  | 'flour'
  | 'sugar'
  | 'leavening'
  | 'nuts'
  | 'driedFruits'
  | 'chocolate'
  | 'fruit'
  | 'citrus'
  | 'vegetable'
  | 'greens'
  | 'spices'
  | 'meat'
  | 'fish'
  | 'mushroom'
  | 'legumes'
  | 'water'
  | 'alcohol'
  | 'gelatin'
  | 'sauce'
  | 'jam'
  | 'fallback'

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>

function base (children: React.ReactNode): IconComponent {
  return (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

const Icons: Record<IngredientKind, IconComponent> = {
  egg: base(
    <>
      <ellipse cx="12" cy="14" rx="8" ry="7" />
      <path d="M12 7c-2-4 2-4 0 0" />
    </>
  ),
  milk: base(
    <>
      <path d="M8 3h8v4l2 3v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V10l2-3V3z" />
      <path d="M8 3c0 1.5 1 2 1 2M12 3c0 1.5 1 2 1 2M16 3c0 1.5-1 2-1 2" />
      <path d="M6 10c1.2.7 2.4 1 3.6 1 1.6 0 2.8-.3 4-1" />
    </>
  ),
  cheese: base(
    <>
      <path d="M3 8l9-4 9 4v3l-1 3 1 3-2 5H5l-2-5 1-3-1-3V8z" />
      <circle cx="9" cy="14" r="1" />
      <circle cx="14" cy="17" r="1" />
      <circle cx="15" cy="11" r="1" />
    </>
  ),
  butter: base(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 12h18" />
      <path d="M14 5v7" />
    </>
  ),
  oil: base(
    <>
      <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      <path d="M12 17a2.5 2.5 0 0 0 2.5-2.5" />
    </>
  ),
  flour: base(
    <>
      <path d="M4 10l8-4 8 4" />
      <path d="M4 10v10M12 6v14M20 10v10" />
    </>
  ),
  sugar: base(
    <>
      <path d="M6 3h12l2 8a6 6 0 0 1-4 2 4 4 0 0 1-4-2 4 4 0 0 1-4 2 6 6 0 0 1-4-2l2-8z" />
      <path d="M6 3c1.5 3 4.5 3 6 0M12 3c1.5 3 4.5 3 6 0" />
    </>
  ),
  leavening: base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  nuts: base(
    <>
      <path d="M12 3c3 1 5 3.5 5 7a8 8 0 0 1-5 7.5A8 8 0 0 1 7 10c0-3.5 2-6 5-7z" />
      <path d="M9 10c1-1.5 3-1.5 4-2" />
    </>
  ),
  driedFruits: base(
    <>
      <ellipse cx="12" cy="12" rx="6" ry="8" />
      <path d="M10 6c1-2 3-2 4-1M8 9c-1.5.5-2 1-3 1M9 17c-2 .5-3 1-4 1" />
    </>
  ),
  chocolate: base(
    <>
      <rect x="3" y="3" width="12" height="18" rx="1" />
      <path d="M15 8l2-1v3l2-1M15 14l2-1v3l2-1" />
      <path d="M7 8h4M7 12h4M7 16h4" />
    </>
  ),
  fruit: base(
    <>
      <circle cx="9" cy="14" r="5" />
      <path d="M14 7c1 1.5 1 3 .5 4.5" />
      <path d="M8 3c1 2 2 3 4 4" />
    </>
  ),
  citrus: base(
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M9 3l1 3M15 3l-1 3" />
      <path d="M12 13l3-3" />
    </>
  ),
  vegetable: base(
    <>
      <path d="M12 21c-4 0-7-3-7-7 0-2 .5-4 1.5-6C8 6 10 5 12 5s4 1 5.5 3c1 2 1.5 4 1.5 6 0 4-3 7-7 7z" />
      <path d="M12 5c0-2 2-2 2-2" />
    </>
  ),
  greens: base(
    <>
      <path d="M12 20V8" />
      <path d="M12 8c3 0 5 2 5 5-2 1-4 1-5 0M12 8c-3 0-5 2-5 5 2 1 4 1 5 0" />
      <path d="M12 12c2 0 3-2 3-4-2 0-3 2-3 4zM12 12c-2 0-3-2-3-4 2 0 3 2 3 4z" />
    </>
  ),
  spices: base(
    <>
      <path d="M14 5a3 3 0 0 1 5 0 3 3 0 0 1 0 5l-9 9a3 3 0 0 1-5 0" />
      <path d="M17 2l2-1-1 2" />
    </>
  ),
  meat: base(
    <>
      <path d="M5 19l14-14" />
      <path d="M7 21a4 4 0 0 1-4-4c0-1 .5-2 1.5-3L14 4.5a3 3 0 0 1 4.2.3 3 3 0 0 1 .3 4.2L9 19.5c-1 1-2 1.5-2 1.5z" />
    </>
  ),
  fish: base(
    <>
      <path d="M3 12c6-4 12-4 18 0-6 4-12 4-18 0z" />
      <path d="M3 12c1-3 3-5 5-6M3 12c1 3 3 5 5 6" />
      <path d="M12 9l3-3M15 12l3 1" />
    </>
  ),
  mushroom: base(
    <>
      <path d="M5 4a7 7 0 0 1 14 0" />
      <path d="M4 6a3 3 0 0 0 6 0M10 6a3 3 0 0 0 6 0" />
      <path d="M12 11v9M12 17h-2M12 20h-3" />
    </>
  ),
  legumes: base(
    <>
      <path d="M12 3c-1 3-1 6 0 8 1-2 1-5 0-8z" />
      <path d="M12 11c2 0 4-1 5-2-2-1-4-1-5 2zM12 11c-2 0-4-1-5-2 2-1 4-1 5 2z" />
      <path d="M12 21c-2 0-3-3-3-5h6c0 2-1 5-3 5z" />
    </>
  ),
  water: base(
    <>
      <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0C6 9 12 2 12 2z" />
      <path d="M9 14a3 3 0 0 0 3 3" />
    </>
  ),
  alcohol: base(
    <>
      <path d="M8 3h8v6l4 4v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7l4-4V3z" />
      <path d="M5 13h14M10 5h4" />
    </>
  ),
  gelatin: base(
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 9h16M9 9v4a3 3 0 0 0 6 0V9" />
    </>
  ),
  sauce: base(
    <>
      <path d="M6 3h12l1 4a4 4 0 0 1-8 0 4 4 0 0 1-8 0l1-4z" />
      <path d="M10 5a2 2 0 0 0 4 0M10 5a2 2 0 0 0 4 0" />
      <path d="M12 13v8M12 13c-3 0-5 2-5 4" />
    </>
  ),
  jam: base(
    <>
      <path d="M7 3h10l2 3-3 6-4-2-4 2-3-6 2-3z" />
      <path d="M8 14c-1 1-1 2 0 3M16 14c1 1 1 2 0 3" />
      <path d="M9 17c2 2 4 2 6 0" />
    </>
  ),
  fallback: base(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12l3 2M12 8v4" />
    </>
  )
}

export interface IngredientIconProps {
  kind: IngredientKind
  className?: string
}

export function IngredientIcon ({ kind, className }: IngredientIconProps) {
  const Icon = Icons[kind]
  return <Icon className={className} />
}

export { Icons }