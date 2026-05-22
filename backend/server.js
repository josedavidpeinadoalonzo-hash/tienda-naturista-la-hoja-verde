import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '..', '.env') })

import express from 'express'
import cors from 'cors'
import { SYSTEM_PROMPT } from './shared/systemPrompt.js'
import { getProductsByCategory, searchProducts } from './shared/products.js'
import { getTestimonials, addTestimonial } from './shared/testimonials.js'
import { logConversation, extractLearnings, getLearningStats } from './shared/learning.js'
import { createOrder, getOrders, updateOrderStatus, getOrderStats, getPaymentConfig, updatePaymentConfig } from './shared/orders.js'
import { captureLead, captureChatLead, getLeads, updateLeadStatus, getLeadStats } from './shared/leads.js'

const app = express()
const PORT = 9001

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'
const GROQ_KEY = process.env.GROQ_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY

app.use(cors())
app.use(express.json())

// ===== ADMIN AUTH (simple password-based, solo dueño) =====
import { randomUUID } from 'crypto'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const adminTokens = new Set()

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }
  const token = randomUUID()
  adminTokens.add(token)
  console.log('   Admin: sesión iniciada')
  res.json({ success: true, token })
})

// Middleware para rutas protegidas de admin
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  next()
}

const PROMPTS = {
  azufre: `La **Crema Milagrosa de Azufre** es ideal para el cuidado de la piel. Contiene ácido bórico, azufre, salicilato de metilo y ácido salicílico. Es antiséptica y regeneradora. Disponible en 60g ($3.5), 120g ($5) y 350g ($10). ¿Te gustaría saber más? 🌿`,
  rompe: `La **Crema Rompe Dolor** es nuestra fórmula analgésica estrella con árnica, caléndula, cannabis, mentol, alcanfor y salicilato de metilo. Ideal para dolores musculares y articulares. En 60g ($3.5), 120g ($5) y 350g ($10). También tenemos el **Aceite Medicinal** en 30ml ($3) y 60ml ($5) para masajes más profundos. 🌿`,
  aceite: `Nuestro **Aceite Medicinal Rompe Dolor** es perfecto para masajes terapéuticos con extractos de árnica, caléndula, cannabis, mentol y alcanfor. Penetra profundamente para aliviar contracturas. En 30ml ($3) y 60ml ($5). 🌿`,
  aloe: `La **Crema Aloe Vera** es hidratante premium con aloe, colágeno, ácido hialurónico, vitamina E y aceites de almendras, zanahoria y naranja. En 60g ($5) y 350g ($19.99). 🌿`,
  pago: `Aceptamos:\n🏦 **Pago Móvil**: Banco de Venezuela, 0414-7042283, C.I. 23.531.330\n🏦 **Transferencia**: Banco de Venezuela, Cta Corriente\n💵 **Efectivo**: Ejido/Mérida\n🚚 Envíos: locales sin costo, nacionales vía MRW/Zoom/Domesa\n\n¿Por cuál método prefieres? 🌿`,
  precio: `Precios USD:\n🌿 Crema Azufre: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 Crema Rompe Dolor: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 Aceite Medicinal: 30ml ($3) · 60ml ($5)\n🌿 Crema Aloe Vera: 60g ($5) · 350g ($19.99)`,
  formacion: `¡Con gusto te cuento! Soy **Médica Cirujana** egresada de la **Universidad de Los Andes (ULA)**. Tengo especializaciones en **Medicina Tradicional China, Herbolaria, Cosmetología y Fototerapia**. 💚`,
  gracias: '¡De nada! Estoy aquí cuando me necesites. Cuídate mucho 🌿',
  hola: '¡Hola! Soy la **Dra. Michelle Peinado** de **La Hoja Verde**. Médica ULA, especialista en medicina tradicional china, herbolaria y cosmetología. ¿En qué puedo ayudarte hoy? 🌿',
  default: `Soy la **Dra. Michelle Peinado** de **La Hoja Verde**. Trabajamos con:\n🌿 **Crema Milagrosa de Azufre** — antiséptica\n🌿 **Crema Rompe Dolor** — analgésica\n🌿 **Aceite Medicinal Rompe Dolor** — masajes\n🌿 **Crema Aloe Vera** — hidratante\n¿Sobre cuál te gustaría saber más? 🌿`,
}

