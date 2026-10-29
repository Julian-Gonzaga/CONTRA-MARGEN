import { doc, h2, p, quote } from './lexical'
import type { Variant } from './images'

// Contenido de demostración sobre el Premio Cervantes.
// Los autores de la revista (Valeria Montes, Julián Restrepo, Inés Galván) son ficticios.

export const sections = [
  { name: 'Premios', slug: 'premios', description: 'Galardones, jurados y la historia de los reconocimientos literarios en lengua española.' },
  { name: 'Poesía', slug: 'poesia', description: 'Poetas, libros y lecturas del verso en español.' },
  { name: 'Narrativa', slug: 'narrativa', description: 'Novela y cuento: autores, obras y territorios de ficción.' },
  { name: 'Ensayo', slug: 'ensayo', description: 'Ideas, crítica y pensamiento sobre la cultura.' },
] as const

export const authors = [
  {
    name: 'Valeria Montes',
    slug: 'valeria-montes',
    bio: 'Crítica literaria y editora de la sección de Premios. Escribe sobre narrativa contemporánea en español.',
  },
  {
    name: 'Julián Restrepo',
    slug: 'julian-restrepo',
    bio: 'Poeta y traductor. Coordina la sección de Poesía de CONTRA MARGEN.',
  },
  {
    name: 'Inés Galván',
    slug: 'ines-galvan',
    bio: 'Ensayista. Investiga la historia de las instituciones literarias hispánicas.',
  },
] as const

type SeedArticle = {
  title: string
  subtitle: string
  section: (typeof sections)[number]['slug']
  author: (typeof authors)[number]['slug']
  image: { initials: string; variant: Variant; alt: string }
  publishedAt: string
  status: 'published' | 'draft'
  body: ReturnType<typeof doc>
}

