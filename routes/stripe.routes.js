const router = require('express').Router()
const stripeController = require('../controllers/stripe.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/stripe-checkout', authMiddleware, stripeController.createPaymentIntent)
router.post('/stripe-payment-method', authMiddleware, stripeController.createPaymentMethod)
router.get('/stripe-payment-method', authMiddleware, stripeController.getCustomerPaymentMethods)

module.exports = router
