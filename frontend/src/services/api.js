const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function sendChatMessage(message, context = {}, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context, history }),
  })
  if (!res.ok) throw new Error('Error al comunicarse con el médico')
  return res.json()
}

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Error al cargar productos')
  return res.json()
}

export async function sendContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al enviar mensaje')
  return res.json()
}

export async function getTestimonials() {
  const res = await fetch(`${API_BASE}/testimonials`)
  if (!res.ok) throw new Error('Error al cargar testimonios')
  return res.json()
}

export async function submitTestimonial(data) {
  const res = await fetch(`${API_BASE}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al enviar testimonio')
  }
  return res.json()
}
