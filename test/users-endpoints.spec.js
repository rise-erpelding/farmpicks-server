// const knex = require('knex')
// const app = require('../src/app')
// const helpers = require('./test-helpers')

// describe('Farms Endpoints', function() {
//   let db

//   const {
//     testUsers,
//     testFarms,
//     testFavorites,
//   } = helpers.makeFarmsFixtures()

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//       pool: {
//         min: 0,
//         max: 7
//       }
//     })
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('cleanup', () => helpers.cleanTables(db))

//   afterEach('cleanup', () => helpers.cleanTables(db))

//   describe(`POST /api/favorites`, () => {
//     context(`Given no farms in the database`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app)
//           .get(`/api/farms`)
//           .expect(200, [])
//       })
//     })

//     context(`Given there are farms in the database`, () => {

//       beforeEach('insert farms, favorites, and users', () =>
//         helpers.seedFarmpicksTables(
//           db,
//           testUsers,
//           testFarms,
//           testFavorites,
//         )
//       )

//       it(`responds with 200 and all of the farms`, () => {
//         const expectedFarms = testFarms
//           .map(farm =>
//               helpers.makeExpectedFarm(
//                 farm,
//                 testFavorites
//               ))
//         return supertest(app)
//           .get(`/api/farms`)
//           .expect(200, expectedFarms)
//       })

//       it(`searches for farms that contain a query term q in the name, description, purchase details, contact name, or city`, () => {
//         const searchTerm = 'beef'
//         const expectedFarm = [{...testFarms[0]}]
//         expectedFarm[0].number_of_favorites = '2'
//         return supertest(app)
//           .get(`/api/farms`)
//           .query(`q=${searchTerm}`)
//           .expect(200, expectedFarm)
//       })

//       it(`searches for farms offering a selected purchase option category`, () => {
//         const purchaseOptionsQuery = 'delivery'
//         const expectedFarm = [{...testFarms[0]}, {...testFarms[1]}]
//         expectedFarm[0].number_of_favorites = '2'
//         expectedFarm[1].number_of_favorites = '1'
//         return supertest(app)
//           .get(`/api/farms`)
//           .query(`purchaseOptions=${purchaseOptionsQuery}`)
//           .expect(200, expectedFarm)
//       })

//       it(`searches for farms selling a selected product category`, () => {
//         const productsQuery = 'produce'
//         const expectedFarm = [{...testFarms[1]}]
//         expectedFarm[0].number_of_favorites = '1'
//         return supertest(app)
//           .get(`/api/farms`)
//           .query(`products=${productsQuery}`)
//           .expect(200, expectedFarm)
//       })

//       it(`searches for farms by query q, product type, or purchase option type`, () => {
//         const queryObject = {
//           q: 'grass-fed',
//           products: 'meat/poultry',
//           purchaseOptions: 'pick-up'
//         }
//         const expectedFarm = [{...testFarms[0]}]
//         expectedFarm[0].number_of_favorites = '2'
//         return supertest(app)
//           .get(`/api/farms`)
//           .query(queryObject)
//           .expect(200, expectedFarm)
//       })

//     })

//     context(`Given an XSS attack farm`, () => {
//       // const testFarms = makeFarmsArray()
//       const { maliciousFarm, sanitizedFarm } = helpers.makeMaliciousFarm()

//       beforeEach('insert farms, favorites, and users', () =>
//         helpers.seedFarmpicksTables(
//           db,
//           testUsers,
//           testFarms,
//           testFavorites,
//         )
//       )

//       beforeEach(`insert malicious farm`, () => {
//         return db
//           .into('farms')
//           .insert([maliciousFarm])
//       })

//       it(`removes XSS attack content`, () => {
//         return supertest(app)
//           .get(`/api/farms`)
//           .expect(200)
//           .expect(res => {
//             expect(res.body[4].address_1).to.eql(sanitizedFarm.address_1)
//             expect(res.body[4].farm_description).to.eql(sanitizedFarm.farm_description)
//           })
//       })
//     })
//   })

