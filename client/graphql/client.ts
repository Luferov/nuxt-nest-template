import { defineApolloClient } from '@nuxtjs/apollo'

export default defineApolloClient({
  httpEndpoint: process.env.API_URL || 'http://localhost:8000/graphql/',
  browserHttpEndpoint: process.env.API_URL_BROWSER || 'http://localhost:8000/graphql/',
  wsEndpoint: process.env.WS_URL_BROWSER || 'ws://localhost:8000/graphql/',
  // inMemoryCacheOptions: { fragmentMatcher }
})
