import { object } from 'zod'
import { validateUser } from '../schemes/user-scheme.mjs'

export class UserController {
  constructor ({ userModel, emailService }) {
    this.userModel = userModel
    this.emailService = emailService
  }

  create = async (req, res) => {
    try {
      const result = validateUser(req.body)
      console.log(req.body)
      console.log('------------')
      console.log(result.data)

      if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message), postMessage: req.body })
      }
      const isUserExist = await this.userModel.check({ input: result.data })

      if (isUserExist) {
        return res.status(400).json({ message: 'Some of the data entered is already registered' })
      }

      const newUser = await this.userModel.create({ input: result.data })
      console.log(newUser)
      if (Object.keys(newUser).length === 4) {
        const verifyEmail = this.emailService.verify({ input: newUser })
        res.status(201).json({ message: 'User successfully created, you only need to check your email address' })
      } else {
        res.status(500).json({ message: 'User could not be created' })
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).json({ message: 'Error internal server' })
    }
  }
}
