import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Package, Users, BarChart3, CreditCard, LogOut,
  ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle,
  Phone, Mail, MapPin, ExternalLink, Search, RefreshCw,
  ChevronDown, ChevronUp, MessageCircle, DollarSign, Download
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9001'

// ===== LOGIN SCREEN =====
function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')
      onLogin(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-oro-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Panel Admin</h1>
            <p className="text-forest-300 text-sm mt-1">La Hoja Verde — Dra. Michelle</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de administrador"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-oro-400/50 focus:border-oro-400/50 text-sm"
                autoFocus
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-gradient-to-r from-oro-500 to-oro-600 hover:from-oro-600 hover:to-oro-700 text-forest-900 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Ingresando...' : 'Ingresar al Panel'}
            </button>
          </form>
          <p className="text-center mt-6 text-forest-400 text-xs">
            Acceso exclusivo para administradores
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ===== STATUS BADGE =====
function StatusBadge({ status, type = 'order' }) {
  const colors = {
    order: {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      paid: 'bg-green-100 text-green-700 border-green-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    },
    lead: {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      qualified: 'bg-purple-100 text-purple-700 border-purple-200',
      converted: 'bg-green-100 text-green-700 border-green-200',
      lost: 'bg-gray-100 text-gray-700 border-gray-200',
    },
  }
  const c = colors[type]?.[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c}`}>
      {status}
    </span>
  )
}

// ===== STAT CARD =====
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color || 'bg-forest-100'}`}>
          <Icon className={`w-5 h-5 ${color ? 'text-white' : 'text-forest-600'}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ===== DASHBOARD =====
function Dashboard({ token, onLogout }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('resumen')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [searchLeads, setSearchLeads] = useState('')

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { 'x-admin-token': token },
      })
      const d = await res.json()
      if (res.ok) setData(d)
    } catch (e) {
      console.error('Error fetching dashboard:', e)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const updateOrderStatus = async (id, status) => {
    await fetch(`${API_BASE}/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status }),
    })
    fetchDashboard()
  }

  const updateLeadStatus = async (id, status) => {
    await fetch(`${API_BASE}/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status }),
    })
    fetchDashboard()
  }

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: BarChart3 },
    { id: 'pedidos', label: 'Pedidos', icon: Package },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
  ]

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-forest-500 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando panel...</p>
        </div>
      </div>
    )
  }

  const { orders, orderStats, leads, leadStats, learning, payment } = data || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">LV</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">La Hoja Verde</h1>
              <p className="text-xs text-gray-400">Panel de administración</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-forest-600 text-forest-700'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ===== TAB: RESUMEN ===== */}
        {tab === 'resumen' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={ShoppingBag} label="Pedidos totales" value={orderStats?.total || 0} sub={`${orderStats?.thisMonth || 0} este mes`} color="bg-forest-500" />
              <StatCard icon={DollarSign} label="Ingresos totales" value={`$${orderStats?.totalRevenue || 0}`} sub={`$${orderStats?.thisMonthRevenue || 0} este mes`} color="bg-oro-500" />
              <StatCard icon={Users} label="Leads capturados" value={leadStats?.total || 0} sub={`${leadStats?.today || 0} hoy`} color="bg-blue-500" />
              <StatCard icon={MessageCircle} label="Conversaciones" value={learning?.totalConversations || 0} sub="registradas" color="bg-purple-500" />
            </div>

            {/* Últimos pedidos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Últimos pedidos</h3>
              {orders?.length > 0 ? (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{o.id}</p>
                        <p className="text-xs text-gray-400">{o.customer?.name} · ${o.totalUSD}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">No hay pedidos aún</p>
              )}
            </div>

            {/* Leads recientes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Leads recientes</h3>
              {leads?.length > 0 ? (
                <div className="space-y-2">
                  {leads.slice(0, 5).map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {l.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{l.name || 'Anónimo'}</p>
                          <p className="text-xs text-gray-400">{l.interest?.slice(0, 40) || l.source} · {l.phone || ''}</p>
                        </div>
                      </div>
                      <StatusBadge status={l.status} type="lead" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">No hay leads aún</p>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB: PEDIDOS ===== */}
        {tab === 'pedidos' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-900">{orderStats?.total || 0}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
                <p className="text-2xl font-bold text-yellow-600">{orderStats?.pending || 0}</p>
                <p className="text-xs text-yellow-600">Pendientes</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                <p className="text-2xl font-bold text-blue-600">{orderStats?.confirmed || 0}</p>
                <p className="text-xs text-blue-600">Confirmados</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600">{orderStats?.paid || 0}</p>
                <p className="text-xs text-green-600">Pagados</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                <p className="text-2xl font-bold text-emerald-600">{orderStats?.completed || 0}</p>
                <p className="text-xs text-emerald-600">Entregados</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Todos los pedidos</h3>
              </div>
              {orders?.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <div key={o.id}>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 bg-forest-100 rounded-xl flex items-center justify-center">
                            <Package className="w-4 h-4 text-forest-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{o.id}</p>
                            <p className="text-xs text-gray-400">{o.customer?.name} · ${o.totalUSD}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={o.status} />
                          {expandedOrder === o.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>
                      {expandedOrder === o.id && (
                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Cliente</p>
                              <p className="text-gray-900 font-medium">{o.customer?.name}</p>
                              {o.customer?.phone && <p className="text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {o.customer.phone}</p>}
                              {o.customer?.email && <p className="text-gray-500 flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {o.customer.email}</p>}
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Productos</p>
                              {o.items?.map((item, i) => (
                                <p key={i} className="text-gray-900">{item.name} {item.size ? `(${item.size})` : ''} x{item.quantity || 1}</p>
                              ))}
                              <p className="text-gray-500 mt-1">Total: <span className="font-semibold">${o.totalUSD}</span></p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Pago</p>
                              <p className="text-gray-900">{o.paymentMethod || 'Pendiente'}</p>
                              <p className="text-gray-400 text-xs mt-1">{new Date(o.timestamp).toLocaleString('es-VE')}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Estado</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => updateOrderStatus(o.id, s)}
                                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                                      o.status === s
                                        ? 'bg-forest-600 text-white border-forest-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-forest-300'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {o.notes && <p className="text-xs text-gray-400 px-4 pb-2">Notas: {o.notes}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-12">No hay pedidos registrados</p>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB: LEADS ===== */}
        {tab === 'leads' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-900">{leadStats?.total || 0}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                <p className="text-2xl font-bold text-blue-600">{leadStats?.new || 0}</p>
                <p className="text-xs text-blue-600">Nuevos</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
                <p className="text-2xl font-bold text-yellow-600">{leadStats?.contacted || 0}</p>
                <p className="text-xs text-yellow-600">Contactados</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600">{leadStats?.converted || 0}</p>
                <p className="text-xs text-green-600">Convertidos</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchLeads}
                onChange={(e) => setSearchLeads(e.target.value)}
                placeholder="Buscar leads por nombre, teléfono, interés..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-400/50"
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Todos los leads</h3>
                <span className="text-xs text-gray-400">por fuente: chat {leadStats?.bySource?.chat || 0} · contacto {leadStats?.bySource?.contact || 0}</span>
              </div>
              {leads?.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {leads
                    .filter((l) =>
                      !searchLeads ||
                      l.name?.toLowerCase().includes(searchLeads.toLowerCase()) ||
                      l.phone?.includes(searchLeads) ||
                      l.interest?.toLowerCase().includes(searchLeads.toLowerCase())
                    )
                    .map((l) => (
                      <div key={l.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-forest-100 to-forest-200 rounded-full flex items-center justify-center text-sm font-bold text-forest-700">
                              {l.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{l.name || 'Anónimo'}</p>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                                {l.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>}
                                {l.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</span>}
                                <span className="bg-forest-100 text-forest-600 px-1.5 py-0.5 rounded text-[10px]">{l.source}</span>
                              </div>
                              {l.interest && <p className="text-xs text-gray-500 mt-1">{l.interest}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={l.status} type="lead" />
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(l.timestamp).toLocaleDateString('es-VE')}</p>
                          </div>
                        </div>
                        {/* Lead actions */}
                        <div className="flex gap-1.5 mt-3 ml-[52px]">
                          {['new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateLeadStatus(l.id, s)}
                              className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                                l.status === s
                                  ? 'bg-forest-600 text-white border-forest-600'
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-forest-300'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-12">No hay leads capturados</p>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB: PAGOS ===== */}
        {tab === 'pagos' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Configuración de pagos
              </h3>

              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Pago Móvil</p>
                  <div className="space-y-1">
                    <p className="text-gray-700"><span className="text-gray-400">Banco:</span> {payment?.pagoMovil?.bank}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Teléfono:</span> {payment?.pagoMovil?.phone}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Cédula:</span> {payment?.pagoMovil?.holderId}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Titular:</span> {payment?.pagoMovil?.holder}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Transferencia</p>
                  <div className="space-y-1">
                    <p className="text-gray-700"><span className="text-gray-400">Banco:</span> {payment?.transferInfo?.bank}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Titular:</span> {payment?.transferInfo?.holder}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Cédula:</span> {payment?.transferInfo?.holderId}</p>
                    <p className="text-gray-700"><span className="text-gray-400">Cuenta:</span> {payment?.transferInfo?.accountNumber || 'Por definir'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Envíos</p>
                  <div className="space-y-1">
                    {payment?.deliveryZones?.map((z, i) => (
                      <p key={i} className="text-gray-700">
                        <span className="text-gray-400">{z.zone}:</span> {z.description}
                        {z.cost === 0 && ' (Gratis)'}
                        {z.cost === null && ' (Por cuenta del cliente)'}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Efectivo</p>
                  <p className="text-gray-700">{payment?.cashLocation} {payment?.cashAvailable ? '✅ Disponible' : '❌ No disponible'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Notas</p>
                  <p className="text-gray-700 whitespace-pre-line text-xs">{payment?.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== ADMIN APP =====
export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'))

  const handleLogin = (newToken) => {
    sessionStorage.setItem('admin_token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setToken(null)
  }

  if (!token) return <Login onLogin={handleLogin} />

  return <Dashboard token={token} onLogout={handleLogout} />
}
