const FavoritesService = {
  addFavorite(knex, userId, farmId) {
    return knex
      .insert({
        favorited_farm: farmId,
        favorited_by: userId
      })
      .into('favorites')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getFavoriteId(knex, userId, farmId) {
    return knex
      .select('id')
      .from('favorites')
      .where({
        favorited_farm: farmId,
        favorited_by: userId
      })
      .first()
  },
  removeFavorite(knex, id) {
    return knex
      .from('favorites')
      .where('id', id)
      .delete()
  }
}

module.exports = FavoritesService