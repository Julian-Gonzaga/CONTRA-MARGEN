import { SOCIAL_NETWORKS } from '@/globals/SocialLinks'
import { safeHref } from '@/lib/safeHref'
import type { SocialLink } from '@/payload-types'

import { SocialIcon } from './SocialIcon'

type Account = NonNullable<SocialLink['accounts']>[number]

const networkLabel = (value: Account['network']) =>
  SOCIAL_NETWORKS.find((n) => n.value === value)?.label ?? value

/**
 * Bandeja de redes sociales. Si una cuenta no tiene enlace (o el enlace no es
 * seguro), el ícono se muestra sin enlazar y marcado como "próximamente".
 */
export function SocialTray({ accounts }: { accounts: Account[] }) {
  if (accounts.length === 0) return null

  return (
    <section aria-labelledby="redes-titulo" data-testid="social-tray">
      <h2 id="redes-titulo" className="kicker text-naranja">
        Síguenos
      </h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {accounts.map((account, index) => {
          const label = networkLabel(account.network)
          const href = account.url ? safeHref(account.url) : null
          const base =
            'inline-flex items-center gap-2 border px-3 py-2 font-sans text-sm transition-colors'

          return (
            <li key={account.id ?? index}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${base} border-paper/40 text-paper hover:border-naranja hover:text-naranja`}
                >
                  <SocialIcon network={account.network} />
                  <span>{account.handle || label}</span>
                  <span className="sr-only"> en {label} (se abre en otra pestaña)</span>
                </a>
              ) : (
                <span
                  className={`${base} cursor-default border-paper/25 text-paper/75`}
                  title={`${label}: próximamente`}
                  data-social-pending={account.network}
                >
                  <SocialIcon network={account.network} />
                  <span>{account.handle || label}</span>
                  <span className="sr-only"> en {label}, próximamente</span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 font-sans text-xs text-paper/65">Cuentas próximamente enlazadas.</p>
    </section>
  )
}
