import { DataTypes } from 'sequelize'
import { db } from '../db'

export const RolesModel = db.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER',
  }
})
