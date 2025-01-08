import { db } from '../db'
import { AddressModel, RolesModel, UsersModel } from '../models/user.model'
import { ProductModel } from '../models/product.model'
import { CartItemModel, CartModel } from '../models/cart.model'
import { CategoryModel } from '../models/category.model'
import usersController from './users.controller'
import productsController from './product.controller'
import categoriesController from './categories.controller'
import { WishesModel } from '../models/wishes.model';
import { OrderItemsModel, OrdersModel } from '../models/orders.model';

export const db_init = async (force = false) => {
  try {
    await createTables(force)
    await createMocks()
  } catch (error) {
    console.error('Unable to create database tables:', error)

    await createTables(true)
    await createMocks()
  }
}

const createTables = async (force = false) => {
  await db.authenticate()
  await RolesModel.sync({ force })
  await AddressModel.sync({ force })
  await UsersModel.sync({ force })

  await CategoryModel.sync({ force })
  await ProductModel.sync({ force })

  await CartModel.sync({ force })
  await CartItemModel.sync({ force })

  await OrdersModel.sync({ force })
  await OrderItemsModel.sync({ force })

  await WishesModel.sync({ force })
}

const createMocks = async () => {
  const users = await UsersModel.findAll()
  if (!users.length) {
    await usersController.createMockUsers()
    console.log('Initial Users created!')
  }

  const categories = await CategoryModel.findAll()
  if (!categories.length) {
    await categoriesController.createMockCategories()
    console.log('Initial Categories created!')
  }

  const products = await ProductModel.findAll()
  if (!products.length) {
    await productsController.createMockProducts()
    console.log('Initial Products created!')
  }
}
