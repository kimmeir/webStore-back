import { DataTypes } from 'sequelize'
import { db } from '../db'
import { CategoryModel } from './category.model'

export const ProductModel = db.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: CategoryModel,
      key: 'id',
    },
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
})

ProductModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' })