function localReply(message, contextProduct) {
  const msg = message.toLowerCase()
  const keywords = {
    azufre: ['azufre', 'ácido bórico', 'antiséptico'],
    rompe: ['rompe dolor', 'dolor', 'muscular', 'articular', 'árnica', 'caléndula', 'cannabis', 'mentol', 'alcanfor', 'antiinflamatorio', 'analgésico'],
    aceite: ['aceite medicinal', 'masaje', 'contractura'],
    aloe: ['aloe', 'hidratante', 'colágeno', 'hialurónico', 'vitamina e'],
    pago: ['pago', 'móvil', 'transferencia', 'método'],
    precio: ['precio', 'cuanto cuesta', 'costo', 'precios', 'cuesta', 'vale', 'cuestan'],
    formacion: ['formación', 'ula', 'universidad', 'estudios', 'título', 'posgrado', 'especialidad'],
    gracias: ['gracias', 'muchas gracias'],
    hola: ['hola', 'buenos días', 'buenas tardes', 'saludos', 'qué tal'],
  }

  if (contextProduct) {
    const pName = contextProduct.toLowerCase()
    if (pName.includes('azufre')) return `¡Excelente elección! Soy la Dra. Michelle. ${PROMPTS.azufre}`
    if (pName.includes('rompe')) return `¡Excelente elección! Soy la Dra. Michelle. ${PROMPTS.rompe}`
    if (pName.includes('aceite')) return `¡Excelente elección! Soy la Dra. Michelle. ${PROMPTS.aceite}`
    if (pName.includes('aloe')) return `¡Excelente elección! Soy la Dra. Michelle. ${PROMPTS.aloe}`
  }

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => msg.includes(w))) return PROMPTS[key]
  }
  return PROMPTS.default
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function tryGroq(messages) {
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.8,
        max_tokens: 800,
      }),
    })
    if (!res.ok) {
      console.error(`   Groq error (${res.status})`)
      return null
    }
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (content) {
      console.log('   Groq OK (Llama 3.3 70B)')
      return content
    }
  } catch (e) {
    console.error('   Groq conexión error:', e.message)
  }
  return null
}

async function tryOpenRouter(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://lahojaverde.mx',
          'X-Title': 'La Hoja Verde',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v4-flash:free',
          messages,
          temperature: 0.8,
          max_tokens: 700,
        }),
      })
      if (res.status === 429) {
        console.log(`   Intento ${i + 1}: rate limit, esperando...`)
        await sleep(2000 * (i + 1))
        continue
      }
      if (!res.ok) {
        const errText = await res.text()
        console.error(`   OpenRouter error (${res.status}):`, errText.slice(0, 100))
        continue
      }
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) {
        console.log(`   OpenRouter OK (intento ${i + 1})`)
        return content
      }
    } catch (e) {
      console.error(`   Error conexión (intento ${i + 1}):`, e.message)
      await sleep(1000)
    }
  }
  return null
}

async function tryDeepSeek(messages, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages,
          temperature: 0.8,
          max_tokens: 700,
        }),
      })
      if (res.status === 402) {
        console.log('   DeepSeek: saldo insuficiente')
        return null
      }
      if (!res.ok) {
        console.error(`   DeepSeek error (${res.status})`)
        continue
      }
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) {
        console.log('   DeepSeek OK')
        return content
      }
    } catch (e) {
      console.error(`   DeepSeek conexión error:`, e.message)
      await sleep(1000)
    }
  }
  return null
}

app.post('/api/chat', async (req, res) => {
  const { message, context: chatContext, history } = req.body || {}
  if (!message) return res.status(400).json({ error: 'El mensaje es requerido' })

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(chatContext?.product
      ? [{ role: 'system', content: `Contexto: el usuario pregunta sobre: ${chatContext.product}` }]
      : []),
    ...(Array.isArray(history) ? history : []),
    { role: 'user', content: message },
  ]

  let reply = null

  // Intento 1: Groq (gratuito, rápido, sin límites restrictivos)
  if (!reply && GROQ_KEY) {
    reply = await tryGroq(messages)
  }

  // Intento 2: OpenRouter DeepSeek free
  if (!reply && OPENROUTER_KEY) {
    reply = await tryOpenRouter(messages)
  }

  // Intento 3: DeepSeek directo
  if (!reply && DEEPSEEK_KEY) {
    reply = await tryDeepSeek(messages)
  }

  // Fallback: respuesta local
  if (!reply) {
    reply = localReply(message, chatContext?.product)
  }

  // Log anonymized conversation for learning
  logConversation({
    message,
    reply,
    context: chatContext,
    sessionId: req.headers['x-session-id'],
  })

  // Auto-capture lead if the user shows purchase intent
  captureChatLead({
    message,
    name: req.body?.customerName,
    phone: req.body?.customerPhone,
    productContext: chatContext,
  })

  res.json({ reply })
})

app.get('/api/products', (req, res) => {
  const { category, search } = req.query
  const result = search ? searchProducts(search) : getProductsByCategory(category)
  res.json({ products: result, total: result.length })
})

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }
  console.log('Contacto:', { name, email, phone, message })

  // Capturar lead del formulario de contacto
  captureLead({ source: 'contact', name, email, phone, message })

  res.json({ success: true, message: 'Mensaje recibido. Te contactaremos pronto.' })
})

