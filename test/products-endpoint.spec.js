const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Products Endpoints', function() {
  let db;

  const {
    testUsers,
    testFarms,
    testFavorites,
  } = helpers.makeFarmsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
      pool: {
        min: 0,
        max: 7
      }
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`GET /api/products`, () => {
    context(`Given no farms in the database`, () => {
      it(`responds with 200 and an empty list`, () => {
        // eslint-disable-next-line no-undef
        return supertest(app)
          .get(`/api/products`)
          .expect(200, []);
      });
    });

    context(`Given there are farms in the database`, () => {

      beforeEach('insert farms, favorites, and users', () =>
        helpers.seedFarmpicksTables(
          db,
          testUsers,
          testFarms,
          testFavorites,
        )
      );

      it(`responds with 200 and all of the products from existing farms`, () => {
        const expectedProducts = [
          "meat/poultry",
          "bee products",
          "seafood",
          "eggs",
          "prepared foods",
          "bath & body products",
          "produce"
        ];
        // eslint-disable-next-line no-undef
        return supertest(app)
          .get(`/api/products`)
          .expect(200, expectedProducts);
      });
    });
  });
});