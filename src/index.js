import { ApolloServer } from 'apollo-server'
import schema from './schema'
import { City } from './models/city.model'
import { Staff } from './models/staff.model'
import { Patient } from './models/patient.models'
import './utils/config'

const PORT = process.env.PORT

const server = new ApolloServer({
  schema: schema,
  context: { City, Staff, Patient }
})

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Running at ${url}`)
})
