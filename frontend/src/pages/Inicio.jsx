import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf, Sparkles, Shield, FlaskConical,
  MessageCircle, ArrowRight, Star, ShoppingBag, ChevronRight,
} from 'lucide-react'
import { getTestimonials } from '../services/api'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
}

const products = [
  {
    id: 1,
    name: 'Crema Milagrosa de Azufre',
    category: 'Crema Medicinal',
    desc: 'Antiséptica, regeneradora. Con azufre, ácido bórico y salicilato.',
    price: 'Desde $3.5 USD',
    image: '/images/productos/azufre-350.jpeg',
  },
  {
    id: 2,
    name: 'Crema Rompe Dolor',
    category: 'Crema Medicinal',
    desc: 'Analgésica natural con árnica, caléndula, cannabis y mentol.',
    price: 'Desde $3.5 USD',
    image: '/images/productos/rompe-dolor-350g.jpeg',
  },
  {
    id: 3,
    name: 'Aceite Medicinal Rompe Dolor',
    category: 'Aceite Medicinal',
    desc: 'Masaje terapéutico con extractos de árnica, caléndula y cannabis.',
    price: 'Desde $3 USD',
    image: '/images/productos/producto-1.jpeg',
  },
  {
    id: 4,
    name: 'Crema Aloe Vera',
    category: 'Crema Hidratante',
    desc: 'Hidratación profunda con aloe, colágeno, ácido hialurónico y vitamina E.',
    price: 'Desde $5 USD',
    image: '/images/productos/producto-2.jpeg',
  },
]

const benefits = [
  { icon: Leaf, title: '100% Natural', desc: 'Ingredientes naturales seleccionados cuidadosamente.' },
  { icon: Shield, title: 'Asesoría Experta', desc: 'Un médico naturista con 10+ años te guía.' },
  { icon: Sparkles, title: 'Calidad Garantizada', desc: 'Fórmulas con activos de alta pureza.' },
  { icon: FlaskConical, title: 'Hecho con Ciencia', desc: 'Tradición herbal + conocimiento científico.' },
]

function StarRating({ value }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: value }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-oro-400 fill-oro-400" />
      ))}
    </div>
  )
}

