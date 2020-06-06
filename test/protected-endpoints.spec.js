const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
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

  beforeEach('insert farms, favorites, and users', () =>
  helpers.seedFarmpicksTables(
    db,
    testUsers,
    testFarms,
    testFavorites,
  )
)

  // beforeEach('insert users', () => {
  //   return db
  //     .into('users')
  //     .insert(testUsers)
  // })

  // beforeEach('insert farms', () => {
  //   return db
  //     .into('farms')
  //     .insert(testFarms)
  // })

  // beforeEach('insert favorites', () => {
  //   return db
  //     .into('favorites')
  //     .insert(testFavorites)
  // })

  const protectedEndpoints = [
    {
      name: 'POST /api/farms',
      path: '/api/farms',
      method: supertest(app).post,
    },
    {
      name: 'PATCH /api/farms/:id',
      path: '/api/farms/1',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/farms/:id',
      path: '/api/farms/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/users',
      path: '/api/users',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/favorites',
      path: '/api/users/favorites',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/favorites',
      path: '/api/favorites',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/favorites/:id',
      path: '/api/favorites/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/favorites',
      path: '/api/favorites/1',
      method: supertest(app).get,
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})