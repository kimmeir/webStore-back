const dotenv = require('dotenv')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const users = require('../models/user.model')

class StripeController {
  createPaymentIntent = async (req, res, next) => {
    try {
      const { id } = req.user

      const customer = await this.getCustomer(req, res, next, true)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: req.body.currency,
        customer: customer.id,
        payment_method: customer.metadata.default_source,
      })
      res.status(200).json(paymentIntent)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  createCustomer = async (req, res) => {
    try {
      const { id } = req.user
      const user = await users.findOne({ where: { id } })

      req.body = {
        ...req.body,
        name: `${user.first_name} ${user.last_name || ''}`.trim(),
        email: user.email
      }

      const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
      })
      await users.update({ stripeId: customer.id }, { where: { id } })
      return customer
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  createPaymentMethod = async (req, res) => {
    try {
      let { stripeId, paymentMethodId } = req.body
      if (!stripeId) {
        const customer = await this.createCustomer(req, res)
        stripeId = customer.id
      }

      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: stripeId }
      )
      console.log(paymentMethod)

      res.status(200).json(paymentMethod)
    } catch
      (error) {
      res.status(500).json({ error: error.message })
    }
  }

  getCustomerPaymentMethods = async (req, res) => {
    try {
      const { stripeId } = req.query
      const cards = await stripe.customers.listPaymentMethods(stripeId)

      res.status(200).json(cards.data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  setCardAsDefault = async (req, res) => {
    try {
      const { id } = req.user
      const { paymentMethodId } = req.body
      const { stripeId } = await users.findOne({ where: { id } })

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

  getCustomer = async (req, res, next, locale = false) => {
    try {
      const { id } = req.user
      const user = await users.findOne({ where: { id } })
      const customer = await stripe.customers.retrieve(user.stripeId)

      if (!locale)
        res.status(200).json(customer)
      else
        return customer
    } catch (error) {
      res.status(400).json({ message: 'Get customer error ' + error })
    }
  }
}

module
  .exports = new StripeController()
