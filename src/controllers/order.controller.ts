import stripeController from './stripe.controller';
import { NextFunction } from 'express';
import { CartItemModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
import cartController from './cart.controller';
import { OrderItemsModel, OrdersModel } from '../models/orders.model';

enum PaymentMethod {
  default = 'default',
  new = 'new'
}

const force = false

class OrderController {

  constructor() {
    // this.init()
  }

  init = async () => {
    await OrdersModel.sync({ force })
    await OrderItemsModel.sync({ force })
  }

  initOrder = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id: userId } = req.user
      const { paymentMethod } = req.body

      const customer = await stripeController.getCustomerLocale(req)
      req.body.customerId = customer.id

      console.log('initOrder:', req.body)
      if (paymentMethod === PaymentMethod.default) {
        if (!customer.metadata.default_source) res.status(400).json({ message: 'No default card' })
        req.body.paymentMethodId = customer.metadata.default_source
      }

      const paymentIntent = await stripeController.createPaymentIntent(req)
      req.body.paymentIntentId = paymentIntent.id

      const paymentResult = await stripeController.confirmPaymentIntent(req, res)

      if (paymentResult.status === 'succeeded') {
        req.body.status = 'paid'
        const order = await this.createOrder(req, res, next)
        await cartController.clearCart(req, res)

        res.json({
          order: order,
          status: true,
          message: 'Create order'
        })
      } else {
        res.status(400).json({ status: false, message: 'Payment error' })
      }

    } catch
      (error) {
      res.status(400).json({ message: 'Create order error ' + error })
    }
  }

  createOrder = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id: userId } = req.user

      const order = await OrdersModel.create({
        userId,
        paymentIntentId: req.body.paymentIntentId,
        paymentMethodId: req.body.paymentMethodId,
        status: req.body.status,
        total: req.body.amount / 100,
      })

      if (!order.id) res.status(400).json({ message: 'Create order error' })

      const cartId = await cartController.getCartId(req)
      if (!cartId) res.status(400).json({ message: 'Get cart id error' })

      const cartItems = await CartItemModel.findAll({
        where: { cartId },
        include: {
          model: ProductModel,
          attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
        },
        attributes: { exclude: ['id', 'cartId', 'productId', 'createdAt', 'updatedAt'] }
      })
      if (!cartItems) res.status(400).json({ message: 'Get cart items error' })

      const products = cartItems.map((item: any) => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))
      const orderItems = await OrderItemsModel.bulkCreate(products)
      if (!orderItems) res.status(400).json({ message: 'Create order items error' })

      return order
    } catch
      (error) {
      res.status(400).json({ message: 'Create order error ' + error })
    }
  }

  getOrders = async (req: any, res: any) => {
    try {
      const { id: userId } = req.user

      const orders = await OrdersModel.findAll({ where: { userId } })

      res.json(orders)
    } catch (error) {
      res.status(400).json({ message: 'Get orders error ' + error })
    }
  }

  getOrderByID = async (req: any, res: any) => {
    try {
      const { id: orderId } = req.params

      const order = await OrdersModel.findOne({
        where:
          { id: orderId },
        attributes: {
          exclude: ['userId', 'paymentIntentId', 'paymentMethodId', 'updatedAt']
        }
      })

      res.json(order)
    } catch
      (error) {
      res.status(400).json({ message: 'Get order by id error ' + error })
    }
  }

  getOrderItemsByOrderId = async (req: any, res: any) => {
    try {
      const { id: orderId } = req.params

      const orderItems = await OrderItemsModel.findAll({
        where: { orderId },
        include: {
          model: ProductModel,
          attributes: { exclude: ['categoryId', 'price', 'createdAt', 'updatedAt'] }
        },
        attributes: { exclude: ['orderId', 'productId', 'createdAt', 'updatedAt'] }
      })
      res.json(orderItems)
    } catch (error) {
      res.status(400).json({ message: 'Get order items by order id error ' + error })
    }
  }
}

export default new OrderController()