// ===== LEADS =====

app.post('/api/leads', (req, res) => {
  const { source, name, phone, email, interest, message, product, page } = req.body || {}
  const lead = captureLead({ source, name, phone, email, interest, message, product, page })
  res.status(201).json({ lead, message: 'Lead capturado exitosamente' })
})

app.get('/api/leads', (req, res) => {
  const { status, source, limit } = req.query
  const leads = getLeads({ status, source, limit: parseInt(limit) || 50 })
  res.json({ leads, total: leads.length })
})

app.patch('/api/leads/:id', (req, res) => {
  const { status, notes } = req.body || {}
  if (!status) return res.status(400).json({ error: 'Estado es requerido' })
  const lead = updateLeadStatus(req.params.id, status, notes)
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' })
  res.json({ lead })
})

app.get('/api/leads/stats', (req, res) => {
  res.json(getLeadStats())
})

app.get('/api/testimonials', (req, res) => {
  res.json({ testimonials: getTestimonials() })
})

app.post('/api/testimonials', (req, res) => {
  const { name, text, rating } = req.body || {}
  if (!name || !text) return res.status(400).json({ error: 'Nombre y testimonio son requeridos' })
  if (name.length > 80) return res.status(400).json({ error: 'El nombre es muy largo (máx 80 caracteres)' })
  if (text.length > 1000) return res.status(400).json({ error: 'El testimonio es muy largo (máx 1000 caracteres)' })
  const entry = addTestimonial({ name, text, rating })
  console.log(`   Nuevo testimonio de: ${name}`)
  res.status(201).json({ testimonial: entry })
})

// ===== LEARNING & ANALYTICS =====

app.get('/api/learn/stats', (req, res) => {
  res.json(getLearningStats())
})

app.post('/api/learn/extract', (req, res) => {
  const summary = extractLearnings()
  console.log(`   Learnings extracted: ${summary.totalConversations} conversations`)
  res.json({ success: true, summary })
})

// ===== ORDERS & PAYMENTS =====

app.post('/api/orders', (req, res) => {
  const { items, customerName, customerPhone, customerEmail, paymentMethod, notes, totalUSD } = req.body || {}
  if (!items || !customerName) {
    return res.status(400).json({ error: 'Productos y nombre del cliente son requeridos' })
  }
  const order = createOrder({ items, customerName, customerPhone, customerEmail, paymentMethod, notes, totalUSD })
  console.log(`   Nueva orden: ${order.id} - ${customerName}`)
  res.status(201).json({ order })
})

app.get('/api/orders', (req, res) => {
  const { status } = req.query
  const orders = getOrders(status)
  res.json({ orders, total: orders.length })
})

app.patch('/api/orders/:id', (req, res) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'Estado es requerido' })
  const order = updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' })
  res.json({ order })
})

app.get('/api/orders/stats', (req, res) => {
  res.json(getOrderStats())
})

app.get('/api/payment-config', (req, res) => {
  res.json(getPaymentConfig())
})

app.put('/api/payment-config', requireAdmin, (req, res) => {
  const config = updatePaymentConfig(req.body)
  console.log('   Configuración de pago actualizada')
  res.json({ config })
})

// ===== ADMIN DASHBOARD (protegido) =====

// Endpoint único: devuelve todo lo que necesita el panel
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const orders = getOrders()
  const orderStats = getOrderStats()
  const leads = getLeads({})
  const leadStats = getLeadStats()
  const learning = getLearningStats()
  const payment = getPaymentConfig()
  res.json({ orders, orderStats, leads, leadStats, learning, payment })
})

// Actualizar orden (protegido)
app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'Estado es requerido' })
  const order = updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' })
  res.json({ order })
})

// Actualizar lead (protegido)
app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const { status, notes } = req.body || {}
  if (!status) return res.status(400).json({ error: 'Estado es requerido' })
  const lead = updateLeadStatus(req.params.id, status, notes)
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' })
  res.json({ lead })
})

app.listen(PORT, () => {
  console.log(`\n🌿 Backend La Hoja Verde — http://localhost:${PORT}`)
  console.log(`   Groq: ${GROQ_KEY ? '✓' : '✗'} | OpenRouter: ${OPENROUTER_KEY ? '✓' : '✗'} | DeepSeek: ${DEEPSEEK_KEY ? '✓' : '✗'}`)
  console.log(`   Chat IA + Pedidos + Learning: OK`)
  console.log(`   Data: ./data/conversations.json | orders.json | learnings.json\n`)
})
