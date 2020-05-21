const productsService = {
  getAllProductCategories(knex) {
    return knex.raw('SELECT ARRAY(SELECT DISTINCT UNNEST(products) FROM  farms)')
  },
    // getAllProductCategories(knex) {
  //   return knex
  //     .select('*')
  //     .from('farms')
  //   // knex.raw('SELECT ARRAY(SELECT UNNEST(products) FROM  farms)')
  //   // knex.raw('SELECT DISTINCT unnest(products) FROM farms')
  // },
}

module.exports = productsService