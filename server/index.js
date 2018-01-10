const express = require('express')
const basicAuth = require('express-basic-auth')
const dotenv = require('dotenv')
const next = require('next')
const routes = require('../lib/routes')

const pgp = require('./pgp')

const DEV = process.env.NODE_ENV
  ? process.env.NODE_ENV !== 'production'
  : true
if (DEV || process.env.DOTENV) {
  dotenv.config()
}
const PORT = process.env.PORT || 3005

const app = next({
  dev: DEV
})
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  if (!DEV) {
    server.enable('trust proxy')
    server.use((req, res, next) => {
      if (`${req.protocol}://${req.get('Host')}` !== process.env.PUBLIC_BASE_URL) {
        return res.redirect(process.env.PUBLIC_BASE_URL + req.url)
      }
      return next()
    })
  }

  if (process.env.BASIC_AUTH_PASS) {
    server.use(basicAuth({
      users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS },
      challenge: true,
      realm: process.env.BASIC_AUTH_REALM
    }))
  }

  server.use(pgp)

  // PayPal donate return url can be posted to
  server.post('/en', (req, res) => {
    return app.render(req, res, '/en', req.query)
  })

  server.use(handler)

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${PORT}`)
  })
})
