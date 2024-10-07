const db = require('../db')
const Category = require('../models/category.model')


class CategoriesController {
  constructor() {
    this.init()
  }

  async init() {
    await db.authenticate()
    await Category.sync()
    // await Category.sync({force: true}); //for refreshing tables
  }
 
  async createCategory(req, res) {
    const newCategory = await Category.create(req.body)
    res.json(newCategory)
  }

  async getCategories(req, res) {
    const categories = await Category.findAll()
    res.json(categories)
  }

  async getCategoryById(req, res) {
    const id = req.params.id
    const category = await Category.findOne({ where: { id } })
    res.json(category)
  }

  async updateCategory(req, res) {
    const id = req.params.id
    const category = await Category.update(req.body, { where: { id } })
      .then(() => Category.findOne({ where: { id } }))
    res.json(category)
  }

  async deleteCategory(req, res) {
    const id = req.params.id
    await Category.destroy({ where: { id } })
      .then(() => res.json({ status: 'Category deleted' }))
  }
}

module.exports = new CategoriesController()
