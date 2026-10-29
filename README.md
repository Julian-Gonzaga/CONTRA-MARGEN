# CONTRA MARGEN

Revista cultural digital hecha con **Next.js + Payload CMS + PostgreSQL (Docker)**.

## Requisitos (una sola vez)

- Node.js 22 o superior
- Docker Desktop (abierto y con la ballena en verde)
- Git

## Puesta en marcha

Abre una terminal en esta carpeta (`contra-margen`) y ejecuta:

```powershell
# 1. Instalar dependencias
npm install

# 2. Crear tu archivo de variables (solo la primera vez)
copy .env.example .env      # luego edita .env con tus contraseñas

# 3. Encender la base de datos
docker compose up -d

# 4. Cargar datos iniciales: administrador, secciones, autores y artículos de ejemplo
npm run seed

# 5. Arrancar el sitio
npm run dev
```

- Sitio público: http://localhost:3000
- Panel de administración: http://localhost:3000/admin (con `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`)

Para apagar la base de datos: `docker compose down` (los datos se conservan).

## Qué hay en el panel

| Colección | Para qué |
|---|---|
| Artículos | Título, subtítulo, slug, autor, sección, imagen, texto, video (YouTube/Vimeo) y estado borrador/publicado |
| Autores | Nombre, biografía y foto |
| Secciones | Nombre, slug y descripción (aparecen en el menú) |
| Imágenes | Biblioteca de imágenes (JPG, PNG, WebP, AVIF; máx. 5 MB) |
| Administradores | Usuarios con acceso al panel |
| Redes sociales | Bandeja de cuentas del pie de página. Sin enlace = ícono sin enlazar |

Los **borradores no aparecen** en el sitio ni en la API pública.

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo |
| `npm run build` | Compila para producción (necesita la base de datos encendida) |
| `npm run typecheck` | Revisa tipos de TypeScript |
| `npm run lint` | Revisa estilo y errores comunes |
| `npm run test:int` | Pruebas de funciones (Vitest) |
| `npm run test:e2e` | Pruebas en navegador (Playwright con Microsoft Edge) |
| `npm run seed` | Vuelve a cargar lo que falte de los datos iniciales |

## Estructura

```
src/
  app/(frontend)/     Páginas públicas: portada, artículo, sección, 404
  app/(payload)/      Panel /admin y API (generado por Payload)
  collections/        Definición de Artículos, Autores, Secciones, Imágenes, Usuarios
  globals/            Bandeja de redes sociales
  components/         Piezas visuales (tarjetas, encabezado, pie, video…)
  lib/                Funciones de apoyo (slug, video, enlaces seguros, consultas)
  seed/               Datos de ejemplo sobre el Premio Cervantes
tests/
  int/                Pruebas Vitest
  e2e/                Pruebas Playwright
```

## Antes de publicar en internet

- Cambia `ADMIN_PASSWORD`, `POSTGRES_PASSWORD` y `PAYLOAD_SECRET` por valores largos y aleatorios.
- Pon un límite de intentos de inicio de sesión por IP (en el proxy o hosting). Hoy, 5 fallos
  bloquean la cuenta 10 minutos, y eso permite que un tercero bloquee al administrador a propósito.
- Las imágenes de borradores son públicas si alguien adivina su URL: no subas imágenes confidenciales.
- Si la base de datos se cae, el panel `/admin` muestra un error genérico de Payload en inglés.

> El contenido de ejemplo es demostrativo. Los autores de la revista (Valeria Montes,
> Julián Restrepo, Inés Galván) son ficticios. Verifica los datos antes de publicar en internet.
