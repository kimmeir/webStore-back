const db = require('../db')
const UserModel = require('../models/user.model')
const ProductModel = require('../models/product.model')
const CartItemModel = require('../models/cartItem.model')
const CategoryModel = require('../models/category.model')
const RoleModel = require('../models/roles.model')
const usersController = require('./users.controller')
const productsController = require('./product.controller')
const categoriesController = require('./categories.controller')

const force = true
const db_init = async () => {
  try {
    await db.authenticate()

    await UserModel.sync({ force })
    await RoleModel.sync({ force })
    await ProductModel.sync({ force })
    await CategoryModel.sync({ force })
    await CartItemModel.sync({ force })

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

module.exports = db_init
