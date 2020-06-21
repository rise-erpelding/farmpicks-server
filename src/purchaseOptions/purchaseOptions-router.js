const express = require('express');
const PurchaseOptionsService = require('./purchaseOptions-service');
const purchaseOptionsRouter = express.Router();

// gets all purchase option categories corresponding to entries in the farms table
purchaseOptionsRouter
  .route('/')
  .get((req, res, next) => {
    PurchaseOptionsService.getAllPurchaseCategories(req.app.get('db'))
    .then(options => {
      res.json(options.rows[0].array);
    })
    .catch(next);
  });

  module.exports = purchaseOptionsRouter;