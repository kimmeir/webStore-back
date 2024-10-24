const db = require('../db')
const { DataTypes } = require('sequelize')
const RoleModel = require('./roles.model')

const Users = db.define('users', {
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
      model: RoleModel,
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

Users.belongsTo(RoleModel, { foreignKey: 'roleId' })

module.exports = Users
