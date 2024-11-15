import { db } from '../db'
import { ProductModel } from './product.model'
import { DataTypes } from 'sequelize';
import { UsersModel } from './user.model';

export const CartModel = db.define('carts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UsersModel,
      key: 'id',
    },
  }
})

export const CartItemModel = db.define('cart_items', {
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
      model: CartModel,
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

CartModel.belongsTo(UsersModel, { foreignKey: 'userId' })
CartItemModel.belongsTo(CartModel, { foreignKey: 'cartId' })
CartItemModel.belongsTo(ProductModel, { foreignKey: 'productId' })


