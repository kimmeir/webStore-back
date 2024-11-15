import { NextFunction } from 'express';
import { config } from '../config';
import { verify } from 'jsonwebtoken';

const jwtMiddleware = (req: any, res: any, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'User token error' })
    }

    const decoded = verify(token, config.CODE)
    req.user = decoded

    next()
  } catch (e) {
    res.status(401).json({ message: 'User is not authorized' })
  }
}

export default jwtMiddleware
