import { notFound } from 'next/navigation'

// Cualquier URL que no exista muestra la página 404 de la revista
export default function CatchAll() {
  notFound()
}
