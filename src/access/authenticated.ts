import type { Access } from 'payload'

/** Solo usuarios con sesión iniciada (administradores). */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Cualquiera puede leer. */
export const anyone: Access = () => true
