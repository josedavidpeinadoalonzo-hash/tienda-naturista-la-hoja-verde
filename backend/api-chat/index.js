import { SYSTEM_PROMPT } from '../shared/systemPrompt.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const GROQ_KEY = process.env.GROQ_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

const localReply = (message, chatContext) => {
  const msg = message.toLowerCase()
  const product = chatContext?.product

  if (product) {
    return `¡Excelente elección! Soy la **Dra. Michelle Peinado**, médica de **La Hoja Verde**. Te recomiendo nuestra **${product}**. Está formulada con ingredientes 100% naturales y activos cuidadosamente seleccionados para tu bienestar. Tenemos varias presentaciones. ¿Te gustaría conocer más detalles? 🌿`
  }

  if (msg.includes('azufre')) {
    return 'La **Crema Milagrosa de Azufre** es ideal para el cuidado de la piel. Contiene ácido bórico, azufre, salicilato de metilo y ácido salicílico, con propiedades antisépticas y regeneradoras. Disponible en 60g ($3.5), 120g ($5) y 350g ($10). ¿Te gustaría saber más? 🌿'
  }
  if (msg.includes('rompe') || msg.includes('dolor') || msg.includes('muscular')) {
    return 'La **Crema Rompe Dolor** es nuestra fórmula analgésica estrella. Contiene macerado de árnica, caléndula, cannabis, mentol, alcanfor y salicilato de metilo. Ideal para dolores musculares y articulares. Disponible en 60g ($3.5), 120g ($5) y 350g ($10). También tenemos el **Aceite Medicinal Rompe Dolor** en 30ml ($3) y 60ml ($5) para masajes terapéuticos. ¿Cuál te interesa más? 🌿'
  }
  if (msg.includes('aloe') || msg.includes('hidrat')) {
    return 'La **Crema Aloe Vera** es nuestra fórmula hidratante premium. Contiene aloe vera, colágeno, ácido hialurónico, vitamina E y aceites de almendras dulces, zanahoria y naranja. Nutre e hidrata profundamente. Disponible en 60g ($5) y 350g ($19.99). ¡Tu piel lo va a agradecer! 🌿'
  }
  if (msg.includes('aceite') || msg.includes('masaje')) {
    return 'Nuestro **Aceite Medicinal Rompe Dolor** es perfecto para masajes terapéuticos. Contiene extractos de árnica, caléndula, cannabis, mentol y alcanfor. Ideal para aliviar dolores musculares y articulares. Disponible en 30ml ($3) y 60ml ($5). ¿Te gustaría probarlo? 🌿'
  }
  if (msg.includes('pago') || msg.includes('móvil') || msg.includes('transferencia')) {
    return 'Aceptamos:\n\n🏦 **Pago Móvil**: Banco de Venezuela, teléfono 0414-7042283, cédula 23.531.330\n🏦 **Transferencia bancaria**: Banco de Venezuela, Cta Corriente\n💵 **Efectivo**: en Ejido / Mérida\n\n🚚 **Envíos**:\n• Ejido/Mérida: entrega personal sin costo\n• Nacional: MRW, Zoom, Domesa (por cuenta del cliente)\n\n¿Por cuál método prefieres? Cuando me confirmes te paso los datos exactos y coordinamos la entrega. 🌿'
  }
  if (msg.includes('precio') || msg.includes('cuanto') || msg.includes('costo') || msg.includes('cuesta')) {
    return 'Nuestros precios en USD:\n\n🌿 **Crema Milagrosa de Azufre**: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 **Crema Rompe Dolor**: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 **Aceite Medicinal Rompe Dolor**: 30ml ($3) · 60ml ($5)\n🌿 **Crema Aloe Vera**: 60g ($5) · 350g ($19.99)\n\n¿Quieres saber más de algún producto en especial?'
  }
  if (msg.includes('gracias')) {
    return '¡De nada! Recuerda que estoy aquí para ayudarte cuando lo necesites. Si tienes más preguntas sobre nuestros productos naturales, no dudes en consultarme. ¡Cuídate mucho! 🌿😊'
  }
  if (msg.includes('formación') || msg.includes('ula') || msg.includes('universidad') || msg.includes('estudios')) {
    return '¡Con gusto te cuento! Soy **Médica Cirujana** egresada de la **Universidad de Los Andes (ULA)**. Tengo especializaciones en **Medicina Tradicional China, Herbolaria, Cosmetología y Fototerapia**. Todo ese conocimiento lo aplico en cada recomendación. 💚'
  }
  if (msg.includes('hola') || msg.includes('buenos') || msg.includes('saludos')) {
    return '¡Hola! Soy la **Dra. Michelle Peinado** de **La Hoja Verde**. Médica ULA, especialista en medicina tradicional china, herbolaria y cosmetología. ¿En qué puedo ayudarte hoy? 🌿'
  }

  return '¡Hola! Soy la **Dra. Michelle Peinado** de **La Hoja Verde**. ¿En qué puedo orientarte? Trabajamos con cremas medicinales, aceites terapéuticos y próximamente cosmética natural. Estoy aquí para ayudarte. 🌿'
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
      console.error(`Groq error (${res.status})`)
      return null
    }
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (content) return content
  } catch (e) {
    console.error('Groq conexión error:', e.message)
  }
  return null
}

async function tryOpenRouter(messages) {
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
    if (!res.ok) {
      const errText = await res.text()
      console.error(`OpenRouter error (${res.status}):`, errText.slice(0, 100))
      return null
    }
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (content) return content
  } catch (e) {
    console.error('OpenRouter conexión error:', e.message)
  }
  return null
}

export default async function (context, req) {
  const { message, context: chatContext, history } = req.body || {}

  if (!message) {
    context.res = { status: 400, body: { error: 'El mensaje es requerido' } }
    return
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(chatContext?.product
      ? [{ role: 'system', content: `El usuario está preguntando sobre el producto: ${chatContext.product}` }]
      : []),
    ...(Array.isArray(history) ? history : []),
    { role: 'user', content: message },
  ]

  let reply = null

  if (GROQ_KEY) {
    reply = await tryGroq(messages)
  }

  if (!reply && OPENROUTER_KEY) {
    reply = await tryOpenRouter(messages)
  }

  if (!reply) {
    reply = localReply(message, chatContext)
  }

  context.res = { status: 200, body: { reply } }
}
