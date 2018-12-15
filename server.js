const express = require('express')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const next = require('next')
const MyGraphQLSchema = require('./lib/schema')
// const accounts = require('./build/accounts.json')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const extensions = () => ({
  timestamp: Date.now(),
})


app.prepare().then(async () => {
  const server = express()
  server.use(bodyParser.json())
  server.use('/graphql', graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
    // context: { accounts },
    extensions,
  }))
  server.get('/game/:id', (req, res) => {
    if (req.params.id === 'list' || !req.params.id) {
      return app.render(req, res, '/game/list', req.params)
    }
    return app.render(req, res, '/game', req.params)
  })

  server.get('*', (req, res) => handle(req, res))

  /* eslint-disable no-console */
  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log('Web Server: http://localhost:3000')
  })
})