//   describe(`GET /api/farms/:id`, () => {
//     context(`Given no farms in the database`, () => {
//       it(`responds with 404`, () => {
//         const nonexistentFarmId = 99999
//         return supertest(app)
//           .get(`/api/farms/${nonexistentFarmId}`)
//           .expect(404, { error: { message: `Farm does not exist` } })
//       })
//     })

//     context(`Given there are farms in the database`, () => {
//       const testFarms = helpers.makeFarmsArray();
      
//       beforeEach('insert farms, favorites, and users', () =>
//         helpers.seedFarmpicksTables(
//           db,
//           testUsers,
//           testFarms,
//           testFavorites,
//         )
//       )

//       it(`responds with 200 and the specified farm`, () => {
//         const farmId = 2
//         const expectedFarm = {...testFarms[farmId - 1]}
//         expectedFarm.number_of_favorites = '1'
//         return supertest(app)
//           .get(`/api/farms/${farmId}`)
//           .expect(200, expectedFarm)
//       })
//     })
//   })


//   describe(`POST /api/farms`, () => {

//     beforeEach('insert farms, favorites, and users', () =>
//     helpers.seedFarmpicksTables(
//       db,
//       testUsers,
//       testFarms,
//       testFavorites,
//     )
//   )

//     it(`creates a new farm, responding with 201 and the new farm`, () => {
//       const newFarm = {
//         farm_name: 'New Farm',
//         address_1: '123 Test',
//         city: 'Testy',
//         state: 'FL',
//         zip_code: '12345',
//         phone_number: '555-1234',
//         farm_description: 'Test description test test',
//         products: ["produce", "bee products"],
//         purchase_options: ["delivery", "farmers market"]
//       }
//       return supertest(app)
//         .post(`/api/farms`)
//         .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//         .send(newFarm)
//         .expect(201)
//         .expect(res => {
//           expect(res.body.farm_name).to.eql(newFarm.farm_name)
//           expect(res.body.address_1).to.eql(newFarm.address_1)
//           expect(res.body.city).to.eql(newFarm.city)
//           expect(res.body.state).to.eql(newFarm.state)
//           expect(res.body.zip_code).to.eql(newFarm.zip_code)
//           expect(res.body.phone_number).to.eql(newFarm.phone_number)
//           expect(res.body.farm_description).to.eql(newFarm.farm_description)
//           expect(res.body.products).to.eql(newFarm.products)
//           expect(res.body.purchase_options).to.eql(newFarm.purchase_options)
//           expect(res.body).to.have.property('id')
//           expect(res.headers.location).to.eql(`/api/farms/${res.body.id}`)
//           const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date())
//           const actualDate = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_modified))
//           expect(actualDate).to.eql(expectedDate)
//         })
//     })

//     it(`responds with 400 and an error message when the 'farm_name' is missing`, () => {
//       const noNameFarm = { farm_description: 'Something not quite right here.' }
//       return supertest(app)
//         .post(`/api/farms`)
//         .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//         .send(noNameFarm)
//         .expect(400, {
//           error: { message: `Missing 'farm_name' in request body` }
//         })
//     })

//     it(`responds with 400 and an error message when 'products' or 'purchase_options' is not an array`, () => {
//       const productsFarm = {
//         farm_name: 'TestFarm',
//         products: 'nope'
//       }
//       const purchaseOptionsFarm = {
//         farm_name: 'TestFarm',
//         purchase_options: {also: 'not good'}
//       }

//       return supertest(app)
//         .post(`/api/farms`)
//         .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//         .send(productsFarm)
//         .expect(400, {
//           error: { message: `'products' must be an array` }
//         })
//         .then(res => {
//           return supertest(app)
//             .post(`/api/farms`)
//             .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//             .send(purchaseOptionsFarm)
//             .expect(400, {
//               error: { message: `'purchase_options' must be an array` }
//             })
//         })
//     })
  

