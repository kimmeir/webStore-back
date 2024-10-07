const Router = require('express')
const router = new Router()
const categoriesController = require('../controllers/categories.controller')

router.get('/categories', categoriesController.getCategories)
router.get('/categories/:id', categoriesController.getCategoryById)
router.post('/categories', categoriesController.createCategory)
router.put('/categories/:id', categoriesController.updateCategory)
router.delete('/categories/:id', categoriesController.deleteCategory)

module.exports = router

