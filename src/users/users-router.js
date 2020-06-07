const express = require('express')
const UsersService = require('./users-service')
const usersRouter = express.Router()
// const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

usersRouter
  .route('/')
  .all(requireAuth)
  .get(jsonParser, (req, res, next) => {
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
  .all(requireAuth)
  .get(jsonParser, (req, res, next) => {
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

  module.exports = usersRouter