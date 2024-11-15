import { db } from '../db'
import { Op } from 'sequelize'
import { ProductModel } from '../models/product.model';
import productsMock from '../mocks/products.mock';

const force = false

class ProductController {

  constructor() {
    // this.init()
  }

  init = async () => {
    await db.authenticate()
    await ProductModel.sync({ force })
    if (force) {
      await this.createMockProducts()
    }
  }
  createProduct = async (req: any, res: any) => {
    const newProduct = await ProductModel.create(req.body)
    res.json(newProduct)
  }

  createManyProducts = async (req: any, res: any) => {
    const products = req.body
    const newProducts = await ProductModel.bulkCreate(products)
    res.json(newProducts)
  }

  getProducts = async (req: any, res: any) => {
    const { search } = req.query
    if (search) {
      const products = await ProductModel.findAll({
        where: {
          [Op.or]: {
            title: { [Op.iLike]: `%${search}%` },
            description: { [Op.iLike]: `%${search}%` },
          },
        }
      })
      return res.json(products)
    }
    const products = await ProductModel.findAll()
    res.json(products)
  }

  getProductById = async (req: any, res: any) => {
    const id = req.params.id
    const product = await ProductModel.findOne({ where: { id } })
    res.json(product)
  }

  updateProduct = async (req: any, res: any) => {
    const id = req.params.id
    const product = await ProductModel.update(req.body, { where: { id } })
      .then(() => ProductModel.findOne({ where: { id } }))
    res.json(product)
  }

  deleteProduct = async (req: any, res: any) => {
    const id = req.params.id
    await ProductModel.destroy({ where: { id } })
      .then(() => res.json({ status: 'Product deleted' }))
  }

  getProductsByCategory = async (req: any, res: any) => {
    const category = req.query.category
    const products = await ProductModel.findAll({ where: { category } })
    res.json(products)
  }

  createMockProducts = async () => {
    return await ProductModel.bulkCreate(productsMock)
  }
}

export default new ProductController()

