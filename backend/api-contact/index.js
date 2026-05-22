export default async function (context, req) {
  const { name, email, message } = req.body || {}

  if (!name || !email || !message) {
    context.res = {
      status: 400,
      body: { error: 'Todos los campos son requeridos' },
    }
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    context.res = {
      status: 400,
      body: { error: 'Correo electrónico inválido' },
    }
    return
  }

  context.log.info(`Nuevo contacto de: ${name} <${email}>`)

  context.res = {
    status: 200,
    body: {
      success: true,
      message: 'Mensaje recibido. Te contactaremos pronto.',
    },
  }
}
