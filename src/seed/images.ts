import sharp from 'sharp'

// Genera ilustraciones abstractas (rojo, negro, naranja) para no depender de
// fotos con derechos de autor. Cada una lleva las iniciales del tema.

const PAPER = '#faf6ee'
const INK = '#151312'
const ROJO = '#b42318'
const NARANJA = '#e2611b'

type Variant = 'arc' | 'columns' | 'sun' | 'grid' | 'diagonal' | 'circles' | 'margin'

function svg(initials: string, variant: Variant): string {
  const W = 1600
  const H = 1000
  const shapes: Record<Variant, string> = {
    arc: `<rect width="${W}" height="${H}" fill="${INK}"/>
      <circle cx="1150" cy="1000" r="620" fill="${ROJO}"/>
      <circle cx="1150" cy="1000" r="380" fill="${NARANJA}"/>
      <rect x="160" y="140" width="14" height="720" fill="${PAPER}"/>`,
    columns: `<rect width="${W}" height="${H}" fill="${PAPER}"/>
      <rect x="180" y="0" width="260" height="${H}" fill="${INK}"/>
      <rect x="520" y="200" width="120" height="${H}" fill="${ROJO}"/>
      <rect x="700" y="420" width="60" height="${H}" fill="${NARANJA}"/>`,
    sun: `<rect width="${W}" height="${H}" fill="${NARANJA}"/>
      <circle cx="520" cy="500" r="300" fill="${INK}"/>
      <rect x="0" y="760" width="${W}" height="240" fill="${ROJO}"/>`,
    grid: `<rect width="${W}" height="${H}" fill="${INK}"/>
      ${Array.from({ length: 6 }, (_, i) =>
        Array.from({ length: 4 }, (_, j) =>
          `<rect x="${140 + i * 140}" y="${160 + j * 170}" width="90" height="120" fill="${(i + j) % 3 === 0 ? ROJO : (i + j) % 3 === 1 ? NARANJA : PAPER}" opacity="${0.55 + ((i * j) % 4) * 0.15}"/>`,
        ).join(''),
      ).join('')}`,
    diagonal: `<rect width="${W}" height="${H}" fill="${ROJO}"/>
      <polygon points="0,${H} ${W * 0.62},0 ${W},0 ${W * 0.38},${H}" fill="${INK}"/>
      <polygon points="${W * 0.78},${H} ${W},${H * 0.55} ${W},${H}" fill="${NARANJA}"/>`,
    circles: `<rect width="${W}" height="${H}" fill="${PAPER}"/>
      <circle cx="450" cy="500" r="330" fill="none" stroke="${INK}" stroke-width="38"/>
      <circle cx="700" cy="500" r="330" fill="none" stroke="${ROJO}" stroke-width="38"/>
      <circle cx="950" cy="500" r="330" fill="none" stroke="${NARANJA}" stroke-width="38"/>`,
    margin: `<rect width="${W}" height="${H}" fill="${PAPER}"/>
      <rect x="0" y="0" width="420" height="${H}" fill="${INK}"/>
      <rect x="420" y="0" width="24" height="${H}" fill="${ROJO}"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect x="540" y="${170 + i * 76}" width="${520 - (i % 3) * 120}" height="14" fill="${INK}" opacity="0.18"/>`).join('')}
      <rect x="540" y="${170 + 4 * 76}" width="380" height="14" fill="${NARANJA}"/>`,
  }

  const textColor = variant === 'columns' || variant === 'circles' || variant === 'margin' ? INK : PAPER

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${shapes[variant]}
    <text x="${W - 120}" y="${H - 110}" text-anchor="end" font-family="Georgia, 'Times New Roman', serif"
      font-size="300" font-style="italic" font-weight="700" fill="${textColor}" opacity="0.92">${initials}</text>
  </svg>`
}

export async function makeIllustration(initials: string, variant: Variant): Promise<Buffer> {
  return sharp(Buffer.from(svg(initials, variant))).jpeg({ quality: 86 }).toBuffer()
}

export type { Variant }
