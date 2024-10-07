const db = require('../db')
const { DataTypes } = require('sequelize')
const ProductModel = require('./product.model')
const UsersModel = require('./user.model')

const CartItemModel = db.define('cartItems', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UsersModel,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductModel,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  }
})

CartItemModel.belongsTo(UsersModel, { foreignKey: 'cartId' })
CartItemModel.belongsTo(ProductModel, { foreignKey: 'productId' })

module.exports = CartItemModel
