import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = `
type Query {
    city(_id: String!): City
    allCities: [City!]
}
type Mutation {
    createCity(cityName: String): City!
    updateCity(_id: String!, cityInput: CityInput!): City!
    removeCity(_id: String!): City!
}

type City {
    _id: String
    cityName: String
    createdAt: String!
    updatedAt: String!
}
input CityInput {
    cityName: String
}

schema {
    query: Query
    mutation: Mutation
}
`
const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
