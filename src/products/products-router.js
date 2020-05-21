const express = require('express')
// const xss = require('xss')
const ProductsService = require('./products-service')
// const path = require('path')
const productsRouter = express.Router()
// const jsonParser = express.json()

// const seralizeProducts = product => ({
//   // TODO: Should I worry about the arrays being protected from xss attacks?
//   
// })

  // TODO: I want to create a new route to be able to get all the products. Tried to test various queries in knex/postgresql, found one that worked in postgres but unable to set this up to see if it works in knex as well.
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