//     it(`removes XSS attack content from response`, () => {
//       const { maliciousFarm, sanitizedFarm } = helpers.makeMaliciousFarm()
//       return supertest(app)
//         .post(`/api/farms`)
//         .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//         .send(maliciousFarm)
//         .expect(201)
//         .expect(res => {
//           expect(res.body.address_1).to.eql(sanitizedFarm.address_1)
//           expect(res.body.farm_description).to.eql(sanitizedFarm.farm_description)
//         })
//     })
//   })

//   describe(`PATCH /api/farms/:id`, () => {
//     const farmUpdateFields = {
//       farm_name: "Test Farm",
//       address_2: "Test address 2",
//       farm_description: "Test farm description"
//     }
//     context(`Given there are no farms in the database`, () => {
//       it(`responds with 404`, () => {
//         const nonexistentFarmId = 9999
//         return supertest(app)
//           .patch(`/api/farms/${nonexistentFarmId}`)
//           .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//           .send(farmUpdateFields)
//           .expect(404, { error: { message: `Farm does not exist` } })
//       })
//     })

//     context(`Given there are farms in the database`, () => {
//       const idToUpdate = 2

//       beforeEach('insert farms, favorites, and users', () =>
//       helpers.seedFarmpicksTables(
//         db,
//         testUsers,
//         testFarms,
//         testFavorites,
//       )
//     )

//       it(`responds with 204 and updates the farm`, () => {
//         return supertest(app)
//           .patch(`/api/farms/${idToUpdate}`)
//           .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//           .send(farmUpdateFields)
//           .expect(204)
//           .then(res => {
//             return supertest(app)
//               .get(`/api/farms/${idToUpdate}`)
//               .expect(res => {
//                 res.body.farm_name = farmUpdateFields.farm_name
//                 res.body.address_2 = farmUpdateFields.address_2
//                 res.body.farm_description = farmUpdateFields.farm_description
//                 res.body.contact_name = testFarms[idToUpdate - 1].contact_name
//               })
//               .expect(200)
//           })
//       })

//       it(`responds with 400 if request body does not contain any appropriate fields to patch`, () => {
//         const invalidUpdateFields = { banana: 'Hello', potato: 'Goodbye' }
//         return supertest(app)
//           .patch(`/api/farms/${idToUpdate}`)
//           .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//           .send(invalidUpdateFields)
//           .expect(400, { error: {
//             message: `Request body must contain 'farm_name', 'products', 'farm_description', 'address_1', 'address_2', 'city', 'state', 'zip_code', 'contact_name', 'phone_number', 'purchase_options', 'purchase_details', 'website', 'cover_image', 'profile_image', or 'archived'` } })
//       })
//     })
//   })

//   describe(`DELETE /api/farms/:id`, () => {

//     context(`Given no farms in the database`, () => {
//       it(`responds with 404`, () => {
//         const nonexistentFarmId = 99999
//         return supertest(app)
//           .delete(`/api/farms/${nonexistentFarmId}`)
//           .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//           .expect(404, { error: { message: `Farm does not exist` } })
//       })
//     })

//     context(`Given there are farms in the database`, () => {

//       beforeEach('insert farms, favorites, and users', () =>
//       helpers.seedFarmpicksTables(
//         db,
//         testUsers,
//         testFarms,
//         testFavorites,
//       )
//     )

//       it(`if farm is not referenced in table 'favorites', responds with 204 and removes the farm`, () => {
//         const idToRemove = 3
//         const insertedFarms = testFarms
//         const expectedFarms = insertedFarms.filter(farm => farm.id !== idToRemove)
//         expectedFarms[0].number_of_favorites = '2'
//         expectedFarms[1].number_of_favorites = '1'
//         expectedFarms[2].number_of_favorites = '2'
//         return supertest(app)
//           .delete(`/api/farms/${idToRemove}`)
//           .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
//           .expect(204)
//           .then(res =>
//             supertest(app)
//               .get(`/api/farms`)
//               .expect(expectedFarms)
//           )
//       })
//     })
//   })
// })