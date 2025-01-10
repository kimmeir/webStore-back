import stripeController from './stripe.controller';
import type { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import cartController from './cart.controller';
import { OrderItemsModel, OrdersModel } from '../models/orders.model';
import addressController from './address.controller';
import { CartItemModel } from '../models/cart.model';
import { AddressModel } from '../models/user.model';

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

  initOrder = async (req: Request, res: Response): Promise<any> => {
    try {
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
        const order = await this.createOrder(req, res)

        if (!order) {
          res.status(400).json({ message: 'Create order error' })
          return false;
        }

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

  createOrder = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id: userId } = req.user

      if (req.body?.billAddress) {
        const billAddress = await addressController.createAddress({ type: 'bill', ...req.body.billAddress })
        req.body.billAddressId = billAddress.id
      }

      if (req.body?.shipAddress) {
        const shipAddress = await addressController.createAddress({ type: 'ship', ...req.body.billAddress })
        req.body.shipAddressId = shipAddress.id
      }

      const cartId = await cartController.getCartId(req)
      if (!cartId) {
        res.status(400).json({ message: 'Get cart id error' })
        return false;
      }

      const cartItems = await CartItemModel.findAll({
        where: { cartId },
        include: {
          model: ProductModel,
          attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
        },
        attributes: { exclude: ['id', 'cartId', 'productId', 'createdAt', 'updatedAt'] }
      })

      if (!cartItems) {
        res.status(400).json({ message: 'Get cart items error' })
        return false;
      }

      const order = await OrdersModel.create({
        userId,
        paymentIntentId: req.body.paymentIntentId,
        paymentMethodId: req.body.paymentMethodId,
        status: req.body.status,
        total: req.body.amount / 100,
        billAddressId: req.body?.billAddressId ?? null,
        shipAddressId: req.body?.shipAddressId ?? null,
      })

      if (!order.id) {
        res.status(400).json({ message: 'Create order error' })
        return false;
      }

      const products = cartItems.map((item: any) => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))
      const orderItems = await OrderItemsModel.bulkCreate(products)
      if (!orderItems) {
        res.status(400).json({ message: 'Create order items error' })
        return false;
      }

      return order
    } catch
      (error) {
      return res.status(400).json({ message: 'Create order error ' + error })
    }
  }

  getOrders = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id: userId } = req.user

      const orders = await OrdersModel.findAll({ where: { userId } })

      res.json(orders)
    } catch (error) {
      res.status(400).json({ message: 'Get orders error ' + error })
    }
  }

  getOrderByID = async (req: Request, res: Response) => {
    try {
      const { id: orderId } = req.params

      const order = await OrdersModel.findOne({
        where:
          { id: orderId },
        attributes: {
          exclude: ['userId', 'paymentIntentId', 'paymentMethodId', 'billAddressId', 'shipAddressId', 'updatedAt']
        },
        include: [
          { model: AddressModel, as: 'billAddress' },
          { model: AddressModel, as: 'shipAddress' }
        ]
      })

      res.json(order)
    } catch
      (error) {
      res.status(400).json({ message: 'Get order by id error ' + error })
    }
  }

  getOrderItemsByOrderId = async (req: Request, res: Response) => {
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
