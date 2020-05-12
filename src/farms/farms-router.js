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

  module.exports = farmsRouter