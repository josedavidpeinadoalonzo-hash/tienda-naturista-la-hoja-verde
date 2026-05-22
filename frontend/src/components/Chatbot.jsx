import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { sendChatMessage } from '../services/api'

const products = [
  { name: 'Crema Milagrosa de Azufre', keywords: ['azufre', 'antiséptico', 'regenerador', 'ácido bórico'], desc: 'antiséptica y regeneradora', sizes: '60g ($3.5) · 120g ($5) · 350g ($10)', ingredients: 'ácido bórico, azufre, salicilato de metilo, ácido salicílico' },
  { name: 'Crema Rompe Dolor', keywords: ['rompe dolor', 'analgésico', 'antiinflamatorio', 'muscular', 'articular', 'árnica', 'caléndula', 'cannabis', 'mentol', 'alcanfor'], desc: 'analgésica y antiinflamatoria', sizes: '60g ($3.5) · 120g ($5) · 350g ($10)', ingredients: 'árnica, caléndula, cannabis, mentol, alcanfor, salicilato de metilo, trementina' },
  { name: 'Aceite Medicinal Rompe Dolor', keywords: ['aceite medicinal', 'aceite rompe', 'masaje'], desc: 'para masajes terapéuticos', sizes: '30ml ($3) · 60ml ($5)', ingredients: 'árnica, caléndula, cannabis, mentol, alcanfor' },
  { name: 'Crema Aloe Vera', keywords: ['aloe', 'hidratante', 'colágeno', 'hialurónico', 'vitamina e', 'almendras'], desc: 'hidratante y nutritiva', sizes: '60g ($5) · 350g ($19.99)', ingredients: 'aloe vera, colágeno, provitamina B5, ácido hialurónico, vitamina E, aceite de almendras, zanahoria y naranja' },
]

const WELCOME_MSG = {
  role: 'bot',
  text: '¡Hola! Soy la **Dra. Michelle Peinado**, médica cirujana egresada de la **Universidad de Los Andes (ULA)**. Tengo especializaciones en **Medicina Tradicional China, Herbolaria, Cosmetología y Fototerapia**, y más de 10 años de experiencia. ¿En qué puedo ayudarte hoy? 🌿',
}

