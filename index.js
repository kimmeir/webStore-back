const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3400

const routes = [
  require('./routes/users.routes'),
  require('./routes/product.routes'),
  require('./routes/categories.routes'),
  require('./routes/cart.routes'),
]


app.use(cors())
app.use(express.json())

app.use('/api', routes)

 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
