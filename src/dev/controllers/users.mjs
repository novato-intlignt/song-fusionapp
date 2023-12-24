import { validateUser } from '../schemes/user-scheme.mjs'
import dotenv from 'dotenv'
dotenv.config()

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
      if (isUserExist === true) {
        return res.status(400).json({ message: 'Some of the data entered is already registered' })
      }

      if (Object.keys(isUserExist).length === 4) {
        const verifyEmail = await this.emailService.send({ input: isUserExist })

        if (verifyEmail === 0) {
          return res.status(400).json({ message: 'There is some problem, sending the email verification' })
        }
        if (Object.keys(verifyEmail).length === 1) {
          const newData = { ...result.data, ...verifyEmail }
          const newUser = await this.userModel.create({ input: newData })
          if (newUser) {
            res.status(201).json({ message: 'User successfully created, you only need to check your email address to verify your account' })
          } else {
            res.status(500).json({ message: 'User could not be created' })
          }
        }
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).json({ message: 'Error internal server' })
    }
  }

  verify = async (req, res) => {
    try {
      if (!req.params.token) {
        return res.redirect('/')
      }
      const isVerify = await this.userModel.verify({ input: req.params.token })
      if (isVerify === true) {
        return res.status(400).json({ status: 'Error', message: 'There is some problem with the token' }).redirect('/')
      }
      if (isVerify === 1) {
        return res.status(301).json({ status: 'Error', message: "You've been verified before" })
      }
      console.log(isVerify)
      return res.redirect(`/index.html/user=${isVerify}`)
    } catch (err) {
      res.status(500)
      console.log(err)
      console.log("no tamo' ready")
      res.redirect('/')
    }
  }
}
