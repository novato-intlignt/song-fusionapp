import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'

export const createUserRouter = ({ userModel, emailService }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel, emailService })
  userRouter.post('/', userController.create)

  return userRouter
}
