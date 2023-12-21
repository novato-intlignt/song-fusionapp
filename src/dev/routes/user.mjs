import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel })

  userRouter.post('/', userController.create)

  return userRouter
}
