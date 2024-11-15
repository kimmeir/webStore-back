import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router()

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProductById)
router.post('/products', productController.createProduct)
router.post('/products/many', productController.createManyProducts)
router.put('/products/:id', productController.updateProduct)
router.delete('/products/:id', productController.deleteProduct)

module.exports = router

