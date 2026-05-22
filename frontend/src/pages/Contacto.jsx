import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react'

const contactInfo = [
  { icon: MapPin, label: 'Dirección', value: 'Calle La Guillermera, Casa N5, Sector La Vega, Ejido, Edo. Mérida, Venezuela' },
  { icon: Phone, label: 'Teléfono / WhatsApp', value: '+58 0412 1146391' },
  { icon: Mail, label: 'Email', value: 'nexaopsai@gmail.com' },
  { icon: Clock, label: 'Horario', value: 'Lun–Sáb 7am–6pm' },
]

export default function Contacto() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [statusMsg, setStatusMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setStatusMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setStatusMsg(data.error || 'Error al enviar el mensaje')
        return
      }

      setStatus('sent')
      setStatusMsg(data.message || '¡Mensaje enviado con éxito!')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setStatus('error')
      setStatusMsg('Error de conexión. Intenta de nuevo.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Contacto
        </h1>
        <p className="text-gray-500 max-w-xl">
          ¿Tienes preguntas? Escríbenos o mejor aún, habla directamente con
          la Dra. Michelle a través del chat.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-hoja-100 rounded-xl shrink-0">
                <Icon className="w-5 h-5 text-hoja-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 mb-3">Síguenos en redes</p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/naturalvers21?igsh=bDc5MXJmeGx5Nzdt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-hoja-100 rounded-xl hover:bg-hoja-200 transition-colors"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-hoja-600">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1Fj2YYsFQP/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-hoja-100 rounded-xl hover:bg-hoja-200 transition-colors"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-hoja-600">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@naturalver"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-hoja-100 rounded-xl hover:bg-hoja-200 transition-colors"
                title="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-hoja-600">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/584121146391"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-hoja-100 rounded-xl hover:bg-hoja-200 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-hoja-600" />
              </a>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                const event = new CustomEvent('open-chat')
                window.dispatchEvent(event)
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-hoja-600 hover:bg-hoja-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear con el Médico
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
              Envíanos un mensaje
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{statusMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 bg-hoja-600 hover:bg-hoja-700 disabled:bg-hoja-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                <Send className="w-4 h-4" />
                {status === 'loading' ? 'Enviando...' : status === 'sent' ? statusMsg : 'Enviar mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
