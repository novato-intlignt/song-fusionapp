import mysql from 'mysql2/promise'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}
const connection = await mysql.createConnection(config)

export class UserModel {
  static async check ({ input }) {
    const {
      urlhost,
      user,
      email,
      phone
    } = input
    try {
      const [existingUser] = await connection.execute('SELECT id_user FROM users WHERE name = ? OR email = ? OR phone = ?', [user, email, phone])
      if (existingUser.length === 0) {
        // Create JWT
        const verifyToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
        const result = { url: urlhost, name: user, mail: email, token: verifyToken }

        return result
      }
      return existingUser.length > 0
    } catch (error) {
      console.log('Error in checking')
      console.log('Error: ', error)
      throw error
    }
  }

  static async create ({ input }) {
    const {
      user,
      email,
      phone,
      pass,
      verifyToken
    } = input
    console.log(input)
    // Create UUID
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

    // Hash the pass
    const salt = await bcryptjs.genSalt(7)
    const hashPass = await bcryptjs.hash(pass, salt)

    try {
      const newUser = await connection.execute(
      `INSERT INTO users (id_user, name, email, phone, password, verification_token)
      VALUES (UNHEX(REPLACE('${uuid}','-', '')), ?, ?, ?, ?, ?);`,
      [user, email, phone, hashPass, verifyToken])

      return newUser[0]
    } catch (error) {
      console.log('Error in create user')
      console.log('Error:', error)
      throw error
    }
  }
}
