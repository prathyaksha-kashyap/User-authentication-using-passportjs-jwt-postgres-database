const express=require('express')
const router=express.Router()
const authenticateUser = require('../middlewares/authenticate')
const userController = require('../controllers/userController')
const passport = require('passport')


//@to users route handlers
//router.post('/users/register', userController.register)
router.post('/users/register', userController.register)
router.post('/users/login', userController.login)
router.delete('/users/logout', passport.authenticate('jwt', { session: false }), userController.logout)
router.get('/users/account',passport.authenticate('jwt', { session: false }), userController.account)

//other routes comes here

module.exports = router