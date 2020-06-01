const knex = require('knex')
const app = require('../src/app')

// TODO: Figure out why this won't migrate

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

      it(`searches for farms that contain a query term q in the name, description, purchase details, contact name, or city`, () => {
        const searchTerm = 'beef'
        return supertest(app)
          .get(`/api/farms`)
          .query(`q=${searchTerm}`)
          .expect(200, [testFarms[0]])
      })

      it(`searches for farms selling a selected product category`, () => {
        const productsQuery = 'produce'
        return supertest(app)
          .get(`/api/farms`)
          .query(`products=${productsQuery}`)
          .expect(200, [testFarms[1]])
      })

      it(`searches for farms offering a selected purchase option category`, () => {
        const purchaseOptionsQuery = 'delivery'
        return supertest(app)
          .get(`/api/farms`)
          .query(`purchaseOptions=${purchaseOptionsQuery}`)
          .expect(200, [testFarms[0]])
      })

      it(`allows multiple queries`, () => {
        const queryObject = {
          q: 'poultry',
          products: 'meat/poultry',
          purchaseOptions: 'pick-up'
        }
        return supertest(app)
          .get(`/api/farms`)
          .query(queryObject)
          .expect(200, [testFarms[0]])
      })

    })

    context(`Given an XSS attack farm`, () => {
      // const testFarms = makeFarmsArray()
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

  describe(`GET /api/farms/:id`, () => {
    context(`Given no farms in the database`, () => {
      it(`responds with 404`, () => {
        const nonexistentFarmId = 99999
        return supertest(app)
          .get(`/api/farms/${nonexistentFarmId}`)
          .expect(404, { error: { message: `Farm does not exist` } })
      })
    })

    context(`Given there are farms in the database`, () => {
      const testFarms = makeFarmsArray();
      
      beforeEach(`insert farms`, () => {
        return db
          .into('farms')
          .insert(testFarms)
      })

      it(`responds with 200 and the specified farm`, () => {
        const farmId = 2
        const expectedFarm = testFarms[farmId - 1]
        return supertest(app)
          .get(`/api/farms/${farmId}`)
          .expect(200, expectedFarm)
      })
    })
  })

  //TEST FOR GET api/products

  //TEST FOR GET api/purchase-options

})

