export const products = [
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

export function getProductsByCategory(category) {
  if (!category || category === 'todas') return products
  return products.filter((p) => p.category === category)
}

export function searchProducts(query) {
  const q = query.toLowerCase()
  return products.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.ingredients.some((i) => i.toLowerCase().includes(q))
  )
}
