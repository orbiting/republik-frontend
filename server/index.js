const path = require('path')
const express = require('express')
const basicAuth = require('express-basic-auth')
const dotenv = require('dotenv')
const next = require('next')
const compression = require('compression')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const DEV = process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true
if (DEV || process.env.DOTENV) {
  dotenv.config()
}

const routes = require('../lib/routes')

const pgp = require('./pgp')
const useragent = require('./useragent')

const PORT = process.env.PORT || 3005

const { CURTAIN_MESSAGE } = process.env

const app = next({
  dev: DEV
})
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use(
    helmet({
      hsts: {
        maxAge: 60 * 60 * 24 * 365, // 1 year to get preload approval
        preload: true,
        includeSubDomains: true
      },
      referrerPolicy: {
        policy: 'no-referrer'
      }
    })
  )
  server.use(compression())

  if (!DEV) {
    server.enable('trust proxy')
    server.use((req, res, next) => {
      if (
        `${req.protocol}://${req.get('Host')}` !== process.env.PUBLIC_BASE_URL
      ) {
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
      '/.well-known/apple-developer-merchantid-domain-association',
      '/.well-known/assetlinks.json'
    ]
    const ALLOWED_UAS = (process.env.CURTAIN_UA_ALLOW_LIST || '')
      .split(',')
      .filter(Boolean)

    server.use((req, res, next) => {
      const BACKDOOR_URL = process.env.CURTAIN_BACKDOOR_URL || ''
      const cookieOptions = { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true }
      if (req.url === BACKDOOR_URL) {
        res.cookie('OpenSesame', BACKDOOR_URL, cookieOptions)
        return res.redirect('/')
      }

      const cookies =
        (req.headers.cookie && require('cookie').parse(req.headers.cookie)) ||
        {}
      const hasCookie = cookies['OpenSesame'] === BACKDOOR_URL
      if (hasCookie) {
        // content behind backdoor should not be indexed
        // even if a bot ends up with a cookie somehow
        res.set('X-Robots-Tag', 'noindex')
        res.cookie('OpenSesame', BACKDOOR_URL, cookieOptions)
      }
      const reqUa = String(req.get('User-Agent'))
      if (
        hasCookie ||
        ALLOWED_PATHS.some(path => req.url.startsWith(path)) ||
        ALLOWED_UAS.some(ua => reqUa.includes(ua))
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
    server.use(
      basicAuth({
        users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS },
        challenge: true,
        realm: process.env.BASIC_AUTH_REALM
      })
    )
  }

  server.use(pgp)

  // tmp unavailable
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

  // Report Error
  server.post('/api/reportError', bodyParser.text(), (req, res) => {
    console.warn(
      chalk.yellow(
        'reportError from',
        useragent(req.get('User-Agent')),
        req.body
      )
    )
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ack: true }))
  })

  // iOS app universal links setup
  // - manual mapping needed to set content type json
  server.use('/.well-known/apple-app-site-association', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.sendFile(
      path.join(
        __dirname,
        '../public',
        '.well-known',
        'apple-app-site-association'
      )
    )
  })

  server.use(express.static('public'))
  server.use(handler)

  server.listen(PORT, err => {
    if (err) throw err
    console.log(`> Ready on port ${PORT}`)
  })
})
