const express = require('express')
// const xss = require('xss')
const PurchaseOptionsService = require('./purchaseOptions-service')
// const path = require('path')
const purchaseOptionsRouter = express.Router()
// const jsonParser = express.json()

// const seralizeProducts = product => ({
//   // TODO: Should I worry about the arrays being protected from xss attacks?
//   
// })

purchaseOptionsRouter
  .route('/')
  .get((req, res, next) => {
    PurchaseOptionsService.getAllPurchaseCategories(req.app.get('db'))
    .then(options => {
      res.json(options.rows[0].array)
    })
    .catch(next)
  })

  module.exports = purchaseOptionsRouter