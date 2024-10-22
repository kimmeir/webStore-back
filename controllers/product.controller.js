const db = require('../db')
const Product = require('../models/product.model')
const productsMock = require('../mocks/products.mock')
const { Op } = require('sequelize')

const force = false

class ProductController {

  constructor() {
    // this.init()
  }

  init = async () => {
    await db.authenticate()
    await Product.sync({ force })
    if (force) {
      await this.createMockProducts()
    }
  }
  createProduct = async (req, res) => {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  }

  createManyProducts = async (req, res) => {
    const products = req.body
    const newProducts = await Product.bulkCreate(products)
    res.json(newProducts)
  }

  getProducts = async (req, res) => {
    const { search } = req.query
    if (search) {
      const products = await Product.findAll({
        where: {
          [Op.or]: {
            title: { [Op.iLike]: `%${search}%` },
            description: { [Op.iLike]: `%${search}%` },
          },
        }
      })
      return res.json(products)
    }
    const products = await Product.findAll()
    res.json(products)
  }

  getProductById = async (req, res) => {
    const id = req.params.id
    const product = await Product.findOne({ where: { id } })
    res.json(product)
  }

  updateProduct = async (req, res) => {
    const id = req.params.id
    const product = await Product.update(req.body, { where: { id } })
      .then(() => Product.findOne({ where: { id } }))
    res.json(product)
  }

  deleteProduct = async (req, res) => {
    const id = req.params.id
    await Product.destroy({ where: { id } })
      .then(() => res.json({ status: 'Product deleted' }))
  }

  getProductsByCategory = async (req, res) => {
    const category = req.query.category
    const products = await Product.findAll({ where: { category } })
    res.json(products)
  }

  createMockProducts = async () => {
    return await Product.bulkCreate(productsMock)
  }
}

module.exports = new ProductController()