export const articles: SeedArticle[] = [
  {
    title: 'El Cervantes: la historia del premio mayor de la lengua',
    subtitle:
      'Desde 1976, cada 23 de abril, la Universidad de Alcalá se convierte en el centro simbólico de la literatura en español.',
    section: 'premios',
    author: 'ines-galvan',
    image: { initials: 'MC', variant: 'margin', alt: 'Ilustración abstracta: una franja negra y una roja junto a líneas de texto' },
    publishedAt: '2025-04-23T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('El Premio de Literatura en Lengua Castellana Miguel de Cervantes, que concede el Ministerio de Cultura de España, se creó en 1975 y se entregó por primera vez en 1976. El primer galardonado fue el poeta Jorge Guillén. Desde entonces se ha convertido en el reconocimiento más prestigioso de las letras en español: no premia un libro, sino una obra entera.'),
      p('La ceremonia tiene un calendario fijo. Se celebra cada 23 de abril, fecha asociada a la muerte de Cervantes y Día Internacional del Libro, en el Paraninfo de la Universidad de Alcalá, en la ciudad natal del autor del *Quijote*. Ese día el escritor premiado pronuncia un discurso que con los años se ha vuelto un género propio.'),
      h2('Un premio de dos orillas'),
      p('Una de sus señas de identidad es mirar a ambos lados del Atlántico. A lo largo de su historia ha reconocido a autores de España y de América Latina, y la lista de galardonados funciona casi como un mapa de la literatura hispánica del último medio siglo.'),
      p('En 1979 el premio se compartió entre Jorge Luis Borges y Gerardo Diego, uno de los episodios más recordados de su historia. Años después, en 1988, María Zambrano se convirtió en la primera mujer en recibirlo.'),
      quote('Leer la lista completa de premiados es leer, en voz baja, una historia de la lengua.'),
      h2('Más que un reconocimiento'),
      p('La dotación económica, de 125.000 euros, es importante, pero el verdadero valor del Cervantes es simbólico: coloca una obra en el centro de la conversación literaria y suele traducirse en reediciones, nuevas traducciones y nuevos lectores.'),
    ),
  },
  {
    title: 'Ida Vitale, la precisión como forma de asombro',
    subtitle:
      'La poeta uruguaya recibió el Cervantes 2018 con 95 años: un homenaje a una obra breve, exacta y luminosa.',
    section: 'poesia',
    author: 'julian-restrepo',
    image: { initials: 'IV', variant: 'circles', alt: 'Ilustración abstracta: tres círculos entrelazados en negro, rojo y naranja' },
    publishedAt: '2025-03-10T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('Ida Vitale nació en Montevideo en 1923 y pertenece a la llamada Generación del 45, uno de los grupos más fértiles de la literatura uruguaya. Su primer libro de poemas, *La luz de esta memoria*, apareció en 1949. Desde entonces ha construido una obra que desconfía de la grandilocuencia y busca la palabra justa.'),
      p('Su vida estuvo marcada por los desplazamientos. Durante la dictadura uruguaya vivió exiliada en México y más tarde se instaló durante años en Estados Unidos, antes de regresar a Montevideo. Esa experiencia de la distancia se filtra en sus versos sin volverse nunca consigna.'),
      h2('El premio a los 95 años'),
      p('El jurado le concedió el Cervantes correspondiente a 2018, y lo recibió en Alcalá de Henares en abril de 2019, con 95 años. Fue una de las ceremonias más emotivas del premio: una poeta de voz pequeña y mirada enorme, celebrada por toda la lengua.'),
      quote('En Vitale, cada palabra parece haber sido pesada en una balanza de joyero.'),
      p('Leerla hoy es un ejercicio de atención: poemas breves donde el lenguaje se examina a sí mismo, y donde la naturaleza, la memoria y el humor conviven con una rara serenidad.'),
    ),
  },
  {
    title: 'Cristina Peri Rossi: escribir desde el exilio',
    subtitle:
      'La autora uruguaya, radicada en Barcelona desde 1972, obtuvo el Cervantes 2021 por una obra que cruza la poesía, el cuento y la novela.',
    section: 'narrativa',
    author: 'valeria-montes',
    image: { initials: 'PR', variant: 'diagonal', alt: 'Ilustración abstracta: una diagonal negra sobre fondo rojo con un triángulo naranja' },
    publishedAt: '2025-02-14T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('Cristina Peri Rossi nació en Montevideo en 1941. En 1972, ante la persecución política en Uruguay, se exilió en España y se instaló en Barcelona, donde ha desarrollado buena parte de su carrera. El exilio, el deseo y la crítica al poder recorren una obra amplia y desafiante.'),
      p('Entre sus títulos más leídos está *La nave de los locos* (1984), una novela fragmentaria sobre el viaje y el desarraigo que se ha convertido en un clásico. Su poesía, desde *Evohé* (1971), abordó el erotismo con una libertad poco habitual para su tiempo.'),
      h2('Un discurso en otra voz'),
      p('Recibió el Cervantes correspondiente a 2021. Por motivos de salud no pudo asistir a la ceremonia de abril de 2022 en Alcalá de Henares, y su discurso fue leído por la actriz Cecilia Roth, en una escena que muchos recordaron como una forma de presencia a distancia: otra vez, el exilio.'),
      quote('Su literatura insiste en que el margen no es un lugar menor, sino un punto de vista.'),
      p('Su reconocimiento la sumó a la breve lista de mujeres premiadas con el Cervantes y confirmó la vigencia de una escritora que hizo de la extranjería una ética de la escritura.'),
    ),
  },
  {
    title: 'Rafael Cadenas y la poética del silencio',
    subtitle:
      'El poeta venezolano, Premio Cervantes 2022, es autor de "Derrota", uno de los poemas más citados de la lengua.',
    section: 'poesia',
    author: 'julian-restrepo',
    image: { initials: 'RC', variant: 'arc', alt: 'Ilustración abstracta: un arco rojo y naranja que emerge sobre fondo negro' },
    publishedAt: '2025-01-20T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('Rafael Cadenas nació en Barquisimeto, Venezuela, en 1930. Su juventud estuvo marcada por la militancia política y por un exilio en Trinidad durante la dictadura de Marcos Pérez Jiménez. De esa experiencia nació *Los cuadernos del destierro* (1960).'),
      p('En 1963 publicó *Derrota*, un largo poema en el que el yo se desnuda de toda pretensión heroica. Generaciones de lectores lo han leído como un antimanifiesto: una confesión de fragilidad que, paradójicamente, se volvió fuerza.'),
      h2('Una obra contra el ruido'),
      p('Con los años, la poesía de Cadenas se volvió más depurada, cercana al aforismo y a la meditación. Su reflexión sobre el lenguaje lo llevó también al ensayo, siempre con la misma idea: cuidar las palabras es una forma de cuidar la realidad.'),
      quote('Cadenas escribe como quien baja la voz para que el otro, por fin, escuche.'),
      p('Recibió el Cervantes correspondiente a 2022 en abril de 2023, con 92 años, como reconocimiento a una de las voces más hondas de la poesía latinoamericana.'),
    ),
  },
  {
    title: 'Luis Mateo Díez, el inventor de Celama',
    subtitle:
      'El narrador leonés, Premio Cervantes 2023, levantó un territorio imaginario a la altura de los grandes mapas de la ficción.',
    section: 'narrativa',
    author: 'valeria-montes',
    image: { initials: 'LM', variant: 'columns', alt: 'Ilustración abstracta: columnas verticales negra, roja y naranja sobre fondo claro' },
    publishedAt: '2024-11-05T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('Luis Mateo Díez nació en Villablino, León, en 1942. Es uno de los grandes narradores españoles de su generación y miembro de la Real Academia Española. Su prosa, oral y a la vez muy trabajada, recoge la tradición de los contadores de historias del noroeste peninsular.'),
      p('*La fuente de la edad* (1986) le dio el Premio Nacional de Narrativa y el Premio de la Crítica, y lo colocó en el centro de la novela española. Pero su gran construcción es Celama, un territorio imaginario que despliega en la trilogía *El reino de Celama*.'),
      h2('Un mapa propio'),
      p('Como el Yoknapatawpha de Faulkner o la Santa María de Onetti, Celama es un lugar inventado que termina siendo más verdadero que muchos lugares reales: un páramo de memoria, muerte y humor donde la literatura se pregunta por lo que se pierde.'),
      quote('Celama no aparece en ningún mapa, y sin embargo muchos lectores sabrían llegar.'),
      p('El Cervantes 2023, entregado en abril de 2024, reconoció una obra extensa y coherente que ha hecho de la imaginación un acto de resistencia frente al olvido.'),
    ),
  },
  {
    title: 'Álvaro Pombo, la inteligencia como novela',
    subtitle:
      'El escritor santanderino recibió el Cervantes 2024 por una obra que piensa, discute y se ríe de sí misma.',
    section: 'premios',
    author: 'ines-galvan',
    image: { initials: 'AP', variant: 'sun', alt: 'Ilustración abstracta: un círculo negro sobre fondo naranja y una franja roja' },
    publishedAt: '2025-04-24T10:00:00.000Z',
    status: 'published',
    body: doc(
      p('Álvaro Pombo nació en Santander en 1939. Poeta, novelista y estudioso de la filosofía, es miembro de la Real Academia Española. Su narrativa combina la observación psicológica más fina con una ironía que nunca renuncia a pensar.'),
      p('*El héroe de las mansardas de Mansard* (1983) ganó el Premio Herralde y lo dio a conocer como una de las voces más singulares de la narrativa española. Después llegaron títulos como *El metro de platino iridiado* (1990) y *Donde las mujeres* (1996), Premio Nacional de Narrativa.'),
      h2('Novelas que piensan'),
      p('En Pombo la trama es casi siempre una excusa para examinar cómo pensamos y cómo nos engañamos. Sus personajes hablan, argumentan, se equivocan, y el lector asiste a ese espectáculo con una mezcla de risa y desasosiego.'),
      quote('Pombo convierte la conversación en el acontecimiento central de la novela.'),
      p('El Cervantes correspondiente a 2024, entregado en abril de 2025, premió una trayectoria de más de cinco décadas que demuestra que la inteligencia también puede ser una forma de emoción.'),
    ),
  },
  {
    title: 'Borrador: ¿quién merece el próximo Cervantes?',
    subtitle: 'Notas internas de la redacción. Este artículo es un borrador y no debe verse en la portada.',
    section: 'ensayo',
    author: 'valeria-montes',
    image: { initials: '¿?', variant: 'grid', alt: 'Ilustración abstracta: cuadrícula de rectángulos de colores sobre fondo negro' },
    publishedAt: '2025-05-01T10:00:00.000Z',
    status: 'draft',
    body: doc(p('Texto en preparación. Pendiente de revisión editorial.')),
  },
]

export const socialAccounts = [
  { network: 'instagram', handle: '@contramargen' },
  { network: 'facebook', handle: 'Contra Margen' },
  { network: 'x', handle: '@contramargen' },
  { network: 'tiktok', handle: '@contramargen' },
  { network: 'youtube', handle: 'Contra Margen TV' },
  { network: 'spotify', handle: 'Contra Margen Podcast' },
] as const
