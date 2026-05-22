# Tienda Naturista La Hoja Verde — AGENTS.md

## Empresa
- **Nombre:** Emprendimiento José Peinado 03
- **Proyecto:** Tienda naturista con chatbot de atención al cliente (Dra. Michelle)

## Stack Tecnológico
- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3
- **Nota:** lucide-react v0.16.0 — no incluye iconos de marcas (Instagram, Facebook, TikTok); usar SVG inline
- **Animaciones:** framer-motion (stagger, scroll reveal, spring, AnimatePresence)
- **Backend:** Azure Functions (Node.js 18, API REST) / Express local dev
- **Chatbot:** Groq (Llama 3.3 70B) — Dra. Michelle Peinado (ULA)
- **Hosting:** Azure Static Web Apps + Azure Functions
- **Infraestructura:** Bicep (Azure)
- **MCPs:** Playwright (navegador), Firecrawl (web scraping), Replicate (generación imágenes)

## Chatbot — Dra. Michelle Peinado
- **Persona:** Médica cirujana ULA con especialidades en Medicina Tradicional China, Herbolaria, Cosmetología y Fototerapia
- **Activación:** Botón flotante estilo WhatsApp (circular #25D366, icono Phone, anillo pulsante)
- **Funcionalidad:** Responde preguntas sobre salud natural, recomienda productos (actuales y cosmética futura), toma pedidos, gestiona pagos (Pago Móvil, transferencia, efectivo)
- **Contexto:** Puede recibir el producto que el usuario está viendo para dar recomendaciones precisas
- **API:** Groq Llama 3.3 70B (fallback: OpenRouter → respuesta local)
- **Aprendizaje:** Logging anónimo de conversaciones → `data/conversations.json` para mejorar con iteraciones
- **Captura de venta:** Flujo de pedidos + Pago Móvil integrado
- **Disclaimer:** Consulta gratuita — IA con supervisión de la Dra. Michelle

## Estructura del Proyecto

```
tienda-naturista-la-hoja-verde/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # Navbar responsivo
│   │   │   ├── Footer.jsx      # Footer con info de contacto + redes sociales
│   │   │   └── Chatbot.jsx     # Chat flotante (Dra. Michelle) — estilo WhatsApp
│   │   ├── pages/
│   │   │   ├── Inicio.jsx      # Landing page con hero + destacados + CTA
│   │   │   ├── Productos.jsx   # Catálogo con filtros y búsqueda
│   │   │   ├── Nosotros.jsx    # Historia, valores, testimonios + formulario
│   │   │   └── Contacto.jsx    # Formulario + info + redes + chat directo
│   │   ├── services/
│   │   │   └── api.js          # Llamadas a Azure Functions
│   │   ├── App.jsx             # Router + layout
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind directives
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── backend/                     # Express (local) / Azure Functions
│   ├── api-chat/               # POST /api/chat — Chatbot con Groq + fallback
│   ├── api-products/           # GET /api/products — Catálogo
│   ├── api-contact/            # POST /api/contact — Formulario
│   ├── server.js               # Express local (chat + productos + contacto + órdenes + aprendizaje + leads)
│   └── shared/
│       ├── products.js         # Datos de productos
│       ├── systemPrompt.js     # Prompt de la Dra. Michelle (ULA, TCM, herbolaria, cosmetología)
│       ├── testimonials.js     # Almacenamiento de testimonios en JSON
│       ├── learning.js         # Logging de conversaciones + extracción de aprendizaje
│       ├── orders.js           # Órdenes de compra + configuración de pago (Pago Móvil)
│       └── leads.js            # Captura de leads (chat, contacto, checkout)
├── data/                       # Datos generados por usuarios (gitignored)
│   ├── testimonials.json       # Testimonios de clientes
│   ├── conversations.json      # Conversaciones anónimas para aprendizaje
│   ├── learnings.json          # Aprendizajes extraídos
│   ├── orders.json             # Órdenes de compra
│   ├── leads.json              # Leads capturados (clientes potenciales)
│   └── payment-config.json     # Configuración de métodos de pago (Pago Móvil, etc.)
├── infra/                       # Bicep templates
│   ├── main.bicep              # Static Web App + Functions + Key Vault
│   └── modules/
├── .gitignore                   # Raíz: excluye local.settings.json, .env, data/
├── azure.yaml
└── AGENTS.md
```

## API Endpoints (Express local :9001)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/chat` | Chat IA con la Dra. Michelle (Groq → OpenRouter → local) |
| GET | `/api/products` | Catálogo de productos (filtro por category, search) |
| POST | `/api/contact` | Formulario de contacto |
| GET | `/api/testimonials` | Listar testimonios |
| POST | `/api/testimonials` | Agregar testimonio |
| POST | `/api/orders` | Crear orden de compra |
| GET | `/api/orders` | Listar órdenes (?status=) |
| PATCH | `/api/orders/:id` | Actualizar estado de orden |
| GET | `/api/orders/stats` | Estadísticas de ventas |
| GET | `/api/payment-config` | Configuración de métodos de pago |
| PUT | `/api/payment-config` | Actualizar configuración de pago |
| GET | `/api/learn/stats` | Estadísticas de aprendizaje |
| POST | `/api/learn/extract` | Extraer aprendizaje de conversaciones |
| POST | `/api/leads` | Capturar lead (chat, contacto, checkout) |
| GET | `/api/leads` | Listar leads (?status=, ?source=) |
| PATCH | `/api/leads/:id` | Actualizar estado de lead |
| GET | `/api/leads/stats` | Estadísticas de leads |
| POST | `/api/admin/login` | Iniciar sesión en panel admin |
| GET | `/api/admin/dashboard` | Dashboard completo (token requerido) |
| PATCH | `/api/admin/orders/:id` | Actualizar orden (admin) |
| PATCH | `/api/admin/leads/:id` | Actualizar lead (admin) |

## Comandos
- `dev:frontend` — `cd frontend && npm run dev`
- `dev:backend` — `cd backend && node server.js` (Express en puerto 9001)
- `build` — `cd frontend && npm run build`
- `deploy` — `azd up`

## Páginas del Sitio
| Ruta | Página | Descripción |
|---|---|---|
| `/` | Inicio | Hero con gradiente, productos destacados, CTA "Habla con la Dra. Michelle" |
| `/productos` | Productos | Catálogo con búsqueda y filtros por categoría |
| `/nosotros` | Nosotros | Historia, valores, testimonios + formulario para dejar testimonio |
| `/contacto` | Contacto | Formulario + info + redes + botón de chat directo |

## Productos Actuales
| Producto | Precio Desde | Categoría |
|---|---|---|
| Crema Milagrosa de Azufre | $3.5 (60g) | Cremas |
| Crema Rompe Dolor | $3.5 (60g) | Cremas |
| Aceite Medicinal Rompe Dolor | $3 (30ml) | Aceites |
| Crema Aloe Vera | $5 (60g) | Cremas |

## Métodos de Pago (Venezuela)
- **Pago Móvil:** Banco de Venezuela, teléfono 0414-7042283, cédula 23.531.330
- **Transferencia bancaria:** Banco de Venezuela, Cta Corriente — José Peinado
- **Efectivo:** En Ejido / Mérida
- **Divisa:** USD (preguntar tasa del día)

## Contacto WhatsApp
- **Consultas / pedidos / atención:** 0412-1146391 (WhatsApp Business, atendido por José)

## Envíos
- **Ejido / Mérida:** Entrega personal sin costo — coordinar punto en la ciudad
- **Nacional (Venezuela):** MRW, Zoom, Domesa — costo por cuenta del cliente (3-7 días hábiles)

## Sistema de Aprendizaje
- Cada conversación se registra anónimamente en `data/conversations.json`
- Se puede ejecutar `POST /api/learn/extract` para extraer patrones de aprendizaje (productos más consultados, temas frecuentes)
- Los aprendizajes se almacenan en `data/learnings.json` para revisión histórica
- A futuro: usar estos patrones para actualizar el system prompt con datos reales

## Captura de Leads
- Se capturan leads automáticamente desde:
  - **chat:** Usuarios que muestran intención de compra en el chatbot
  - **contact:** Formulario de contacto
  - **checkout:** Proceso de compra
- Ver leads: `GET /api/leads`
- Estadísticas: `GET /api/leads/stats`

## Próximos Pasos
1. ✅ Definir páginas del sitio
2. ✅ Configurar proyecto frontend (Vite + React + Tailwind)
3. ✅ Configurar backend Express + Azure Functions
4. ✅ Probar chatbot con Groq (Llama 3.3 70B)
5. ✅ Actualizar datos reales de contacto (Venezuela)
6. ✅ Crear persona Dra. Michelle (ULA + especialidades)
7. ✅ Botón flotante estilo WhatsApp
8. ✅ Sistema de pedidos + Pago Móvil
9. ✅ Sistema de aprendizaje (logging + extracción)
10. 🔲 Desplegar a Azure (requiere suscripción Azure y azd)
11. 🔲 Conectar dominio personalizado
12. 🔲 Agregar más productos (cosméticos, fitoterapéuticos)
13. 🔲 Configurar datos reales de pago (RIF, cuenta bancaria)
14. 🔲 Implementar panel de administración de pedidos
15. ✅ WhatsApp Business configurado en tu móvil (0412-1146391) — notificaciones manuales
16. 🔲 Conectar tracking de envíos (MRW, Zoom, Domesa)
