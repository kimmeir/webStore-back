const Router = require('express')
const router = new Router()
const cartController = require('../controllers/cart.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/cart', authMiddleware, cartController.getCart)
router.post('/cart/add-to-cart', authMiddleware, cartController.addItemToCart)
router.delete('/cart/remove-from-cart', authMiddleware, cartController.deleteCartItem)

module.exports = router
