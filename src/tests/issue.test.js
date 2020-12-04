import schema from '../schema'
import { Issue } from '../models/issue.model'
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
  context: { Issue }
})

const client = apolloTesting.createTestClient(testServer)
before(async (done) => {
  // End by dropping collect - might be redadunt
  mongoose.connection.collections.issues.drop(() => {})
  return done()
})
after(async (done) => {
  // close connection
  mongoose.connection.close(function () {
    process.exit(0)
  })
  return done()
})

it('Creates an issue', async function () {
  const issue = { description: 'Wrong prescription' }
  try {
    const QUERY = `
          mutation createIssue($description: String!) {
            createIssue(description: $description) {
              _id
              description
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...issue
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(ObjectId.isValid(d.data.createIssue._id)).to.be.equal(true)
    expect(d.data.createIssue.description).to.be.equal(issue.description)
  } catch (error) {
    throw new Error(error)
  }
})

it('Fetch all issues', async function () {
  const issue = { description: 'Wrong prescription' }
  try {
    const QUERY = `
    query allIssues {
      allIssues {
        _id
        description
      }
    }
    `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...issue
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(d.data.allIssues.length).to.be.equal(1)
    expect(d.data.allIssues[0].description).to.be.equal(issue.description)
  } catch (error) {
    throw new Error(error)
  }
})
