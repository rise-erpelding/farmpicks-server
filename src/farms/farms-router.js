const express = require('express')
const xss = require('xss')
const FarmsService = require('./farms-service')
const path = require('path')
const farmsRouter = express.Router()
const jsonParser = express.json()

const serializeFarm = farm => ({
  id: farm.id,
  farm_name: xss(farm.farm_name),
  address_1: xss(farm.address_1),
  address_2: xss(farm.address_2),
  city: xss(farm.city),
  zip_code: farm.zip_code,
  state: farm.state,
  phone_number: xss(farm.phone_number),
  contact_name: xss(farm.contact_name),
  farm_description: xss(farm.farm_description),
  date_modified: farm.date_modified,
  archived: farm.archived,
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
    const { farm_name, address_1, address_2, city, zip_code, state, phone_number, contact_name, farm_description, archived } = req.body
    const newFarm = { farm_name, address_1, address_2, city, zip_code, state, phone_number, contact_name, farm_description, archived }

    if (!farm_name) {
      return res.status(400).json({
        error: { message: `Missing 'farm_name' in request body` }
      })
    }

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
    const { farm_name, address_1, address_2, city, zip_code, state, phone_number, contact_name, farm_description, archived } = req.body
    const dateModified = new Date()
    const farmToUpdate = { farm_name, address_1, address_2, city, zip_code, state, phone_number, contact_name, farm_description, archived, date_modified: dateModified }
    
    // TODO: This needs a better validation
    const numberOfUpdateValues = Object.values(farmToUpdate).filter(Boolean).length
    if (numberOfUpdateValues === 0) {
      return res
        .status(400)
        .json({
          error: {
            message: `Request body must contain 'farm_name', 'address_1', 'address_2', 'city', 'zip_code', 'state', 'phone_number', 'contact_name', 'farm_description', or 'archived'`
          }
        })
    }

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