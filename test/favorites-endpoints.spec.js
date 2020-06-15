const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Favorites Endpoints', function() {
  let db

  const {
    testUsers,
    testFarms,
    testFavorites,
  } = helpers.makeFarmsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
      pool: {
        min: 0,
        max: 7
      }
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))



  describe(`GET /api/favorites`, () => {
    context(`Given that the database is seeded with farms, favorites, and users`, () => {

      beforeEach('insert farms, favorites, and users', () =>
        helpers.seedFarmpicksTables(
          db,
          testUsers,
          testFarms,
          testFavorites,
        )
      )

      it(`responds with the id of a favorite given a farm id and the user's id`, () => {
        const favoriteFarmId = 2
        return supertest(app)
          .get(`/api/favorites`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .query(`farm_id=${favoriteFarmId}`)
          .expect(200, { id: 3 })
      })

      it(`responds with a 404 if there is no favorite consisting of the user's id and the farm's id`, () => {
        const favoriteFarmId = 3
        return supertest(app)
          .get(`/api/favorites`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .query(`farm_id=${favoriteFarmId}`)
          .expect(404, { error: { message: "Favorite does not exist"} })
      })
    })
  })

  describe(`POST /api/favorites`, () => {

    beforeEach('insert farms, favorites, and users', () =>
    helpers.seedFarmpicksTables(
      db,
      testUsers,
      testFarms,
      testFavorites,
    )
  )

    it(`creates a new favorite`, () => {
      const favoriteFarm = { favorite_farm: 3 }
      return supertest(app)
        .post(`/api/favorites`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
        .send(favoriteFarm)
        .expect(201)
        .expect(res => {
          expect(res.body.favorited_farm).to.eql(favoriteFarm.favorite_farm)
          expect(res.body.favorited_by).to.eql(5)
          expect(res.body).to.have.property('id')
          expect(res.body).to.have.property('date_created')
          expect(res.headers.location).to.eql(`/api/favorites/${res.body.favorited_farm}`)
        })
    })

    it(`responds with 400 and an error message when the 'favorite_farm' is missing`, () => {
      const otherStuff = { something_else: 3 }
      return supertest(app)
        .post(`/api/favorites`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
        .send(otherStuff)
        .expect(400, {
          error: {
            message: `Missing 'favorite_farm' in request body`
          }
        })
    })
  })

})