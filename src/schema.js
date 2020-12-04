import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = `
type Query {
    city(_id: String!): City
    allCities: [City!]
    staff(_id: String!): Staff
    allStaff: [Staff!]
    patient(_id: String!): Patient
    allPatients: [Patient!]
    issue(_id: String!): Issue
    allIssues: [Issue!]
}
type Mutation {
    createStaff(email: String!, name: String): Staff!
    updateStaff(_id: String!, staffInput: StaffInput!): Staff!
    removeStaff(_id: String!): Staff!
    createCity(cityName: String): City!
    updateCity(_id: String!, cityInput: CityInput!): City!
    removeCity(_id: String!): City!
    createPatient(patientInput: PatientInput!): Patient!
    updatePatient(_id: String!, patientInput: PatientInput!): Patient!
    removePatient(_id: String!): Patient!
    createIssue(description: String): Issue!
    updateIssue(_id: String!): Issue!
    removeIssue(_id: String!): Issue!
}
type Staff {
    _id: String
    name: String
    email: String
    createdAt: String!
    updatedAt: String!
}
input StaffInput {
    name: String
    email: String
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
type Patient {
    _id: String!
    name: String
    staff: Staff
    createdAt: String!
    updatedAt: String!
}
input PatientInput {
    name: String
    staff: [String]
}
type Issue {
    _id: String
    description: String
    count: Int
    createdAt: String!
    updatedAt: String!
}
input IssueInput {
    description: String
}
schema {
    query: Query
    mutation: Mutation
}
`
const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
