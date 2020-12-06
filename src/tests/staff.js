import schema from '../schema'
import { Staff } from '../models/staff.model'
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
  context: { Staff }
})

const client = apolloTesting.createTestClient(testServer)
before(async (done) => {
  // End by dropping collect - might be redadunt
  mongoose.connection.collections.staffs.drop(() => {})
  return done()
})
after(async (done) => {
  // close connection
  mongoose.connection.close(function () {
    process.exit(0)
  })
  return done()
})

it('Creates a staff', async function () {
  const staff = { name: 'Judy', email: 'judy@analytic.io' }
  try {
    const QUERY = `
          mutation createStaff($name: String!, $email:String!) {
            createStaff(name: $name, email:$email) {
              _id
              name
              email
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...staff
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(ObjectId.isValid(d.data.createStaff._id)).to.be.equal(true)
    expect(d.data.createStaff.name).to.be.equal(staff.name)
  } catch (error) {
    throw new Error(error)
  }
})

it('Fetch all staff', async function () {
  const staff = { name: 'Judy', email: 'judy@analytic.io' }
  try {
    const QUERY = `
          query allStaff {
            allStaff {
              _id
              name
              email
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...staff
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(d.data.allStaff.length).to.be.equal(1)
    expect(d.data.allStaff[0].name).to.be.equal(staff.name)
    expect(d.data.allStaff[0].email).to.be.equal(staff.email)
  } catch (error) {
    throw new Error(error)
  }
})
