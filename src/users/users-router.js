const express = require('express')
const UsersService = require('./users-service')
const usersRouter = express.Router()
// const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

usersRouter
  .route('/')
  .get(requireAuth, jsonParser, (req, res, next) => {
    //some validations
    UsersService.getUserById(
      req.app.get('db'),
      req.user.id
    )
      .then(user => {
        if (!user) {
          return res
            .status(404)
            .json({
              error: { message: `User does not exist` }
            })
        }
        res.json(user)
        next()
      })
      .catch(next)
  })

usersRouter
  .route('/favorites')
  .get(requireAuth, jsonParser, (req, res, next) => {
    //some validations
    UsersService.getUserFavorites(
      req.app.get('db'),
      req.user.id
    )
      .then(favorites => {
        res.json(favorites)
        next()
      })
      .catch(next)
  })
//   .post(jsonParser, (req, res, next) => {
//     const { favorite_farm, user_id } = req.body
//     // console.log(favorite_farm)
//     // Validation: get the farm and see if it exists, if not return a 404
//     // Validation: favorite_farm must be a number
//     //req.user.id instead of req.params.id
//     console.log(req.user)
//     UsersService.addUserFavorite(
//       req.app.get('db'),
//       user_id,
//       favorite_farm
//     )
//       .then(favorite => {
//         res
//           .status(201)
//           .location(path.posix.join(
//             req.originalUrl,
//             favorite_farm.toString()
//           ))
//           .json(favorite)
//       })
//       .catch(next)
//   })

// usersRouter
//   .route('/:id/favorites/:farmId')
//   .delete((req, res, next) => {
//     UsersService.removeUserFavorite(
//       req.app.get('db'),
//       req.params.id,
//       req.params.farmId
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })

  module.exports = usersRouter