import Router from 'express';
import authMiddleware from '../middleware/auth.middleware';
import orderController from '../controllers/order.controller';

const router = Router()

router.post('/order', authMiddleware, orderController.initOrder)
router.get('/order', authMiddleware, orderController.getOrders)
router.get('/order/:id', authMiddleware, orderController.getOrderByID)
router.get('/order/:id/items', authMiddleware, orderController.getOrderItemsByOrderId)

module.exports = router
