import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';
import { type NextFunction } from 'express';
import { db } from '../db'
import { config } from '../config';
import { UsersModel } from '../models/user.model'
import { RolesModel } from '../models/roles.model'
import usersMock from '../mocks/users.mock';
import rolesMock from '../mocks/roles.mock';

const bcrypt = require('bcryptjs')
const force = false

const generateJwt = (id: string, email: string) => {
  return jwt.sign({ id, email }, config.CODE, { expiresIn: '24h' })
}

class UsersController {
  constructor() {
    // this.init()
  }

  init = async () => {
    try {
      await db.authenticate()
      await UsersModel.sync({ force })
      await RolesModel.sync({ force })
      if (force) {
        await this.createMockUsers()
      }
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  getUsers = async (req: any, res: any) => {
    try {
      const users = await UsersModel.findAll({
        attributes: { exclude: ['password', 'roleId'] },
        include: {
          model: RolesModel,
          attributes: ['value'],
        },
      })
      return res.json(users)
    } catch (error) {
      res.status(400).json({ message: 'Get users error ' + error })
    }
  }

  getUserById = async (req: any, res: any, next: NextFunction, userId = null) => {
    try {
      const id = userId ?? req.params.id
      const user: any = await UsersModel.findOne({
        where: { id },
        attributes: { exclude: ['password', 'roleId'] },
        include: {
          model: RolesModel,
          attributes: ['value'],
        },
      })
        .then((user: any) => {
          user.setDataValue('role', user.role.value)
          return user
        })

      return res.json(user)
    } catch (error) {
      res.status(400).json({ message: 'Get user by id error ' + error })
    }

  }

  updateUser = async (req: any, res: any) => {
    try {
      const id = req.params.id
      const user = await UsersModel.update(req.body, { where: { id } })
        .then(() => UsersModel.findOne({ where: { id } }))
      return res.json(user)
    } catch (error) {
      res.status(400).json({ message: 'Update user error ' + error })
    }
  }

  deleteUser = async (req: any, res: any) => {
    try {
      const id = req.params.id
      await UsersModel.destroy({ where: { id } })
        .then(() => res.json({ status: 'User deleted' }))
    } catch (error) {
      res.status(400).json({ message: 'Delete user error ' + error })
    }
  }

  registration = async (req: any, res: any) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty())
        return res.status(400).json({ message: 'Registration validation error', errors: result.array() })

      const { email, first_name, password } = req.body
      const candidate = await UsersModel.findOne({ where: { email } })
      if (candidate)
        return res.status(400).json({ message: 'User already exists' })

      const hashPassword = bcrypt.hashSync(password, 7)
      await UsersModel.create({ email, first_name, password: hashPassword })

      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      res.status(400).json({ message: 'Registration error ' + error })
    }
  }

  login = async (req: any, res: any) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty())
        return res.status(400).json({ message: 'Login validation error' })

      const { email, password } = req.body
      const user = await UsersModel.findOne({ where: { email } })
      if (!user)
        return res.status(400).json({ message: 'User not found' })

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword)
        return res.status(400).json({ message: 'Invalid password' })

      const token = await generateJwt(user.id, user.email)
      return res.json({ access_token: token })
    } catch (error) {
      res.status(400).json({ message: 'Login error ' + error })
    }
  }

  getProfile = async (req: any, res: any, next: NextFunction) => {
    try {
      const { id } = req.user
      await this.getUserById(req, res, next, id)
    } catch (error) {
      res.status(400).json({ message: 'Profile error ' + error })
    }
  }

  createMockUsers = async () => {
    try {
      await RolesModel.bulkCreate(rolesMock)
      await UsersModel.bulkCreate(usersMock)
    } catch (error) {
      console.log('Create mock users error: ' + error)
    }
  }
}

export default new UsersController()
