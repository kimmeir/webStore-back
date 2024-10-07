const db = require('../db')
const Users = require('../models/user.model')
const Roles = require('../models/roles.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { CODE } = require('../config')
const usersMock = require('../mocks/users.mock')
const rolesMock = require('../mocks/roles.mock')

const force = false

const generateJwt = (id, email) => {
  return jwt.sign({ id, email, cartId }, CODE, { expiresIn: '24h' })
}

class UsersController {
  constructor() {
    this.init()
  }

  init = async () => {
    try {
      await db.authenticate()
      await Users.sync({ force })
      await Roles.sync({ force })
      if (force) {
        await this.createMockUsers()
      }
    } catch (error) {
      console.log('Error: ' + error)
    }
  }
  createUser = async (req, res) => {
    try {
      const newUser = await Users.create(req.body)
      return res.json(newUser)
    } catch (error) {
      return res.status(400).json({ message: 'Create user error ' + error })
    }
  }

  getUsers = async (req, res) => {
    try {
      const users = await Users.findAll()
      res.json(users)
    } catch (error) {
      res.status(400).json({ message: 'Get users error ' + error })
    }
  }

  getUserById = async (req, res, userId = null) => {
    try {
      const id = userId ?? req.params.id
      const user = await Users.findOne({
        where: { id },
        attributes: { exclude: [ 'password', 'roleId' ] },
        include: {
          model: Roles,
          attributes: [ 'value' ],
        },
      })
        .then(user => {
          user.setDataValue('role', user.role.value)
          return user
        })

      res.json(user)
    } catch (error) {
      res.status(400).json({ message: 'Get user by id error ' + error })
    }

  }

  updateUser = async (req, res) => {
    try {
      const id = req.params.id
      const user = await Users.update(req.body, { where: { id } })
        .then(() => Users.findOne({ where: { id } }))
      res.json(user)
    } catch (error) {
      res.status(400).json({ message: 'Update user error ' + error })
    }
  }

  deleteUser = async (req, res) => {
    try {
      const id = req.params.id
      await Users.destroy({ where: { id } })
        .then(() => res.json({ status: 'User deleted' }))
    } catch (error) {
      res.status(400).json({ message: 'Delete user error ' + error })
    }
  }

  registration = async (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty())
        return res.status(400).json({ message: 'Registration validation error', errors: result.array() })

      const { email, first_name, password } = req.body
      const candidate = await Users.findOne({ where: { email } })
      if (candidate)
        return res.status(400).json({ message: 'User already exists' })

      const hashPassword = bcrypt.hashSync(password, 7)
      const user = await Users.create({ email, first_name, password: hashPassword })

      res.status(201).json({ message: 'User created' })
    } catch (error) {
      res.status(400).json({ message: 'Registration error ' + error })
    }
  }

  login = async (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty())
        return res.status(400).json({ message: 'Login validation error' })

      const { email, password } = req.body
      const user = await Users.findOne({ where: { email } })
      if (!user)
        return res.status(400).json({ message: 'User not found' })

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword)
        return res.status(400).json({ message: 'Invalid password' })

      const token = generateJwt(user.id, user.email)

      return res.json({ access_token: token })
    } catch (error) {
      res.status(400).json({ message: 'Login error ' + error })
    }
  }

  getProfile = async (req, res) => {
    try {
      const { id } = req.user
      await this.getUserById(req, res, id)
    } catch (error) {
      res.status(400).json({ message: 'Profile error ' + error })
    }
  }

  createMockUsers = async () => {
    try {
      await Users.bulkCreate(usersMock)
      await Roles.bulkCreate(rolesMock)
    } catch (error) {
      console.log('Create mock users error: ' + error)
    }
  }
}

module.exports = new UsersController()
