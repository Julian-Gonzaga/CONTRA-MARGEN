type Network = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube' | 'threads' | 'spotify'

const common = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

/** Íconos simples dibujados a mano (sin depender de librerías externas). */
export function SocialIcon({ network }: { network: Network }) {
  switch (network) {
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.5 3 2.5 5 5.5 5.5" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
        </svg>
      )
    case 'threads':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8" />
        </svg>
      )
    case 'spotify':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M7 9.5c3.5-1 7-.7 10 1M7.5 12.8c3-.8 5.7-.5 8 .8M8 15.8c2.3-.5 4.3-.3 6 .6" />
        </svg>
      )
  }
}
