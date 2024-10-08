const { Sequelize } = require('sequelize')
const env = require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
})

module.exports = sequelize



