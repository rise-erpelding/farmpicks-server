const express = require('express');
const FavoritesService = require('./favorites-service');
const favoritesRouter = express.Router();
const path = require('path');
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

favoritesRouter
  .route('/')
  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    const { favorite_farm } = req.body;
    if (!favorite_farm) {
      return res.status(400).json({
        error: { message: `Missing 'favorite_farm' in request body` }
      });
    }
    // adds the farm id in favorite_farm to favorites table, along with user id
    FavoritesService.addFavorite(
      req.app.get('db'),
      req.user.id,
      favorite_farm
    )
      .then(favorite => {
        res
          .status(201)
          .location(path.posix.join(
            req.originalUrl,
            favorite_farm.toString()
          ))
          .json(favorite);
      })
      .catch(next);
  })
  .get(jsonParser, (req, res, next) => {
    // gets the id from the favorites table corresponding to the user id and farm id 
    // provided--this id is used to delete from favorites table
    FavoritesService.getFavoriteId(
      req.app.get('db'),
      req.user.id,
      req.query.farm_id
    )
      .then(favorite => {
        if (!favorite) {
          return res
            .status(404)
            .json({
              error: { message: `Favorite does not exist` }
            });
        }
        res.json(favorite);
        next();
      })
      .catch(next);
  });

favoritesRouter
  .route('/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    // deletes entry in favorites table corresponding to that id
    FavoritesService.removeFavorite(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

  module.exports = favoritesRouter;