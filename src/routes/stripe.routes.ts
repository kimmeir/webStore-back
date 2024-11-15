import { Router } from 'express';
import stripeController from '../controllers/stripe.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router()

router.post('/stripe-payment-method', authMiddleware, stripeController.createPaymentMethod)
router.get('/stripe-payment-method', authMiddleware, stripeController.getCustomerPaymentMethods)
router.post('/stripe-default-card', authMiddleware, stripeController.setCardAsDefault)
router.get('/stripe-customer', authMiddleware, stripeController.getCustomer)

module.exports = router
