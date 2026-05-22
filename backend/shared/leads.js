import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '..', '..', 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
const LEADS_FILE = resolve(DATA_DIR, 'leads.json')

function readLeads() {
  try {
    if (!existsSync(LEADS_FILE)) return []
    return JSON.parse(readFileSync(LEADS_FILE, 'utf-8'))
  } catch { return [] }
}

function writeLeads(data) {
  writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Tipos de leads que se capturan:
 * - chat: usuario que consultó en el chatbot (origen automático)
 * - contact: usuario que llenó formulario de contacto
 * - checkout: usuario que inició proceso de compra
 * - testimonial: usuario que dejó testimonio
 */
export function captureLead({ source, name, phone, email, interest, message, product, page }) {
  const leads = readLeads()
  const lead = {
    id: `LEAD-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    source: source || 'chat', // chat | contact | checkout | testimonial
    name: (name || '').slice(0, 100),
    phone: (phone || '').slice(0, 20),
    email: (email || '').slice(0, 100),
    interest: (interest || '').slice(0, 200),
    message: (message || '').slice(0, 500),
    product: product || null,
    page: page || null,
    status: 'new', // new | contacted | qualified | converted | lost
    score: 0, // lead score based on engagement
  }
  leads.push(lead)
  writeLeads(leads)
  return lead
}

/**
 * Auto-capture lead from chat context.
 * Called after a user shows purchase intent in the chatbot.
 */
export function captureChatLead({ message, name, phone, productContext }) {
  const hasInterest = /comprar|pedido|quiero|precio|cuanto|orden|pagar|pago|móvil/i.test(message)
  if (!hasInterest) return null

  return captureLead({
    source: 'chat',
    name,
    phone,
    interest: `Mostró interés en comprar: "${message.slice(0, 80)}..."`,
    product: productContext?.product || null,
    message: message.slice(0, 200),
  })
}

export function getLeads({ status, source, limit = 50 }) {
  let leads = readLeads()
  if (status) leads = leads.filter(l => l.status === status)
  if (source) leads = leads.filter(l => l.source === source)
  return leads.reverse().slice(0, limit)
}

export function updateLeadStatus(leadId, status, notes) {
  const leads = readLeads()
  const lead = leads.find(l => l.id === leadId)
  if (!lead) return null
  lead.status = status
  lead.updatedAt = new Date().toISOString()
  if (notes) lead.notes = notes.slice(0, 500)
  writeLeads(leads)
  return lead
}

export function getLeadStats() {
  const leads = readLeads()
  const today = new Date().toISOString().split('T')[0]
  return {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    today: leads.filter(l => l.timestamp.startsWith(today)).length,
    bySource: {
      chat: leads.filter(l => l.source === 'chat').length,
      contact: leads.filter(l => l.source === 'contact').length,
      checkout: leads.filter(l => l.source === 'checkout').length,
    },
  }
}
