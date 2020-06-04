require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const farmsRouter = require('./farms/farms-router')
const productsRouter = require('./products/products-router')
const purchaseOptionsRouter = require('./purchaseOptions/purchaseOptions-router')
const favoritesRouter = require('./favorites/favorites-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/farms', farmsRouter)
app.use('/api/products', productsRouter)
app.use('/api/purchase-options', purchaseOptionsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('Hello FarmPicks!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app