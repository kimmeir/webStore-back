import { db } from '../db'
import { UsersModel } from '../models/user.model'
import { ProductModel } from '../models/product.model'
import { CartItemModel, CartModel } from '../models/cart.model'
import { CategoryModel } from '../models/category.model'
import { RolesModel } from '../models/roles.model'
import usersController from './users.controller'
import productsController from './product.controller'
import categoriesController from './categories.controller'
import { WishesModel } from '../models/wishes.model';

const force = true

export const db_init = async () => {
  try {
    await db.authenticate()

    await UsersModel.sync({ force })
    await RolesModel.sync({ force })
    await ProductModel.sync({ force })
    await CategoryModel.sync({ force })
    await CartModel.sync({ force })
    await CartItemModel.sync({ force })
    await WishesModel.sync({ force })

    await usersController.createMockUsers()
    await categoriesController.createMockCategories()
    await productsController.createMockProducts()

    console.log('Initial data created!')

  } catch (error) {
    console.error('Unable to create database tables:', error)
  } finally {
    await db.close()
  }
}
