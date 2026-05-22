import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8bbd9a 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                La Hoja <span className="text-forest-400">Verde</span>
              </span>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed max-w-md mb-6">
              E-commerce de productos naturales con ventas online y entregas en todo
              Venezuela. La Dra. Michelle, egresada de la ULA con especialidades en
              Medicina China, Herbolaria y Cosmetología, te asesora personalmente.
              Llevamos la naturaleza a tu hogar.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/584121146391"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-forest-800/50 hover:bg-forest-700 flex items-center justify-center transition-all hover:scale-110"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/naturalvers21?igsh=bDc5MXJmeGx5Nzdt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-forest-800/50 hover:bg-forest-700 flex items-center justify-center transition-all hover:scale-110"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1Fj2YYsFQP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-forest-800/50 hover:bg-forest-700 flex items-center justify-center transition-all hover:scale-110"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@naturalver"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-forest-800/50 hover:bg-forest-700 flex items-center justify-center transition-all hover:scale-110"
                title="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-5">Enlaces</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/productos', label: 'Productos' },
                { to: '/nosotros', label: 'Nosotros' },
                { to: '/contacto', label: 'Contacto' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-forest-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-5">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-forest-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-forest-400" />
                <span>Ejido, Edo. Mérida, Venezuela</span>
              </li>
              <li>
                <a
                  href="tel:+584121146391"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-forest-400" />
                  <span>+58 0412 1146391</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nexaopsai@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-forest-400" />
                  <span>nexaopsai@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-12 pt-8 text-center text-sm text-forest-400">
          &copy; {new Date().getFullYear()} La Hoja Verde. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
