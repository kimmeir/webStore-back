const db = require('../db')
const { DataTypes } = require('sequelize')

const RolesModel = db.define('roles', {
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

module.exports = RolesModel
