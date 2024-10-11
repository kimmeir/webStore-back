require('dotenv').config()
const { Sequelize } = require('sequelize')

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, ENV } = process.env
// console.log('DB_NAME', DB_NAME)
// console.log('DB_USER', DB_USER)
// console.log('DB_PASSWORD', DB_PASSWORD)
// console.log('ENV', ENV)
// const sequelize = new Sequelize({
//   database: DB_NAME,
//   username: DB_USER,
//   password: DB_PASSWORD,
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: 'postgres',
//   ...( ENV === 'production'
//       ? {
//         dialectOptions: {
//           ssl: {
//             require: true,
//             rejectUnauthorized: false
//           }
//         }
//       }
//       : {}
//   )
// })

const sequelize = new Sequelize({
  database: 'webstore',
  username: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
})
module.exports = sequelize




