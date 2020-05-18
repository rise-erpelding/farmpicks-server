const express = require('express')
const xss = require('xss')
const FarmsService = require('./farms-service')
const path = require('path')
const farmsRouter = express.Router()
const jsonParser = express.json()

const serializeFarm = farm => ({
  // TODO: Should I worry about the arrays being protected from xss attacks?
  id: farm.id,
  farm_name: xss(farm.farm_name),
  products: farm.products,
  farm_description: xss(farm.farm_description),
  address_1: xss(farm.address_1),
  address_2: xss(farm.address_2),
  city: xss(farm.city),
  state: xss(farm.state),
  zip_code: farm.zip_code,
  contact_name: xss(farm.contact_name),
  phone_number: xss(farm.phone_number),
  purchase_options: farm.purchase_options,
  purchase_details: xss(farm.purchase_details),
  website: xss(farm.website),
  cover_image: xss(farm.cover_image),
  profile_image: xss(farm.profile_image),
  date_modified: farm.date_modified,
  archived: farm.archived
})

farmsRouter
  .route('/')
  .get((req, res, next) => {
    FarmsService.getAllFarms(req.app.get('db'))
      .then(farms => {
        res.json(farms.map(serializeFarm))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { farm_name, products, farm_description, address_1, address_2, city, state, zip_code, contact_name, phone_number, purchase_options, purchase_details, website, cover_image, profile_image, archived } = req.body
    const newFarm = { farm_name, products, farm_description, address_1, address_2, city, state, zip_code, contact_name, phone_number, purchase_options, purchase_details, website, cover_image, profile_image, archived }
    const farmArrays = { products, purchase_options }

    for (const [key, value] of Object.entries(farmArrays))
      if (value && !Array.isArray(value)) {
        return res.status(400).json({
          error: { message: `${key} must be an array` }
        })
      }

    // if (purchase_options && !Array.isArray(purchase_options) || products && !Array.isArray(products)) {
    //   return res.status(400).json({
    //     error: { message: `must be an array` }
    //   })
    // }

    if (!farm_name) {
      return res.status(400).json({
        error: { message: `Missing 'farm_name' in request body` }
      })
    }



    // TODO: Some sort of validation to ensure that products and purchase_options are both arrays


    FarmsService.insertFarm(
      req.app.get('db'),
      newFarm
    )
      .then(farm => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${farm.id}`))
          .json(serializeFarm(farm))
      })
    .catch(next)
  })

farmsRouter
  .route('/:id')
  .all((req, res, next) => {
    FarmsService.getFarmById(
      req.app.get('db'),
      req.params.id
    )
      .then(farm => {
        if (!farm) {
          return res
            .status(404)
            .json({
              error: { message: `Farm does not exist` }
            })
        }
        res.farm = farm
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFarm(res.farm))
  })
  .delete((req, res, next) => {
    FarmsService.deleteFarm(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { farm_name, products, farm_description, address_1, address_2, city, state, zip_code, contact_name, phone_number, purchase_options, purchase_details, website, cover_image, profile_image, archived } = req.body
    const farmToUpdate = { farm_name, products, farm_description, address_1, address_2, city, state, zip_code, contact_name, phone_number, purchase_options, purchase_details, website, cover_image, profile_image, archived }
    
    const numberOfUpdateValuesGiven = Object.values(farmToUpdate).filter(Boolean).length
    if (numberOfUpdateValuesGiven === 0) {
      return res
      .status(400)
      .json({
        error: {
          message: `Request body must contain 'farm_name', 'products', 'farm_description', 'address_1', 'address_2', 'city', 'state', 'zip_code', 'contact_name', 'phone_number', 'purchase_options', 'purchase_details', 'website', 'cover_image', 'profile_image', or 'archived'`
        }
      })
    }
    
    farmToUpdate.date_modified = new Date()

    FarmsService.updateFarm(
      req.app.get('db'),
      req.params.id,
      farmToUpdate
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })

  module.exports = farmsRouter