const { CODE } = require('../config')
const { verify } = require('jsonwebtoken')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'User token error' })
    }

    const decoded = verify(token, CODE)
    req.user = decoded

    next()
  } catch (e) {
    res.status(401).json({ message: 'User is not authorized' })
  }
}
