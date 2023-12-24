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
        const verifyToken = jwt.sign({ name: user, mail: email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
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

  static async verify ({ input }) {
    const decoder = jwt.verify(input, process.env.JWT_SECRET)
    console.log(decoder)
    if (!decoder || !decoder.name || !decoder.mail) {
      return true
    }
    const { name, mail } = decoder
    const [isVerified] = await connection.execute('SELECT name FROM users WHERE name = ? AND email = ? AND is_verified = 1', [name, mail])
    if (isVerified.length === 1) {
      return 1
    }
    const verifingUser = await connection.execute('UPDATE users SEt is_verified = 1 WHERE name = ? AND email = ?', [name, mail])

    console.log(verifingUser)
    if (verifingUser[0].affectedRows === 1) {
      console.log(verifingUser.affectedRows)
      return name
    }
  }
}