export default function Inicio() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    getTestimonials()
      .then((data) => setTestimonials(data.testimonials.slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-crema via-forest-50/30 to-crema">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-forest-200/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-tierra-200/20 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-40" />
          {/* Floating organic shapes */}
          <div className="absolute top-20 right-[15%] w-32 h-32 rounded-full bg-forest-200/10 animate-float" />
          <div className="absolute bottom-32 left-[10%] w-24 h-24 rounded-full bg-tierra-200/10 animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-forest-100/80 backdrop-blur-sm text-forest-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Cremas y aceites medicinales
              </motion.div>
              <motion.h1 variants={itemVariants} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-carbon leading-[1.1] mb-6">
                Tu salud en manos
                <br />
                <span className="text-gradient">de la naturaleza</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Cremas medicinales, aceites terapéuticos y cuidado natural.
                Un médico naturista con más de 10 años de experiencia te guía
                a elegir lo mejor para tu bienestar.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link
                  to="/productos"
                  className="group inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-7 py-3.5 rounded-xl font-medium transition-all shadow-xl shadow-forest-200/50 hover:shadow-forest-300/50"
                >
                  Ver Productos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => {
                    const event = new CustomEvent('open-chat')
                    window.dispatchEvent(event)
                  }}
                  className="inline-flex items-center gap-2 border-2 border-forest-300 text-forest-700 hover:bg-forest-50 px-7 py-3.5 rounded-xl font-medium transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar a la Dra. Michelle
                </button>
              </motion.div>
            </motion.div>

            {/* Right side - decorative visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-forest-100 via-forest-50 to-crema rotate-6 shadow-2xl" />
                <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-forest-200/40 to-tierra-100/40 -rotate-3 backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-2xl shadow-forest-500/30">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                    <p className="font-display text-3xl font-bold text-forest-700">10+ años</p>
                    <p className="text-forest-500">de experiencia natural</p>
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-6 -right-6 w-20 h-20 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle, #2d6945 1.5px, transparent 1.5px)',
                  backgroundSize: '10px 10px',
                }} />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle, #d4764a 1.5px, transparent 1.5px)',
                  backgroundSize: '10px 10px',
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="text-center mb-14"
          >
            <motion.h2 variants={itemVariants} className="font-display text-3xl md:text-4xl font-bold text-carbon mb-3">
              ¿Por qué elegirnos?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 max-w-lg mx-auto">
              Cuatro pilares que hacen de La Hoja Verde tu mejor opción en salud natural.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {benefits.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={scaleVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-crema hover:bg-white border border-transparent hover:border-forest-100 transition-all duration-300 hover:shadow-xl hover:shadow-forest-100/50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-forest-100 to-forest-50 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-forest-600" />
                </div>
                <h3 className="font-display font-semibold text-carbon mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="py-20 bg-crema relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="flex items-end justify-between mb-12"
          >
            <motion.div variants={itemVariants}>
              <span className="text-sm font-medium text-forest-600 uppercase tracking-wider">Catálogo</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-carbon mt-1">
                Nuestros Productos
              </h2>
              <p className="text-gray-500 max-w-xl mt-2">
                Fórmulas medicinales elaboradas con ingredientes naturales de la más alta calidad.
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/productos"
                className="hidden sm:inline-flex items-center gap-1 text-forest-600 hover:text-forest-700 font-medium text-sm group"
              >
                Ver todo <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={scaleVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-forest-200/30 transition-shadow duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                    loading="lazy"
                    style={{ transform: 'scale(1)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-medium text-forest-600 bg-forest-50 px-3 py-1 rounded-full mb-3">
                    {product.category}
                  </span>
                  <h3 className="font-display font-semibold text-carbon mb-1.5 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{product.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-crudo">
                    <span className="font-bold text-carbon">{product.price}</span>
                    <button
                      onClick={() => {
                        const event = new CustomEvent('open-chat', {
                          detail: { product: product.name },
                        })
                        window.dispatchEvent(event)
                      }}
                      className="text-sm text-forest-600 hover:text-forest-700 font-medium inline-flex items-center gap-1 group/btn"
                    >
                      Consultar
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerVariants}
              className="flex items-end justify-between mb-12"
            >
              <motion.div variants={itemVariants}>
                <span className="text-sm font-medium text-tierra-500 uppercase tracking-wider">Testimonios</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-carbon mt-1">
                  Lo que dicen nuestros clientes
                </h2>
                <p className="text-gray-500 max-w-xl mt-2">
                  Historias reales de personas que transformaron su salud con nosotros.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  to="/nosotros"
                  className="hidden sm:inline-flex items-center gap-1 text-tierra-500 hover:text-tierra-600 font-medium text-sm group"
                >
                  Ver todos <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-6"
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  variants={scaleVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-crema rounded-2xl p-6 border border-crudo/50 hover:border-forest-100 transition-colors"
                >
                  <StarRating value={t.rating} />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-white text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-carbon text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-forest-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-tierra-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.span variants={itemVariants} className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white/80 px-4 py-1.5 rounded-full text-sm mb-6">
            <MessageCircle className="w-3.5 h-3.5" />
            Dra. Michelle Peinado
          </motion.span>
          <motion.h2 variants={itemVariants} className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Habla con la <br className="hidden sm:block" />
            <span className="text-gradient bg-gradient-to-r from-oro-300 to-oro-400">Dra. Michelle</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-forest-200 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            ¿Tienes dudas sobre cuál producto es mejor para ti? La Dra. Michelle,
            egresada de la ULA con especialidades en Medicina China, Herbolaria
            y Cosmetología, está disponible para ayudarte de forma personalizada.
          </motion.p>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={() => {
                const event = new CustomEvent('open-chat')
                window.dispatchEvent(event)
              }}
              className="group inline-flex items-center gap-2 bg-white text-forest-800 hover:bg-forest-50 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-2xl shadow-black/10 hover:shadow-forest-500/20"
            >
              <MessageCircle className="w-5 h-5" />
              Iniciar Consulta Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
