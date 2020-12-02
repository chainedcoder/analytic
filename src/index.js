import { ApolloServer, gql } from 'apollo-server'
import './utils/config'

const PORT = process.env.PORT

const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Running at ${url}`)
})
