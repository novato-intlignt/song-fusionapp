import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'

export const createUserRouter = ({ userModel, emailService }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel, emailService })

  userRouter.post('/signup', userController.create)
  userRouter.post('/signin', userController.auth)
  userRouter.get('/:token', userController.verify)
  return userRouter
}
