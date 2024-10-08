const express = require('express')
const cors = require('cors')
const db_init = require('./controllers/DB_init')
require('dotenv').config()

const reInitDB = process.env.RE_INIT_DB === 'true'
const app = express()
const PORT = process.env.PORT || 3400
const routes = [
  require('./routes/users.routes'),
  require('./routes/product.routes'),
  require('./routes/categories.routes'),
  require('./routes/cart.routes'),
]

if (reInitDB) {
  console.log('Reinitializing database...')
  db_init()
}
app.use(cors())
app.use(express.json())

app.use('/api', routes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
