import schema from '../schema'
import { City } from '../models/city.model'
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
  context: { City }
})

const client = apolloTesting.createTestClient(testServer)
before((done) => {
  // start on a clean slate
  mongoose.connection.collections.cities.drop(() => {
    done()
  })
})

after(async (done) => {
  // End by dropping collect - might be redadunt
  mongoose.connection.collections.cities.drop(() => {
    process.exit(0)
  })
  // close connection
  mongoose.connection.close(function () {
    process.exit(0)
  })
  return done()
})

it('Creates a city', async function () {
  const city = { cityName: 'Nairobi' }
  try {
    const QUERY = `
          mutation createCity($cityName: String!) {
            createCity(cityName: $cityName) {
              _id
              cityName
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...city
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(ObjectId.isValid(d.data.createCity._id)).to.be.equal(true)
    expect(d.data.createCity.cityName).to.be.equal(city.cityName)
    // assert(d.data.createCity)
  } catch (error) {
    throw new Error(error)
  }
})

it('Fetch all cities', async function () {
  const city = { cityName: 'Nairobi' }
  try {
    const QUERY = `
          query allCities {
            allCities {
              _id
              cityName
            }
          }
        `

    const d = await client.mutate({
      query: QUERY,
      variables: {
        ...city
      }
    })

    if (d.errors) {
      throw new Error(d.errors)
    }
    expect(d.data.allCities.length).to.be.equal(1)
    expect(d.data.allCities[0].cityName).to.be.equal(city.cityName)
  } catch (error) {
    throw new Error(error)
  }
})
