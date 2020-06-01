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

  describe(`POST /api/farms`, () => {
    it(`creates a new farm, responding with 201 and the new farm`, () => {
      const newFarm = {
        farm_name: 'New Farm',
        address_1: '123 Test',
        city: 'Testy',
        state: 'FL',
        phone_number: '555-1234',
        farm_description: 'Test description test test',
        products: ["Produce", "Bee Products"]
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
          //This potentially needs to be changed because deep eql?
          expect(res.body.products).to.eql(newFarm.products)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/farms/${res.body.id}`)
          const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date())
          const actualDate = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_modified))
          expect(actualDate).to.eql(expectedDate)
        })
    })

    it(`responds with 400 and an error message when the 'farm_name' is missing`, () => {
      const noNameFarm = { farm_description: 'Something not quite right here.' }
      return supertest(app)
        .post(`/api/farms`)
        .send(noNameFarm)
        .expect(400, {
          error: { message: `Missing 'farm_name' in request body` }
        })
    })

    it(`responds with 400 and an error message when 'products' or 'purchase_options' is not an array`, () => {
      const productsFarm = {
        farm_name: 'TestFarm',
        products: 'nope'
      }
      const purchaseOptionsFarm = {
        farm_name: 'TestFarm',
        purchase_options: {also: 'not good'}
      }

      return supertest(app)
        .post(`/api/farms`)
        .send(productsFarm)
        .expect(400, {
          error: { message: `'products' must be an array` }
        })
        .then(res => {
          return supertest(app)
            .post(`/api/farms`)
            .send(purchaseOptionsFarm)
            .expect(400, {
              error: { message: `'purchase_options' must be an array` }
            })
        })
    })
  

    it(`removes XSS attack content from response`, () => {
      const { maliciousFarm, sanitizedFarm } = makeMaliciousFarm()
      return supertest(app)
        .post(`/api/farms`)
        .send(maliciousFarm)
        .expect(201)
        .expect(res => {
          expect(res.body.address_1).to.eql(sanitizedFarm.address_1)
          expect(res.body.farm_description).to.eql(sanitizedFarm.farm_description)
        })
    })
  })
  
  describe(`DELETE /api/farms/:id`, () => {
    context(`Given no farms in the database`, () => {
      it(`responds with 404`, () => {
        const nonexistentFarmId = 99999
        return supertest(app)
          .delete(`/api/farms/${nonexistentFarmId}`)
          .expect(404, { error: { message: `Farm does not exist` } })
      })
    })

    context(`Given there are farms in the database`, () => {
      const testFarms = makeFarmsArray()
      
      beforeEach(`insert farms`, () => {
        return db
          .into('farms')
          .insert(testFarms)
      })

      it(`responds with 204 and removes the farm`, () => {
        const idToRemove = 2
        const expectedFarms = testFarms.filter(farm => farm.id !== idToRemove)
        return supertest(app)
          .delete(`/api/farms/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/farms`)
              .expect(expectedFarms)
          )
      })
    })
  })

  describe(`PATCH /api/farms/:id`, () => {
    const farmUpdateFields = {
      farm_name: "Test Farm",
      address_2: "Test address 2",
      farm_description: "Test farm description"
    }
    context(`Given there are no farms in the database`, () => {
      it(`responds with 404`, () => {
        const nonexistentFarmId = 9999
        return supertest(app)
          .patch(`/api/farms/${nonexistentFarmId}`)
          .send(farmUpdateFields)
          .expect(404, { error: { message: `Farm does not exist` } })
      })
    })

    context(`Given there are farms in the database`, () => {
      const testFarms = makeFarmsArray()
      const idToUpdate = 2

      beforeEach(`insert farms`, () => {
        return db
          .into('farms')
          .insert(testFarms)
      })

      it(`responds with 204 and updates the farm`, () => {
        return supertest(app)
          .patch(`/api/farms/${idToUpdate}`)
          .send(farmUpdateFields)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/farms/${idToUpdate}`)
              .expect(res => {
                expect(res.body.farm_name).to.eql(farmUpdateFields.farm_name)
                expect(res.body.address_2).to.eql(farmUpdateFields.address_2)
                expect(res.body.farm_description).to.eql(farmUpdateFields.farm_description)
                expect(res.body.contact_name).to.eql(testFarms[idToUpdate - 1].contact_name)
              })
          })
      })

      it(`responds with 400 if request body does not contain any appropriate fields to patch`, () => {
        const invalidUpdateFields = { banana: 'Hello', potato: 'Goodbye' }
        return supertest(app)
          .patch(`/api/farms/${idToUpdate}`)
          .send(invalidUpdateFields)
          .expect(400, { error: {
            message: `Request body must contain 'farm_name', 'products', 'farm_description', 'address_1', 'address_2', 'city', 'state', 'zip_code', 'contact_name', 'phone_number', 'purchase_options', 'purchase_details', 'website', 'cover_image', 'profile_image', or 'archived'` } })
      })

      it(`updates the date and time each time the farm is updated`, () => {
        return supertest(app)
          .patch(`/api/farms/${idToUpdate}`)
          .send(farmUpdateFields)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/farms/${idToUpdate}`)
              .expect(res => {
                expect(res.body.date_modified).to.not.eql(testFarms[idToUpdate - 1].date_modified)
              })
          })
      })
    })
  })
})
