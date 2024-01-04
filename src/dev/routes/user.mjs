import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'

export const createUserRouter = ({ userModel, emailService }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel, emailService })

  userRouter.post('/signup', userController.create)
  userRouter.post('/signin', userController.auth)
  userRouter.get('/:token', userController.verify)
  userRouter.get('/:name/dashboard', auth.onlyUser, userController.access)
  return userRouter
}
