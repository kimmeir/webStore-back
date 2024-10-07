const db = require('../db')
const CartItem = require('../models/cartItem.model')
const ProductModel = require('../models/product.model')

const force = false

class CartController {
  constructor() {
    this.init()
  }

  async init() {
    await db.authenticate()
    await CartItem.sync({ force })
  }

  getCart = async (req, res) => {
    try {
      const { id: cartId } = req.user
      const cart = await CartItem.findAll({
        where: { cartId },
        attributes: { exclude: [ 'cartId', 'productId', 'createdAt', 'updatedAt' ] },
        include: {
          model: ProductModel,
          attributes: { exclude: [ 'categoryId', 'createdAt', 'updatedAt' ] }
        },
      })

      res.json(cart)
    } catch (error) {
      res.status(400).json({ message: 'Get cart error ' + error })
    }
  }

  addItemToCart = async (req, res) => {
    try {
      const { id: cartId } = req.user
      const { productId, quantity } = req.body
      const cartItem = await CartItem.findOne({ where: { cartId, productId } })

      if (Boolean(cartItem)) {
        await CartItem.update({ quantity: cartItem.quantity + quantity ?? 1 }, { where: { cartId, productId } })
      } else
        await CartItem.create({ cartId, productId, quantity })

      res.status(201).json({ message: 'Item added to cart' })
    } catch (error) {
      res.status(400).json({ message: 'Add item to cart error ' + error })
    }
  }

  deleteCartItem = async (req, res) => {
    const id = req.query.id
    await CartItem.destroy({ where: { id } })
      .then(() => res.json({ status: 'Cart item deleted' }))
  }
}

module.exports = new CartController()
