import { db } from '../db';
import { WishesModel } from '../models/wishes.model';
import { ProductModel } from '../models/product.model';

const force = false

class WishesController {
  constructor() {
    this.init()
  }

  init = async () => {
    await db.authenticate()
    await WishesModel.sync({ force })
  }

  getWishesItems = async (req: any, res: any) => {
    try {
      const { id: userId } = req.user

      const wishesItems = await WishesModel.findAll({
        where: { userId },
        include: {
          model: ProductModel,
          attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
        },
        attributes: { exclude: ['userId', 'productId', 'createdAt', 'updatedAt'] }
      })

      res.json(wishesItems)

    } catch (error) {
      res.status(400).json({ message: 'Get wishes error ' + error })
    }
  }

  addItemToWishes = async (req: any, res: any) => {
    try {
      const { id: userId } = req.user
      const { productId } = req.body

      console.log('productId', productId)
      const wishesItem = await WishesModel.findOne({ where: { userId, productId } })
      if (!wishesItem)
        await WishesModel.create({ userId, productId })

      await this.getWishesItems(req, res)
    } catch (error) {
      res.status(400).json({ message: 'Add wishes item error ' + error })
    }
  }

  removeWishesItem = async (req: any, res: any) => {
    try {
      const { id: userId } = req.user
      const { productId } = req.query

      const wishesItem = await WishesModel.findOne({ where: { userId, productId } })

      if (!wishesItem) {
        return res.status(400).json({ message: 'Wishes item not found' })
      }

      await wishesItem.destroy()

      await this.getWishesItems(req, res)
    } catch (error) {
      res.status(400).json({ message: 'Remove wishes item error ' + error })
    }
  }
}

export default new WishesController();
