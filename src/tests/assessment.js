import schema from '../schema'
import { Assessment } from '../models/assessment.models'
import { Staff } from '../models/staff.model'
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
  context: { Assessment, Staff, Issue }
})

const client = apolloTesting.createTestClient(testServer)
before(async (done) => {
  // End by dropping collect - might be redadunt
  mongoose.connection.collections.assessments.drop(() => {})
  return done()
})
after(async (done) => {
  // close connection
  mongoose.connection.collections.assessments.drop(() => {})

  mongoose.connection.close(function () {
    process.exit(0)
  })
  return done()
})

it('Creates an assessment', async function () {
  try {
    const CREATE_QUERY = `
    mutation createPatient($patientName: String!) {
      createPatient(patientInput: { name: $patientName }) {
        _id
        name
      }
    }
    mutation createStaff($name: String!, $email:String!) {
      createStaff(name: $name, email:$email) {
        _id
        name
        email
      }
    }
    mutation createIssue($description: String!) {
      createIssue(description: $description) {
        _id
        description
      }
    } `
    const QUERY = `
    mutation createAssessment($assessmentById: String!, $assessmentOfId: String!, $issuesIds: [String!], $satisfactionRating: Int) {
      createAssessment(assessmentInput: {assessmentById: $assessmentById,
        assessmentOfId: $assessmentOfId,
        issuesIds: $issuesIds,
        satisfactionRating: $satisfactionRating}) {
        _id
    assessmentBy {
      _id
      name
    }
    assessmentOf {
      _id
      name
    }
    issues {
      _id
      description
    }
    visit {
      _id
    }
    satisfactionRating
      }
    }
    `

    const staffData = await client.mutate({
      query: CREATE_QUERY,
      variables: {
        name: 'Monica',
        email: 'kamau@test.io'
      },
      operationName: 'createStaff'
    })
    if (staffData.errors) {
      throw new Error(staffData.errors)
    }
    const issueData = await client.mutate({
      query: CREATE_QUERY,
      variables: {
        description: 'Lateness'
      },
      operationName: 'createIssue'
    })
    if (issueData.errors) {
      throw new Error(issueData.errors)
    }
    const assessmentData = {
      assessmentById: staffData.data.createStaff._id,
      assessmentOfId: staffData.data.createStaff._id,
      issuesIds: [issueData.data.createIssue._id],
      satisfactionRating: 4
    }

    const d = await client.mutate({
      query: QUERY,
      variables: {
        assessmentById: staffData.data.createStaff._id,
        assessmentOfId: staffData.data.createStaff._id,
        issuesIds: [issueData.data.createIssue._id],
        satisfactionRating: 4
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }

    expect(ObjectId.isValid(d.data.createAssessment._id)).to.be.equal(true)
    expect(d.data.createAssessment.assessmentBy._id).to.be.equal(
      assessmentData.assessmentById
    )
  } catch (error) {
    throw new Error(error)
  }
})

it('Fetch all assessments', async function () {
  try {
    const QUERY = `
    query allAssessments {
      allAssessments {
        _id
        assessmentBy {
          _id
          name
        }
        assessmentOf {
          _id
          name
        }
        issues {
          _id
          description
        }
        visit {
          _id
        }
        satisfactionRating
      }
    }
    `

    const d = await client.mutate({
      query: QUERY,
      variables: {}
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    console.log(d.data.allAssessments[0])
    expect(d.data.allAssessments.length).to.be.equal(1)
    assert(d.data.allAssessments[0].assessmentBy._id)
    assert(d.data.allAssessments[0].assessmentOf._id)
    assert(d.data.allAssessments[0].issues.length)
    assert(d.data.allAssessments[0]._id)
  } catch (error) {
    throw new Error(error)
  }
})
