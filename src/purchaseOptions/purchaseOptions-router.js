const express = require('express')
const PurchaseOptionsService = require('./purchaseOptions-service')
const purchaseOptionsRouter = express.Router()

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