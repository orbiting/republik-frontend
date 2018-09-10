const path = require('path')
const express = require('express')
const basicAuth = require('express-basic-auth')
const dotenv = require('dotenv')
const next = require('next')
const compression = require('compression')
const helmet = require('helmet')

const DEV = process.env.NODE_ENV
  ? process.env.NODE_ENV !== 'production'
  : true
if (DEV || process.env.DOTENV) {
  dotenv.config()
}

const routes = require('../lib/routes')

const pgp = require('./pgp')

const PORT = process.env.PORT || 3005

const {
  CURTAIN_MESSAGE
} = process.env

const app = next({
  dev: DEV
})
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use(helmet({
    hsts: {
      maxAge: 60 * 60 * 24, // one day for initial testing
      // maxAge: 31536000, // 1 year to get preload approval
      // preload: true,
      includeSubDomains: true
    },
    referrerPolicy: true
  }))
  server.use(compression())

  if (!DEV) {
    server.enable('trust proxy')
    server.use((req, res, next) => {
      if (`${req.protocol}://${req.get('Host')}` !== process.env.PUBLIC_BASE_URL) {
        return res.redirect(process.env.PUBLIC_BASE_URL + req.url)
      }
      return next()
    })
  }

  // only attach middle-ware if we're not already past it
  if (CURTAIN_MESSAGE) {
    const ALLOWED_PATHS = [
      '/_next',
      '/_webpack/',
      '/__webpack_hmr',
      '/static/',
      '/manifest',
      '/mitteilung',
      '/.well-known/apple-app-site-association',
      '/.well-known/assetlinks.json'
    ]

    server.use((req, res, next) => {
      const BACKDOOR_URL = process.env.CURTAIN_BACKDOOR_URL || ''
      if (req.url === BACKDOOR_URL) {
        res.cookie('OpenSesame', BACKDOOR_URL, { maxAge: 2880000, httpOnly: true })
        return res.redirect('/')
      }

      const cookies = (
        req.headers.cookie &&
        require('cookie').parse(req.headers.cookie)
      ) || {}
      if (
        cookies['OpenSesame'] === BACKDOOR_URL ||
        ALLOWED_PATHS.some(path => req.url.startsWith(path))
      ) {
        return next()
      }

      if (req.url !== '/') {
        res.statusCode = 503
      }
      return app.render(req, res, '/curtain', {})
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

  // tmp unavailable
  server.get('/crowdfunding', (req, res) => {
    res.statusCode = 503
    return app.render(req, res, '/503', req.query)
  })
  server.get('/vote', (req, res) => {
    res.statusCode = 503
    return app.render(req, res, '/503', req.query)
  })
  server.get('/updates/wer-sind-sie', (req, res) => {
    res.statusCode = 503
    return app.render(req, res, '/503', req.query)
  })

  // PayPal donate return url can be posted to
  server.post('/en', (req, res) => {
    return app.render(req, res, '/en', req.query)
  })

  // iOS app universal links setup
  server.use('/.well-known/apple-app-site-association', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.sendFile(path.join(__dirname, '../static', '.well-known', 'apple-app-site-association'))
  })

  // android app universal links setup
  server.use('/.well-known/assetlinks.json', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.sendFile(path.join(__dirname, '../static', '.well-known', 'assetlinks.json'))
  })

  server.use(handler)

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${PORT}`)
  })
})
