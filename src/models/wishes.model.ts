import { db } from '../db';
import { DataTypes } from 'sequelize';
import { ProductModel } from './product.model';
import { UsersModel } from './user.model';

export const WishesModel = db.define('wishes', {
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
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductModel,
      key: 'id',
    },
  },
})

WishesModel.belongsTo(UsersModel, { foreignKey: 'userId' })
WishesModel.belongsTo(ProductModel, { foreignKey: 'productId' })
