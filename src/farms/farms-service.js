const FarmsService = {
  getAllFarms(knex) {
    return knex
      .select('*')
      .from('farms')
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