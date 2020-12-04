import schema from '../schema'
import { Patient } from '../models/patient.models'
import './test_helper'
import { ObjectId } from 'mongodb'
import { expect } from 'chai'
import mongoose from 'mongoose'
const assert = require('assert')
require('./test_helper')

const apolloTesting = require('apollo-server-testing')

const { ApolloServer } = require('apollo-server')

// use our production schema
const testServer = new ApolloServer({
  schema: schema,
  context: { Patient }
})

const client = apolloTesting.createTestClient(testServer)
before(async (done) => {
  // End by dropping collect - might be redadunt
  mongoose.connection.collections.patients.drop(() => {})
  return done()
})
after(async (done) => {
  // close connection
  mongoose.connection.close(function () {
    process.exit(0)
  })
  return done()
})

it('Creates a patient', async function () {
  const patient = { name: 'Judy' }
  try {
    const QUERY = `
          mutation createPatient($name: String!) {
            createPatient(patientInput: { name: $name }) {
              _id
              name
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...patient
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(ObjectId.isValid(d.data.createPatient._id)).to.be.equal(true)
    expect(d.data.createPatient.name).to.be.equal(patient.name)
  } catch (error) {
    throw new Error(error)
  }
})

it('Fetch all patients', async function () {
  const patient = { name: 'Judy', email: 'judy@analytic.io' }
  try {
    const QUERY = `
          query allPatients {
            allPatients {
              _id
              name
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...patient
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(d.data.allPatients.length).to.be.equal(1)
    expect(d.data.allPatients[0].name).to.be.equal(patient.name)
  } catch (error) {
    throw new Error(error)
  }
})
