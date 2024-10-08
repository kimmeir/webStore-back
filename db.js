require('dotenv').config()
const { Sequelize } = require('sequelize')

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, ENV } = process.env

const sequelize = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  dialect: 'postgres',
  ...( ENV === 'production'
      ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
      : {}
  )
})
module.exports = sequelize




