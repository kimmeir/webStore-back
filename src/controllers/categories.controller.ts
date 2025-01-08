import { db } from '../db'
import { CategoryModel } from '../models/category.model'
import categoriesMock from '../mocks/categories.mock'
import type { Request, Response } from 'express';

const force = false

class CategoriesController {
  constructor() {
    // this.init()
  }

  init = async () => {
    try {
      await db.authenticate()
      await CategoryModel.sync({ force })
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const newCategory = await CategoryModel.create(req.body)
      res.json(newCategory)
    } catch (error) {
      res.status(400).json({ message: 'Create category error ' + error })
    }
  }

  getCategories = async (req: Request, res: Response) => {
    const categories = await CategoryModel.findAll()
    res.json(categories)
  }

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id
      const category = await CategoryModel.findOne({ where: { id } })
      res.json(category)
    } catch (error) {
      res.status(400).json({ message: 'Get category by id error ' + error })
    }
  }

  updateCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id
      const category = await CategoryModel.update(req.body, { where: { id } })
        .then(() => CategoryModel.findOne({ where: { id } }))
      res.json(category)
    } catch (error) {
      res.status(400).json({ message: 'Update category error ' + error })
    }
  }

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id
      await CategoryModel.destroy({ where: { id } })
        .then(() => res.json({ status: 'Category deleted' }))
    } catch (error) {
      res.status(400).json({ message: 'Delete category error ' + error })
    }
  }

  createMockCategories = async () => {
    return await CategoryModel.bulkCreate(categoriesMock)
  }
}

export default new CategoriesController()
