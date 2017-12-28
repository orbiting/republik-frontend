const server = require('express').Router()
const { createApolloFetch } = require('apollo-fetch')

server.get('/pgp/:userSlug.asc', async (req, res) => {
  const fetch = createApolloFetch({
    uri: process.env.API_URL
  })
  fetch.use(({ request, options }, next) => {
    options.headers = req.headers

    next()
  })

  const response = await fetch({
    query: `
      query pgpPublicKey($slug: String!) {
        user(slug: $slug) {
          username
          name
          pgpPublicKey
        }
      }
    `,
    variables: {
      slug: req.params.userSlug
    }
  })

  if (response.errors) {
    return res.status(503).end()
  }
  const { user } = response.data
  if (!user || !user.pgpPublicKey) {
    return res.status(404).end()
  }

  res
    .attachment(`${user.username || user.name}.asc`)
    .end(user.pgpPublicKey)
})

module.exports = server
