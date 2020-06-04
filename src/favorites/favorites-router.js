const express = require('express')
const FavoritesService = require('./favorites-service')
const favoritesRouter = express.Router()
const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

favoritesRouter
  .route('/')
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { favorite_farm, user_id } = req.body
    // const { user_id } = req.user.id
    // console.log(user_id)
    // console.log(favorite_farm)
    // Validation: get the farm and see if it exists, if not return a 404
    // Validation: favorite_farm must be a number
    //req.user.id instead of req.params.id
    console.log(req.user)
    FavoritesService.addFavorite(
      req.app.get('db'),
      user_id,
      favorite_farm
    )
      .then(favorite => {
        res
          .status(201)
          .location(path.posix.join(
            req.originalUrl,
            favorite_farm.toString()
          ))
          .json(favorite)
      })
      .catch(next)
  })
  .get(jsonParser, (req, res, next) => {
    FavoritesService.getFavoriteId(
      req.app.get('db'),
      req.query.user_id,
      req.query.farm_id
    )
      .then(favorite => {
        if (!favorite) {
          return res
            .status(404)
            .json({
              error: { message: `Favorite does not exist` }
            })
        }
        res.json(favorite)
        next()
      })
      .catch(next)
  })

favoritesRouter
  .route('/:id')
  .delete((req, res, next) => {
    FavoritesService.removeFavorite(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = favoritesRouter