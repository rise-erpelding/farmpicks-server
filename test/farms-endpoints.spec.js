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

})

