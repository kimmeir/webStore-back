import { db } from '../db';
import { DataTypes } from 'sequelize';
import { ProductModel } from './product.model';
import { AddressModel } from './user.model';

export const OrdersModel = db.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethodId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  billAddressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AddressModel,
      key: 'id',
    },
  },
  shipAddressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AddressModel,
      key: 'id',
    },
  },
  orderNotes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

export const OrderItemsModel = db.define('order_item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OrdersModel,
      key: 'id',
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductModel,
      key: 'id',
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
})

OrderItemsModel.belongsTo(OrdersModel, { foreignKey: 'orderId' })
OrderItemsModel.belongsTo(ProductModel, { foreignKey: 'productId' })
OrdersModel.belongsTo(AddressModel, { as: 'billAddress', foreignKey: 'billAddressId' })
OrdersModel.belongsTo(AddressModel, { as: 'shipAddress', foreignKey: 'shipAddressId' })
