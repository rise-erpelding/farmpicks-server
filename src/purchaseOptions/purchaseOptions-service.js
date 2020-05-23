const purchaseOptionsService = {
  getAllPurchaseCategories(knex) {
    return knex.raw('SELECT ARRAY(SELECT DISTINCT UNNEST(purchase_options) FROM  farms)')
  },
}

module.exports = purchaseOptionsService