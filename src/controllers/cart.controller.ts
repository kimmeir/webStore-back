import { db } from '../db'
import { CartItemModel, CartModel, } from '../models/cart.model'
import { ProductModel } from '../models/product.model';

const force = false

class CartController {
  constructor() {
    // this.init()
  }

  init = async () => {
    await db.authenticate()
    await CartModel.sync({ force })
    await CartItemModel.sync({ force })
  }

  createCart = async (req: any) => {
    try {
      const { id: userId } = req.user

      return await CartModel.create({ userId })
    } catch (error) {
      console.log('Create cart error:', error)
    }
  }

  getCartId = async (req: any) => {
    try {
      const { id: userId } = req.user

      const cart = await CartModel.findOne({ where: { userId } }) ?? await this.createCart(req)

      return cart.id
    } catch (error) {
      console.log('Get cart id error:', error)
    }
  }

  getCartItems = async (req: any, res: any) => {
    try {
      const cartId = await this.getCartId(req)

      const cartItems = await CartItemModel.findAll({
        where: { cartId },
        include: {
          model: ProductModel,
          attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
        },
        attributes: { exclude: ['cartId', 'productId', 'createdAt', 'updatedAt'] }
      })

      res.json(cartItems)
    } catch (error) {
      res.status(400).json({ message: 'Get cart error ' + error })
    }
  }

  addItemToCart = async (req: any, res: any) => {
    try {
      const { productId, quantity } = req.body
      const cartId = await this.getCartId(req)

      console.log('Add item to cart:', cartId)

      const cartItem = await CartItemModel.findOne({ where: { cartId, productId } })
      if (Boolean(cartItem)) {
        await CartItemModel.update(
          { quantity: cartItem.quantity + quantity },
          { where: { cartId, productId } }
        )
      } else {
        await CartItemModel.create({ cartId, productId, quantity })
      }

      await this.getCartItems(req, res)
    } catch (error) {
      res.status(400).json({ message: 'Add item to cart error ' + error })
    }
  }

  deleteCartItem = async (req: any, res: any) => {
    try {
      const cartId = await this.getCartId(req)
      const id = req.query.id

      await CartItemModel.destroy({ where: { cartId, id } })
      await this.getCartItems(req, res)
    } catch (error) {
      res.status(400).json({ message: 'Delete cart item error ' + error })
    }
  }

  changeQuantity = async (req: any, res: any) => {
    try {
      console.log('Change quantity:', req.body)
      const { id, quantity } = req.body
      const cartId = await this.getCartId(req)

      await CartItemModel.update(
        { quantity },
        { where: { cartId, id } }
      )

      await this.getCartItems(req, res)

    } catch (error) {
      res.status(400).json({ message: 'Change quantity error ' + error })
    }
  }

  bulkAddToCart = async (req: any, res: any) => {
    try {
      const { id: cartId } = req.user
      const items = req.body.map((item: any) => ({
        cartId,
        productId: item.productId,
        quantity: item.quantity
      }))

      await CartModel.bulkCreate(items, {
        updateOnDuplicate: ['quantity'],
      })
        .then(() => this.getCartItems(req, res))
        .catch((error: Error) => console.log('bulk error:', error))

    } catch (error) {
      res.status(400).json({ message: 'Add items to cart error ' + error })
    }
  }

  clearCart = async (req: any, res: any) => {
    try {
      const cartId = await this.getCartId(req)

      await CartItemModel.destroy({ where: { cartId } })
    } catch (error) {
      res.status(400).json({ message: 'Clear cart error ' + error })
    }
  }
}

export default new CartController()
