'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'

// Se muestra si algo falla al cargar una página (por ejemplo, la base de datos está apagada)
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    console.error(error)
  }, [error])

  // router.refresh() vuelve a pedir los datos al servidor; reset() quita el error
  const retry = () =>
    startTransition(() => {
      router.refresh()
      reset()
    })

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="kicker text-rojo">Algo salió mal</p>
      <h1 className="mt-4 font-display text-4xl">No pudimos cargar esta página</h1>
      <p className="mt-4 text-lg text-muted">
        Puede ser un problema temporal de conexión. Inténtalo de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={retry}
        disabled={pending}
        className="kicker mt-10 inline-block cursor-pointer bg-ink px-6 py-3 text-paper hover:bg-rojo disabled:opacity-60"
      >
        {pending ? 'Reintentando…' : 'Reintentar'}
      </button>
    </div>
  )
}
