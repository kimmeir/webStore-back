const { Sequelize } = require('sequelize')

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

const sequelize = new Sequelize({
  database: DB_NAME || 'webstore',
  username: DB_USER || 'postgres',
  password: DB_PASSWORD || 'root',
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  dialect: 'postgres',
})

module.exports = sequelize

