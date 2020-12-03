import { ApolloServer } from 'apollo-server'
import schema from './schema'
import { City } from './models/city.model'
import './utils/config'

const PORT = process.env.PORT

const server = new ApolloServer({
  schema: schema,
  context: { City }
})

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Running at ${url}`)
})
