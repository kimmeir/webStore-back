const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  database: 'webstore',
  username: 'postgres',
  password: 'root',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  dialect: 'postgres',
})

module.exports = sequelize

