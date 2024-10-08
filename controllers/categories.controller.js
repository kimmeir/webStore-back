const db = require('../db')
const Category = require('../models/category.model')
const categoriesMock = require('../mocks/categories.mock')

const force = false

class CategoriesController {
  constructor() {
    // this.init()
  }

  init = async () => {
    try {
      await db.authenticate()
      await Category.sync({ force })
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  createCategory = async (req, res) => {
    try {
      const newCategory = await Category.create(req.body)
      res.json(newCategory)
    } catch (error) {
      res.status(400).json({ message: 'Create category error ' + error })
    }
  }

  getCategories = async (req, res) => {
    const categories = await Category.findAll()
    res.json(categories)
  }

  getCategoryById = async (req, res) => {
    try {
      const id = req.params.id
      const category = await Category.findOne({ where: { id } })
      res.json(category)
    } catch (error) {
      res.status(400).json({ message: 'Get category by id error ' + error })
    }
  }

  updateCategory = async (req, res) => {
    try {
      const id = req.params.id
      const category = await Category.update(req.body, { where: { id } })
        .then(() => Category.findOne({ where: { id } }))
      res.json(category)
    } catch (error) {
      res.status(400).json({ message: 'Update category error ' + error })
    }
  }

  deleteCategory = async (req, res) => {
    try {
      const id = req.params.id
      await Category.destroy({ where: { id } })
        .then(() => res.json({ status: 'Category deleted' }))
    } catch (error) {
      res.status(400).json({ message: 'Delete category error ' + error })
    }
  }

  createMockCategories = async () => {
    return await Category.bulkCreate(categoriesMock)
  }
}

module.exports = new CategoriesController()
