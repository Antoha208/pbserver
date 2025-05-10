const { Router } = require('express')
const pbRouter = Router()

const pbController = require('../controllers/pbController')
// const { authMiddleware } = require('../middleware/authMiddleware.js')

pbRouter.get('/newPb', pbController.handlePostback)


module.exports = pbRouter