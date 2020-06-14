const express = require('express')
const ProductsService = require('./products-service')
const productsRouter = express.Router()

// gets all product categories corresponding to entries in the farms table
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