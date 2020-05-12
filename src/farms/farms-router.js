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

  module.exports = farmsRouter