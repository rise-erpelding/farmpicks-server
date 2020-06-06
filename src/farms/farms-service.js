const FarmsService = {
  getAllFarms(knex) {
    return knex
      .select('farms.*',
        knex.raw(`count(DISTINCT favorites) AS number_of_favorites`)
      )
      .from('farms')
      .leftJoin(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .groupBy('farms.id')
  },
  getFarmsBySearchTerm(knex, query) {
    return knex
      .select('farms.*',
        knex.raw(`count(DISTINCT favorites) AS number_of_favorites`)
      )
      .from('farms')
      .where('farm_name', 'ilike', '%' + query + '%')
      .orWhere('farm_description', 'ilike', '%' + query + '%')
      .orWhere('purchase_details', 'ilike', '%' + query + '%')
      .orWhere('contact_name', 'ilike', '%' + query + '%')
      .orWhere('city', 'ilike', '%' + query + '%')
      .leftJoin(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .groupBy('farms.id')
  },
  getFarmsByProduct(knex, products) {
    return knex
      .select('farms.*',
        knex.raw(`count(DISTINCT favorites) AS number_of_favorites`)
      )
      .from('farms')
      .where(knex.raw('? = ANY (products)', [products]))
      .leftJoin(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .groupBy('farms.id')
  },
  getFarmsByPurchaseOptions(knex, purchaseOptions) {
    return knex
      .select('farms.*',
        knex.raw(`count(DISTINCT favorites) AS number_of_favorites`)
      )
      .from('farms')
      .where(knex.raw('? = ANY (purchase_options)', [purchaseOptions]))
      .leftJoin(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .groupBy('farms.id')
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
      .select('farms.*',
        knex.raw(`count(DISTINCT favorites) AS number_of_favorites`)
      )
      .where('farms.id', id)
      .leftJoin(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .groupBy('farms.id')
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