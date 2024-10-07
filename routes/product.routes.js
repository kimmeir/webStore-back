const Router = require('express')
const router = new Router()
const productController = require('../controllers/product.controller')

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProductById)
router.post('/products', productController.createProduct)
router.post('/products/many', productController.createManyProducts)
router.put('/products/:id', productController.updateProduct)
router.delete('/products/:id', productController.deleteProduct)

module.exports = router

