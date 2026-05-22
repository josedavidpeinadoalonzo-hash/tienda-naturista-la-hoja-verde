import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Award, Heart, BookOpen, MessageCircle, Star, Shield, Send } from 'lucide-react'
import { getTestimonials, submitTestimonial } from '../services/api'

const values = [
  { icon: Heart, title: 'Pasión por la Salud', desc: 'Creemos en el poder de la naturaleza para transformar vidas.' },
  { icon: Shield, title: 'Compromiso Ético', desc: 'Solo recomendamos productos que nosotros mismos usaríamos.' },
  { icon: BookOpen, title: 'Educación Constante', desc: 'Nos mantenemos actualizados con la ciencia de la herbolaria.' },
  { icon: Award, title: 'Excelencia', desc: 'Cada producto pasa por un riguroso control de calidad.' },
]

function StarRating({ value, onChange, readonly }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? undefined : 'button'}
          onClick={() => !readonly && onChange?.(star)}
          className={`${readonly ? '' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function Nosotros() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', text: '', rating: 5 })
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    getTestimonials()
      .then((data) => setTestimonials(data.testimonials))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSending(true)
    setFeedback(null)
    try {
      const data = await submitTestimonial({
        name: form.name.trim(),
        text: form.text.trim(),
        rating: form.rating,
      })
      setTestimonials((prev) => [...prev, data.testimonial])
      setForm({ name: '', text: '', rating: 5 })
      setFeedback({ type: 'success', msg: '¡Gracias por compartir tu historia! Tu testimonio ya aparece en la lista.' })
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setSending(false)
      setTimeout(() => setFeedback(null), 5000)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-b from-hoja-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1 text-hoja-600 font-medium text-sm mb-4">
                <Leaf className="w-4 h-4" />
                Nuestra Historia
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Naturaleza y ciencia de la mano
              </h1>
              <p className="text-gray-600 leading-relaxed mb-4">
                La Hoja Verde nació de la visión de un médico naturista con más de
                10 años de experiencia que decidió llevar su consulta más allá del
                consultorio. La idea era simple: crear un espacio donde las personas
                pudieran encontrar productos naturales de calidad, respaldados por
                conocimiento médico real.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Hoy somos un equipo dedicado a ofrecerte los mejores productos
                de herbolaria, suplementos y cuidado personal, siempre con la guía
                de un profesional de la salud.
              </p>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-chat')
                  window.dispatchEvent(event)
                }}
                className="inline-flex items-center gap-2 bg-hoja-600 hover:bg-hoja-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Habla con el Médico
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=600&fit=crop"
                  alt="Médico naturista en consulta"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 hidden md:block">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900">10+ años</span>
                  <span className="text-gray-500 text-sm">de experiencia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Nuestros Valores
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Principios que guían cada decisión y cada producto que ofrecemos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-crema rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-hoja-100 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-hoja-600" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-crema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Historias reales de personas que transformaron su salud con nosotros.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Cargando testimonios...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <StarRating value={t.rating} readonly />
                  <p className="text-gray-600 text-sm leading-relaxed my-3">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.date}</p>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              Deja tu testimonio
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Cuéntanos tu experiencia con nuestros productos. ¡Tu historia puede inspirar a otros!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="test-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tu nombre
                </label>
                <input
                  id="test-name"
                  type="text"
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: María Pérez"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="test-text" className="block text-sm font-medium text-gray-700 mb-1">
                  Tu historia
                </label>
                <textarea
                  id="test-text"
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="¿Cómo te ayudaron nuestros productos? Comparte tu experiencia..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu calificación
                </label>
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>
              {feedback && (
                <p className={`text-sm px-4 py-2 rounded-xl ${
                  feedback.type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                  {feedback.msg}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-hoja-600 hover:bg-hoja-700 disabled:bg-hoja-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Enviando...' : 'Compartir mi historia'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para empezar tu cambio?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Descubre nuestros productos naturales con la guía de un experto.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-hoja-600 hover:bg-hoja-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Ver Productos
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 border-2 border-hoja-600 text-hoja-700 hover:bg-hoja-50 px-6 py-3 rounded-xl font-medium transition-all"
            >
              Contactarnos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
