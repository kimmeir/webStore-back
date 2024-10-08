const Router = require('express')
const router = new Router()
const userController = require('../controllers/users.controller')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/auth/registration', [
  check('email', 'Incorrect email').normalizeEmail().isEmail().notEmpty(),
  check('first_name', 'Incorrect first name').notEmpty(),
  check('password', 'Incorrect password').exists().isLength({ min: 6, max: 12 })
], userController.registration)
router.post('/auth/login', [
  check('email', 'Incorrect email').normalizeEmail().isEmail().notEmpty(),
  check('password', 'Incorrect password').exists().isLength({ min: 6, max: 12 })
], userController.login)

router.get('/profile', authMiddleware, userController.getProfile)
router.get('/user', authMiddleware, userController.getUsers)
router.get('/user/:id', authMiddleware, userController.getUserById)
router.put('/user/:id', authMiddleware, userController.updateUser)
router.delete('/user/:id', authMiddleware, userController.deleteUser)

module.exports = router
