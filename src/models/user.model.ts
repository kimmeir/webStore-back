import { db } from '../db'
import { DataTypes } from 'sequelize'
import { RolesModel } from './roles.model'

export const UsersModel = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RolesModel,
      key: 'id',
    },
    defaultValue: 1,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

UsersModel.belongsTo(RolesModel, { foreignKey: 'roleId' })
