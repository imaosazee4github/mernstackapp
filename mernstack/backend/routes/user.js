const express = require('express')
const { signup, signin,logout, singleUser } = require('../controller/usercontrol')


const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin) 
router.get('/logout', logout)
router.get('/user/:id', singleUser)



module.exports = router