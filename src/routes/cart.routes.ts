import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import cartController from '../controllers/cart.controller';

const router = Router()

router.get('/cart', authMiddleware, cartController.getCartItems)
router.post('/cart/add-to-cart', authMiddleware, cartController.addItemToCart)
router.post('/cart/bulk-add-to-cart', authMiddleware, cartController.bulkAddToCart)
router.delete('/cart/remove-from-cart', authMiddleware, cartController.deleteCartItem)

module.exports = router
