import { useState } from 'react'
import { Search, MessageCircle, Droplets, Sparkles } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Crema Milagrosa de Azufre',
    category: 'cremas',
    description: 'Crema medicinal con azufre, ácido bórico y salicilato de metilo. Ideal para el cuidado de la piel con propiedades antisépticas y regeneradoras.',
    ingredients: ['Ácido Bórico', 'Azufre', 'Salicilato de Metilo', 'Ácido Salicílico'],
    image: '/images/productos/azufre-350.jpeg',
    presentations: [
      { size: '60g', price: 3.5 },
      { size: '120g', price: 5 },
      { size: '350g', price: 10 },
    ],
  },
  {
    id: 2,
    name: 'Crema Rompe Dolor',
    category: 'cremas',
    description: 'Crema analgésica y antiinflamatoria con macerado de árnica, caléndula, cannabis y mentol. Alivio natural para dolores musculares y articulares.',
    ingredients: ['Árnica', 'Caléndula', 'Cannabis', 'Mentol', 'Alcanfor', 'Salicilato de Metilo', 'Trementina'],
    image: '/images/productos/rompe-dolor-350g.jpeg',
    presentations: [
      { size: '60g', price: 3.5 },
      { size: '120g', price: 5 },
      { size: '350g', price: 10 },
    ],
  },
  {
    id: 3,
    name: 'Aceite Medicinal Rompe Dolor',
    category: 'aceites',
    description: 'Aceite medicinal con árnica, caléndula y cannabis para masajes terapéuticos. Alivio profundo para dolores musculares y articulares.',
    ingredients: ['Árnica', 'Caléndula', 'Cannabis', 'Mentol', 'Alcanfor'],
    image: '/images/productos/producto-1.jpeg',
    presentations: [
      { size: '30ml', price: 3 },
      { size: '60ml', price: 5 },
    ],
  },
  {
    id: 4,
    name: 'Crema Aloe Vera',
    category: 'cremas',
    description: 'Crema hidratante nutritiva con aloe vera, colágeno, ácido hialurónico y vitamina E. Elaborada con aceite de almendras dulces, zanahoria y naranja.',
    ingredients: ['Aloe Vera', 'Colágeno', 'Provitamina B5', 'Ácido Hialurónico', 'Vitamina E', 'Aceite de Almendras Dulces', 'Aceite de Zanahoria', 'Aceite de Naranja'],
    image: '/images/productos/producto-2.jpeg',
    presentations: [
      { size: '60g', price: 5 },
      { size: '350g', price: 19.99 },
    ],
  },
]

const categories = [
  { id: 'todas', label: 'Todas', icon: Sparkles },
  { id: 'cremas', label: 'Cremas Medicinales', icon: Sparkles },
  { id: 'aceites', label: 'Aceites Medicinales', icon: Droplets },
]

export default function Productos() {
  const [activeCategory, setActiveCategory] = useState('todas')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'todas' || p.category === activeCategory
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()))
    return matchCategory && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nuestros Productos
        </h1>
        <p className="text-gray-500 max-w-xl">
          Cremas medicinales, aceites terapéuticos y cuidado natural.
          Todos nuestros productos son recomendados por la Dra. Michelle, egresada de la ULA.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos o ingredientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hoja-400 focus:border-transparent bg-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === id
                ? 'bg-hoja-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-hoja-50 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No encontramos productos con ese filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((product) => {
            const isExpanded = expanded === product.id
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 h-48 shrink-0 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs font-medium text-hoja-600 bg-hoja-50 px-2 py-1 rounded-full">
                      {categories.find((c) => c.id === product.category)?.label}
                    </span>
                    <h3 className="font-display font-semibold text-gray-900 mt-2 text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.presentations.map((p) => (
                        <span
                          key={p.size}
                          className="inline-flex items-center gap-1 bg-hoja-50 text-hoja-800 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {p.size} — ${p.price.toFixed(2)} USD
                        </span>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Activos:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : product.id)}
                      className="text-xs text-gray-500 hover:text-hoja-600 font-medium"
                    >
                      {isExpanded ? 'Ver menos' : 'Ver activos'}
                    </button>
                    <button
                      onClick={() => {
                        const event = new CustomEvent('open-chat', {
                          detail: { product: product.name },
                        })
                        window.dispatchEvent(event)
                      }}
                      className="inline-flex items-center gap-1 text-sm bg-hoja-600 hover:bg-hoja-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
