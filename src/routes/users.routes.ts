import { Router } from 'express';
import { check } from 'express-validator';
import userController from '../controllers/users.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router()

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
router.put('/profile', authMiddleware, userController.updateProfile)
router.get('/user', authMiddleware, userController.getUsers)
router.get('/user/:id', authMiddleware, userController.getUserById)
router.put('/user/:id', authMiddleware, userController.updateUser)
router.delete('/user/:id', authMiddleware, userController.deleteUser)
router.put('/update-address', authMiddleware, userController.updateAddress)

module.exports = router
