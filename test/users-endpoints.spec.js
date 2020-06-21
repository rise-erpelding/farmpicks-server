const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
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

  describe(`GET /api/users`, () => {
    context(`Given there are users in the database`, () => {

      beforeEach('insert farms, favorites, and users', () =>
        helpers.seedFarmpicksTables(
          db,
          testUsers,
          testFarms,
          testFavorites,
        )
      );

      it(`responds with 200 and all of the user information corresponding to the id set in the authorization`, () => {
        const expectedUser = [{
          id: 5,
          user_name: 'Consumer1',
          first_name: 'Test',
          last_name: 'User',
          user_type: 'Consumer',
        }];
        // eslint-disable-next-line no-undef
        return supertest(app)
          .get(`/api/users`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .expect(200, expectedUser);
      });
    });
  });

  describe(`GET /api/users/favorites`, () => {

    context(`Given there are users in the database`, () => {
      beforeEach('insert farms, favorites, and users', () =>
        helpers.seedFarmpicksTables(
          db,
          testUsers,
          testFarms,
          testFavorites,
        )
      );

      it(`responds with 200 and the specified farm`, () => {
        const expectedFarms = [
          {
            id: 1,
            farm_name: 'Pine Ridge Beef',
            products: [ 'meat/poultry', 'prepared foods' ],
            farm_description: 'Grass-fed beef from Florida, located in Andalusia. The farm is the only one in Florida that still directly oversees all aspects of raising the livestock. The beef is 100% grassfed and finished, and hormone and antibiotic-free.',
            profile_image: 'https://cdn.pixabay.com/photo/2018/08/23/01/18/cow-3625025_960_720.jpg'
          },
          {
            id: 2,
            farm_name: 'Aldridge Acres',
            products: [ 'produce', 'eggs' ],
            farm_description: 'Family-owned farm located in Ashford, specializing in heirloom, non-gmo produce using no-till crop rotation methods and integrated pest management.',
            profile_image: 'https://cdn.pixabay.com/photo/2017/05/23/22/36/vegetables-2338824_960_720.jpg'
          },
          {
            id: 4,
            farm_name: 'Treasure Farms',
            products: [ 'bee products', 'bath & body products' ],
            farm_description: 'From our honeybees to you, raw local honey and other products from the hive. Apiaries located in Samson. Enjoy our liquid gold!',
            profile_image: 'https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_960_720.jpg'
          }
        ];
        // eslint-disable-next-line no-undef
        return supertest(app)
          .get(`/api/users/favorites`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .expect(200, expectedFarms);
      });
    });
  });
});