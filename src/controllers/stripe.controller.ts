import type { Request, Response } from 'express';
import { type NextFunction } from 'express';
import { UsersModel } from '../models/user.model';

require('dotenv')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class StripeController {
  createPaymentIntent = async (req: Request) => {
    try {
      return await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: req.body.currency,
        customer: req.body.customerId,
        payment_method: req.body.paymentMethodId,
      })
    } catch (error: any) {
      console.log('Create payment intent error:', error)
    }
  }

  confirmPaymentIntent = (req: Request, res: Response) => {
    try {
      return stripe.paymentIntents.confirm(req.body.paymentIntentId, {
        return_url: 'http://localhost:3400/api/stripe-success',
      });
    } catch (error: any) {
      console.log('Confirm payment intent error:', error)
    }
  }

  createCustomer = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id } = req.user
      let user = await UsersModel.findOne({ where: { id } })

      req.body = {
        ...req.body,
        name: `${user.first_name} ${user.last_name || ''}`.trim(),
        email: user.email
      }

      const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
      })
      user = await UsersModel.update({ stripeId: customer.id }, { where: { id } })
        .then(() => UsersModel.findOne({ where: { id } }))

      res.status(200).json(user)
      // return customer
    } catch (error: Error | any) {
      res.status(500).json({ error: error.message })
    }
  }

  createPaymentMethod = async (req: Request, res: Response) => {
    try {
      let { stripeId, paymentMethodId } = req.body
      // if (!stripeId) {
      //   const customer = await this.createCustomer(req, res)
      //   stripeId = customer.id
      // }

      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: stripeId }
      )
      res.status(200).json(paymentMethod)
    } catch
      (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  getCustomerPaymentMethods = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id } = req.user
      const { stripeId } = await UsersModel.findOne({ where: { id } })
      const cards = await stripe.customers.listPaymentMethods(stripeId)

      res.status(200).json(cards.data)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  setCardAsDefault = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id } = req.user
      const { paymentMethodId } = req.body
      const { stripeId } = await UsersModel.findOne({ where: { id } })

      const customer = await stripe.customers.update(
        stripeId,
        {
          metadata: { default_source: paymentMethodId }
        }
      )
      res.status(200).json(customer)

    } catch (error) {
      res.status(400).json({ message: 'Set card as default error ' + error })
    }
  }

  getCustomer = async (req: Request, res: Response, next: NextFunction, locale = false) => {
    try {
      // @ts-ignore
      console.log('Get customer:', req.user)
      // @ts-ignore
      const { id } = req.user
      const user = await UsersModel.findOne({ where: { id } })
      const customer = await stripe.customers.retrieve(user.stripeId)

      if (!locale)
        res.status(200).json(customer)
      else
        return customer
    } catch (error) {
      res.status(400).json({ message: 'Get customer error ' + error })
    }
  }

  getCustomerLocale = async (req: Request) => {
    try {
      // @ts-ignore
      const { id } = req.user
      const user = await UsersModel.findOne({ where: { id } })
      return await stripe.customers.retrieve(user.stripeId)
    } catch (error) {
      console.log('Get customer locale error:', error)
    }
  }
}

export default new StripeController()
