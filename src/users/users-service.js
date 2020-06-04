const UsersService = {
  getUserById(knex, userId) {
    return knex
      .select(
        'users.user_name',
        'users.first_name',
        'users.last_name',
        'users.user_type',
        'users.id'
      )
      .from('users')
      .where('users.id', userId)
  },
  getUserFavorites(knex, userId) {
    return knex
      .select(
        'farms.id', 
        'farms.farm_name',
        'farms.products',
        'farms.farm_description',
        'farms.profile_image'
      )
      .from('farms')
      .join(
        'favorites',
        'farms.id',
        'favorites.favorited_farm'
      )
      .join(
        'users',
        'users.id',
        'favorites.favorited_by'
      )
      .where('users.id', userId)
  },
  addUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  removeUser(knex, id) {
    return knex
      .from('users')
      .where('id', id)
      .delete()
  },
  updateUser(knex, id, updatedUserInfo) {
    return knex
      .from('users')
      .where('id', id)
      .update(updatedUserInfo)
  },
  addUserFavorite(knex, userId, farmId) {
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
  removeUserFavorite(knex, userId, farmId) {
    return knex
      .from('favorites')
      .where({
        favorited_farm: farmId,
        favorited_by: userId
      })
      .delete()
  }
}

module.exports = UsersService