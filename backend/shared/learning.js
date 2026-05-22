import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '..', '..', 'data')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const CONVERSATIONS_FILE = resolve(DATA_DIR, 'conversations.json')
const LEARNINGS_FILE = resolve(DATA_DIR, 'learnings.json')

function readJSON(file) {
  try {
    if (!existsSync(file)) return []
    return JSON.parse(readFileSync(file, 'utf-8'))
  } catch { return [] }
}

function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Log an anonymized conversation turn (message + reply)
 * Used to improve the bot over time by analyzing patterns.
 */
export function logConversation({ message, reply, context, sessionId }) {
  const conversations = readJSON(CONVERSATIONS_FILE)
  conversations.push({
    sessionId: sessionId || 'anon',
    timestamp: new Date().toISOString(),
    message: message.slice(0, 500),
    reply: reply.slice(0, 1000),
    context: context || null,
  })
  // Keep only last 10,000 turns for storage efficiency
  const trimmed = conversations.slice(-10000)
  writeJSON(CONVERSATIONS_FILE, trimmed)
  return trimmed.length
}

/**
 * Extract learnings from conversations: count product mentions, common questions
 */
export function extractLearnings() {
  const conversations = readJSON(CONVERSATIONS_FILE)
  const learnings = readJSON(LEARNINGS_FILE)

  const productKeywords = {
    'Crema Azufre': ['azufre', 'ácido bórico'],
    'Crema Rompe Dolor': ['rompe dolor', 'árnica', 'cannabis'],
    'Aceite Medicinal': ['aceite medicinal', 'masaje'],
    'Crema Aloe Vera': ['aloe vera', 'hidratante', 'colágeno'],
  }

  const mentions = {}
  for (const [product, keywords] of Object.entries(productKeywords)) {
    mentions[product] = conversations.filter(c =>
      keywords.some(k => c.message.toLowerCase().includes(k))
    ).length
  }

  const totalProcessed = conversations.length

  const summary = {
    lastUpdated: new Date().toISOString(),
    totalConversations: totalProcessed,
    productMentions: mentions,
    topProducts: Object.entries(mentions)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
    // Track what users ask about most
    commonTopics: {
      prices: conversations.filter(c => /precio|cuanto cuesta|costo/i.test(c.message)).length,
      ingredients: conversations.filter(c => /ingrediente|activo|componente/i.test(c.message)).length,
      pain: conversations.filter(c => /dolor|muscular|articular/i.test(c.message)).length,
      skin: conversations.filter(c => /piel|acné|rosácea|mancha|arruga|seca/i.test(c.message)).length,
      payment: conversations.filter(c => /pago|móvil|transferencia/i.test(c.message)).length,
      purchase: conversations.filter(c => /comprar|pedido|quiero|orden/i.test(c.message)).length,
    },
  }

  // Merge with previous learnings
  const merged = [...learnings.filter(l => l.date !== summary.lastUpdated.split('T')[0]), summary]
  writeJSON(LEARNINGS_FILE, merged.slice(-365)) // Keep 1 year

  return summary
}

/**
 * Get current statistics for dashboard / monitoring
 */
export function getLearningStats() {
  const conversations = readJSON(CONVERSATIONS_FILE)
  const learnings = readJSON(LEARNINGS_FILE)
  return {
    totalConversations: conversations.length,
    recentLearnings: learnings.slice(-7).reverse(),
    lastExtract: learnings[learnings.length - 1]?.lastUpdated || null,
  }
}
