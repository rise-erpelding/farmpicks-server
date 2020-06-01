const FarmsService = {
  getAllFarms(knex) {
    return knex
      .select('*')
      .from('farms')
  },
  getFarmsBySearchTerm(knex, query) {
    return knex
      .select('*')
      .from('farms')
      .where('farm_name', 'ilike', '%' + query + '%')
      .orWhere('farm_description', 'ilike', '%' + query + '%')
      .orWhere('purchase_details', 'ilike', '%' + query + '%')
      .orWhere('contact_name', 'ilike', '%' + query + '%')
      .orWhere('city', 'ilike', '%' + query + '%')
  },
  getFarmsByProduct(knex, products) {
    return knex
      .select('*')
      .from('farms')
      .where(knex.raw('? = ANY (products)', [products]))
  },
  getFarmsByPurchaseOptions(knex, purchaseOptions) {
    return knex
      .select('*')
      .from('farms')
      .where(knex.raw('? = ANY (purchase_options)', [purchaseOptions]))
  },
  insertFarm(knex, newFarm) {
    return knex
      .insert(newFarm)
      .into('farms')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getFarmById(knex, id) {
    return knex
      .from('farms')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteFarm(knex, id) {
    return knex
      .from('farms')
      .where('id', id)
      .delete()
  },
  updateFarm(knex, id, newFarmFields) {
    return knex
      .from('farms')
      .where('id', id)
      .update(newFarmFields)
  }
}

module.exports = FarmsService