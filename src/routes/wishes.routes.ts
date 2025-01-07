import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import wishesController from '../controllers/wishes.controller';

const router = Router()

router.get('/wishes', authMiddleware, wishesController.getWishesItems)
router.post('/wishes/add-to-wishes', authMiddleware, wishesController.addItemToWishes)
router.delete('/wishes/remove-from-wishes', authMiddleware, wishesController.removeWishesItem)

module.exports = router
