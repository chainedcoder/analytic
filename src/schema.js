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
    assessment(_id: String!): Assessment
    allAssessments: [Assessment!]
}
type Mutation {
    createStaff(email: String!, name: String): Staff
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
    createAssessment(assessmentInput: AssessmentInput!): Assessment!
    updateAssessment(_id: String!): Assessment!
    removeAssessment(_id: String!): Assessment!
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
type ObjectNotFound {
    message: String!
}
type Visit {
    _id: String!
    attendingBy: Staff
    patient: Patient
    location: City
    createdAt: String!
    updatedAt: String!
}
type VisitInput {
    attendingBy: String!
    patient: String!
    location: String!
    createdAt: String!
    updatedAt: String!
}
type Assessment {
    _id: String!
    assessmentBy: Staff
    assessmentOf: Staff
    satisfactionRating: Int
    createdAt: String!
    updatedAt: String!
    issues: [Issue]
    visit: Visit
}
input AssessmentInput {
    name: String
    assessmentById: String
    assessmentOfId: String
    issuesIds: [String]
    satisfactionRating: Int
}
schema {
    query: Query
    mutation: Mutation
}
`
const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
