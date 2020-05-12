const knex = require('knex')
const app = require('../src/app')

const { makeFarmsArray, makeMaliciousFarm } = require('./farms.fixtures')

describe('Farms Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE farms RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE farms RESTART IDENTITY CASCADE'))

  describe(`GET /api/farms`, () => {
    context(`Given no farms in the database`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/farms`)
          .expect(200, [])
      })
    })

    context(`Given there are farms in the database`, () => {
      const testFarms = makeFarmsArray();

      beforeEach('insert farms', () => {
        return db
          .into('farms')
          .insert(testFarms)
      })

      it(`responds with 200 and all of the farms`, () => {
        return supertest(app)
          .get(`/api/farms`)
          .expect(200, testFarms)
      })

    })

    context(`Given an XSS attack farm`, () => {
      const testFarms = makeFarmsArray()
      const { maliciousFarm, sanitizedFarm } = makeMaliciousFarm()

      beforeEach(`insert malicious farm`, () => {
        return db
          .into('farms')
          .insert([ maliciousFarm ])
      })

      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get(`/api/farms`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].address_1).to.eql(sanitizedFarm.address_1)
            expect(res.body[0].farm_description).to.eql(sanitizedFarm.farm_description)
          })
      })
    })
  })

  describe(`POST /api/farms`, () => {
    it(`creates a new farm, responding with 201 and the new farm`, () => {
      const newFarm = {
        farm_name: 'New Farm',
        address_1: '123 Test',
        city: 'Testy',
        state: 'FL',
        phone_number: '555-1234',
        farm_description: 'Test description test test'
      }
      return supertest(app)
        .post(`/api/farms`)
        .send(newFarm)
        .expect(201)
        .expect(res => {
          expect(res.body.farm_name).to.eql(newFarm.farm_name)
          expect(res.body.address_1).to.eql(newFarm.address_1)
          expect(res.body.city).to.eql(newFarm.city)
          expect(res.body.state).to.eql(newFarm.state)
          expect(res.body.phone_number).to.eql(newFarm.phone_number)
          expect(res.body.farm_description).to.eql(newFarm.farm_description)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/farms/${res.body.id}`)
          const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date())
          const actualDate = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_modified))
          expect(actualDate).to.eql(expectedDate)
        })
    })

    // it(`responds with 400 and an error message when the 'farm_name' is missing`, () => {

    // })

    // it(`removes XSS attack content from response`, () => {
      
    // })
  })

})

