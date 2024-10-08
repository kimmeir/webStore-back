const { Sequelize } = require('sequelize')
const env = require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, ENV } = process.env
console.log('DB_NAME: ' + DB_NAME)
console.log('DB_USER: ' + DB_USER)
console.log('DB_PASSWORD: ' + DB_PASSWORD)
console.log('DB_HOST: ' + DB_HOST)
console.log('DB_PORT: ' + DB_PORT)
console.log('ENV: ' + ENV)

try {
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
} catch (error) {
  console.log('Error: ' + error)
}




