const express = require('express')
const {CLIENT_PORT, CLIENT_URL } = process.env;
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const MainRouter = require('./routes/index.js')

require('./db.js')

const api = express()

api.use(express.json({ limit: '50mb' }))
api.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
api.use(cookieParser())
api.use(cors())
api.use(morgan('dev'))
api.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        `${CLIENT_URL}:${CLIENT_PORT}`
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept, Origin, X-Requested-With'
    )
    next()
})

api.use('/api', MainRouter)

api.use((err, req, res, next) => {
    let errMessage = err.message || 'An unexpected error occurred'
    res.status(500).json({ error: errMessage })
    next()
})



module.exports = api
