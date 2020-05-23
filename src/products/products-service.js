const productsService = {
  getAllProductCategories(knex) {
    return knex.raw('SELECT ARRAY(SELECT DISTINCT UNNEST(products) FROM  farms)')
  },
}

module.exports = productsService