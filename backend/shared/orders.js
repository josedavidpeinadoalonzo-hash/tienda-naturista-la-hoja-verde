import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '..', '..', 'data')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const ORDERS_FILE = resolve(DATA_DIR, 'orders.json')
const PAYMENT_CONFIG_FILE = resolve(DATA_DIR, 'payment-config.json')

function readJSON(file) {
  try {
    if (!existsSync(file)) return file.endsWith('config.json') ? {} : []
    return JSON.parse(readFileSync(file, 'utf-8'))
  } catch { return file.endsWith('config.json') ? {} : [] }
}

function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Default payment configuration for Venezuela (Pago Móvil)
 * Edit these values or update via the /api/payment-config endpoint
 */
function getDefaultPaymentConfig() {
  return {
    pagoMovil: {
      bank: 'Banco de Venezuela',
      phone: '0414-7042283',
      holderId: '23531330',
      holder: 'José Peinado',
      enabled: true,
    },
    cashAvailable: true,
    cashLocation: 'Ejido / Mérida',
    deliveryZones: [
      { zone: 'Ejido / Mérida', type: 'local', description: 'Entrega personal sin costo', cost: 0 },
      { zone: 'Nacional', type: 'shipping', description: 'MRW, Zoom, Domesa (por cuenta del cliente)', cost: null },
    ],
    transferInfo: {
      bank: 'Banco de Venezuela',
      accountType: 'Corriente',
      accountNumber: '',
      holder: 'José Peinado',
      holderId: '23531330',
    },
    currency: 'USD',
    notes: 'Pago Móvil: Banco de Venezuela, 0414-7042283, C.I. 23.531.330. Efectivo en Ejido/Mérida. Envíos nacionales vía MRW/Zoom/Domesa.',
    updatedAt: new Date().toISOString(),
  }
}

export function getPaymentConfig() {
  const config = readJSON(PAYMENT_CONFIG_FILE)
  if (!config || Object.keys(config).length === 0) {
    return getDefaultPaymentConfig()
  }
  return config
}

export function updatePaymentConfig(updates) {
  const config = { ...getDefaultPaymentConfig(), ...updates, updatedAt: new Date().toISOString() }
  writeJSON(PAYMENT_CONFIG_FILE, config)
  return config
}

export function createOrder({ items, customerName, customerPhone, customerEmail, paymentMethod, notes, totalUSD }) {
  const orders = readJSON(ORDERS_FILE)
  const order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}-${String(orders.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'pending', // pending | confirmed | paid | shipped | delivered | cancelled
    items: Array.isArray(items) ? items : [{ name: items, quantity: 1 }],
    customer: {
      name: (customerName || '').slice(0, 100),
      phone: (customerPhone || '').slice(0, 20),
      email: (customerEmail || '').slice(0, 100),
    },
    paymentMethod: paymentMethod || 'pending',
    totalUSD: totalUSD || 0,
    notes: (notes || '').slice(0, 500),
  }
  orders.push(order)
  writeJSON(ORDERS_FILE, orders)
  return order
}

export function getOrders(status) {
  const orders = readJSON(ORDERS_FILE)
  if (status) return orders.filter(o => o.status === status)
  return orders.reverse()
}

export function updateOrderStatus(orderId, status) {
  const orders = readJSON(ORDERS_FILE)
  const order = orders.find(o => o.id === orderId)
  if (!order) return null
  order.status = status
  order.updatedAt = new Date().toISOString()
  writeJSON(ORDERS_FILE, orders)
  return order
}

export function getOrderStats() {
  const orders = readJSON(ORDERS_FILE)
  const now = new Date()
  const thisMonth = orders.filter(o => new Date(o.timestamp).getMonth() === now.getMonth())
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    paid: orders.filter(o => o.status === 'paid').length,
    completed: orders.filter(o => o.status === 'delivered').length,
    thisMonth: thisMonth.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalUSD || 0), 0),
    thisMonthRevenue: thisMonth.reduce((sum, o) => sum + (o.totalUSD || 0), 0),
  }
}
