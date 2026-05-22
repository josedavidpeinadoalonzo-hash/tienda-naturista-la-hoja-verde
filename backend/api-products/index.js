import { getProductsByCategory, searchProducts } from '../shared/products.js'

export default async function (context, req) {
  const category = req.query.category
  const search = req.query.search

  let result
  if (search) {
    result = searchProducts(search)
  } else {
    result = getProductsByCategory(category)
  }

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { products: result, total: result.length },
  }
}
