const express = require('express')
const ProductsService = require('./products-service')
const productsRouter = express.Router()

productsRouter
  .route('/')
  .get((req, res, next) => {
    ProductsService.getAllProductCategories(req.app.get('db'))
    .then(products => {
      res.json(products.rows[0].array)
    })
    .catch(next)
  })

  module.exports = productsRouter