import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch'

let apolloClient = null

/* Polyfill fetch() on the server (used by apollo-client) */
if (!process.browser) {
  global.fetch = fetch
}

const create = (initialState, isServer, SERVER_ABSOLUTE_URL) => (isServer
  ? new ApolloClient({
    connectToDevTools: process.browser,
    /* Disables forceFetch on the server (so queries are only run once) */
    ssrMode: !process.browser,
    link: new HttpLink({
      /* Server URL (must be absolute) */
      uri: `${SERVER_ABSOLUTE_URL}/graphql`,
      /* Additional fetch() options like `credentials` or `headers` */
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  })
  : new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: new HttpLink({
      uri: `${window.location.origin}/graphql`, // eslint-disable-line
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  }))

export default function initApollo(initialState) {
  /* Make sure to create a new client for every server-side request so that data */
  /* isn't shared between connections (which would be bad)                       */
  if (!process.browser) {
    const SERVER_ABSOLUTE_URL = `${process.env.HOST || 'http://localhost'}:${process.env.PORT || 3000}`
    return create(initialState, true, SERVER_ABSOLUTE_URL)
  }

  /* Reuse client on the client-side */
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
