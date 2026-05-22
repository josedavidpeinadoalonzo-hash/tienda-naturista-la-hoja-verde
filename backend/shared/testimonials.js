import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '..', 'data')
const DATA_FILE = resolve(DATA_DIR, 'testimonials.json')

const defaultTestimonials = [
  {
    id: 1,
    name: 'María Guadalupe',
    text: 'El médico naturista me recomendó el té detox y los resultados fueron increíbles. Bajé de peso naturalmente y tengo mucha más energía.',
    rating: 5,
    date: '2025-10-15',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    text: 'Llevo años con problemas de ansiedad y los suplementos de ashwagandha que me recetaron cambiaron mi vida. Recomiendo totalmente.',
    rating: 5,
    date: '2025-11-02',
  },
  {
    id: 3,
    name: 'Ana Patricia',
    text: 'La atención personalizada marca la diferencia. No solo compras productos, recibes asesoría de un verdadero profesional.',
    rating: 5,
    date: '2025-11-20',
  },
]

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

export function getTestimonials() {
  ensureDir()
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(defaultTestimonials, null, 2), 'utf-8')
    return [...defaultTestimonials]
  }
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return [...defaultTestimonials]
  }
}

export function addTestimonial({ name, text, rating }) {
  const testimonials = getTestimonials()
  const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1
  const entry = {
    id: newId,
    name,
    text,
    rating: typeof rating === 'number' ? Math.max(1, Math.min(5, rating)) : 5,
    date: new Date().toISOString().split('T')[0],
  }
  testimonials.push(entry)
  ensureDir()
  writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2), 'utf-8')
  return entry
}