function getLocalReply(message, productContext) {
  const msg = message.toLowerCase().trim()
  if (productContext) {
    const product = products.find((p) => p.name.toLowerCase().includes(productContext.toLowerCase()))
    if (product) {
      return `¡Excelente elección! La **${product.name}** es ${product.desc}. Contiene ${product.ingredients}. Disponible en ${product.sizes}. ¿Te gustaría saber más detalles o tienes alguna otra consulta? 🌿`
    }
  }
  const matched = products.find((p) => p.keywords.some((k) => msg.includes(k)))
  if (matched) {
    return `La **${matched.name}** es ${matched.desc}. Contiene ${matched.ingredients}. Disponible en ${matched.sizes}. ¿Te gustaría saber más? 🌿`
  }
  if (msg.includes('pago') || msg.includes('pago móvil') || msg.includes('transferencia') || msg.includes('método')) {
    return 'Aceptamos los siguientes métodos de pago:\n\n🏦 **Pago Móvil** — Banesco, Mercantil, Provincial\n🏦 **Transferencia bancaria** — cualquier banco nacional\n💵 **Efectivo** — si estás en Ejido / Mérida\n\n¿Por cuál método prefieres pagar? Cuando me confirmes, te paso los datos exactos y coordinamos la entrega.'
  }
  if (msg.includes('pedido') || msg.includes('comprar') || msg.includes('quiero') || msg.includes('orden') || msg.includes('prepar') || msg.includes('pagar')) {
    return '¡Claro! Con gusto te tomo el pedido. Dime:\n\n1️⃣ ¿Qué producto(s) quieres?\n2️⃣ ¿Qué presentación prefieres?\n3️⃣ ¿Cuántas unidades?\n\nY te paso los datos de pago para que hagamos el proceso. 🙌'
  }
  if (msg.includes('precio') || msg.includes('cuanto cuesta') || msg.includes('costo') || msg.includes('precios')) {
    return 'Nuestros precios en USD:\n\n🌿 **Crema Milagrosa de Azufre**: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 **Crema Rompe Dolor**: 60g ($3.5) · 120g ($5) · 350g ($10)\n🌿 **Aceite Medicinal Rompe Dolor**: 30ml ($3) · 60ml ($5)\n🌿 **Crema Aloe Vera**: 60g ($5) · 350g ($19.99)\n\n¿Te gustaría saber más de algún producto en especial?'
  }
  if (msg.includes('gracias')) {
    return '¡De nada! Recuerda que estoy aquí para ayudarte cuando lo necesites. Cuídate mucho 🌿😊'
  }
  if (msg.includes('hola') || msg.includes('buenos días') || msg.includes('buenas') || msg.includes('saludos')) {
    return '¡Hola! Soy la **Dra. Michelle Peinado**, médica de La Hoja Verde. Tengo más de 10 años de experiencia y especializaciones en medicina tradicional china, herbolaria y cosmetología. ¿En qué puedo ayudarte hoy? 🌿'
  }
  if (msg.includes('formación') || msg.includes('estudios') || msg.includes('universidad') || msg.includes('título') || msg.includes('posgrado') || msg.includes('especialidad') || msg.includes('ula')) {
    return '¡Con gusto te cuento! Soy **Médica Cirujana** egresada de la **Universidad de Los Andes (ULA)** en Mérida, Venezuela. Tengo especializaciones en:\n\n🔬 **Medicina Tradicional China** — acupuntura, fitoterapia\n🌿 **Herbolaria** — plantas medicinales latinoamericanas y chinas\n🧴 **Cosmetología** — dermocosmética natural\n💡 **Fototerapia** — tratamientos con luz para la piel\n\nTodo ese conocimiento lo aplico en cada recomendación que te doy. 💚'
  }
  if (msg.includes('ingrediente') || msg.includes('activo') || msg.includes('compuesto') || msg.includes('componente')) {
    return 'Claro, estos son los activos de nuestros productos:\n\n🌿 **Crema Azufre**: ácido bórico, azufre, salicilato de metilo, ácido salicílico\n🌿 **Crema Rompe Dolor**: árnica, caléndula, cannabis, mentol, alcanfor, salicilato de metilo, trementina\n🌿 **Aceite Medicinal**: árnica, caléndula, cannabis, mentol, alcanfor\n🌿 **Crema Aloe Vera**: aloe vera, colágeno, provitamina B5, ácido hialurónico, vitamina E\n\n¿Quieres saber más de alguno? 🌿'
  }
  return 'Soy la **Dra. Michelle Peinado** de **La Hoja Verde**. Trabajamos con:\n\n🌿 **Crema Milagrosa de Azufre** — antiséptica, regeneradora\n🌿 **Crema Rompe Dolor** — analgésica, antiinflamatoria\n🌿 **Aceite Medicinal Rompe Dolor** — masajes terapéuticos\n🌿 **Crema Aloe Vera** — hidratante, nutritiva\n\n¿Sobre cuál te gustaría saber más? O dime qué necesitas y te recomiendo el producto ideal. 🌿'
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [productContext, setProductContext] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handler = (e) => {
      setOpen(true)
      if (e.detail?.product) {
        setProductContext(e.detail.product)
        setMessages((prev) => [
          WELCOME_MSG,
          {
            role: 'user',
            text: `Me interesa saber más sobre: ${e.detail.product}`,
          },
        ])
      }
    }
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const ctx = productContext
    setProductContext(null)
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))
      const data = await sendChatMessage(text, { product: ctx }, history)
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: getLocalReply(text, ctx) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <>
          {/* WhatsApp-style floating button — exact clone */}
          <motion.button
            key="chat-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.55)] transition-all duration-200"
          >
            <Phone className="w-7 h-7" fill="white" stroke="white" />
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border-2 border-[#25D366]/40 animate-ping" />
          </motion.button>
          {/* Tooltip label */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 right-24 z-50 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
          >
            🌿 Consultar con la Dra. Michelle
          </motion.span>
        </>
      ) : (
        <motion.div
          key="chat-panel"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-forest-100/50"
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-forest-800 to-forest-700 text-white px-4 py-3.5">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }} />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Dra. Michelle Peinado</p>
                  <p className="text-xs text-forest-200">Médica ULA · Medicina China · Herbolaria · Cosmetología</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[350px] max-h-[420px] bg-gradient-to-b from-crema to-white chat-scroll">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-forest-100' : 'bg-white shadow-sm border border-forest-100'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5 text-forest-600" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-forest-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-forest-600 to-forest-700 text-white rounded-tr-sm'
                      : 'bg-white text-gray-700 shadow-sm border border-forest-50 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2.5"
              >
                <div className="flex-shrink-0 w-7 h-7 bg-white shadow-sm border border-forest-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-forest-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-forest-50">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-forest-100 p-3 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="flex-1 px-4 py-2.5 border border-crudo rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent text-sm bg-crema/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex items-center justify-center w-10 h-10 bg-forest-600 hover:bg-forest-700 disabled:bg-gray-200 text-white rounded-xl transition-all disabled:text-gray-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Consulta gratuita — IA con supervisión de la Dra. Michelle
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
