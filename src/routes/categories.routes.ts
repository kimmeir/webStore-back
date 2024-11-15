import { Router } from 'express';
import categoriesController from '../controllers/categories.controller';

const router = Router()

router.get('/categories', categoriesController.getCategories)
router.get('/categories/:id', categoriesController.getCategoryById)
router.post('/categories', categoriesController.createCategory)
router.put('/categories/:id', categoriesController.updateCategory)
router.delete('/categories/:id', categoriesController.deleteCategory)

module.exports = router

