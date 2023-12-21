import mysql from 'mysql2/promise'
import bcryptjs from 'bcryptjs'

const confid = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'qwer63528',
  database: 'SongFusion'
}
const connection = await mysql.createConnection(confid)

export class UserModel {
  static async check ({ input }) {
    const { email } = input
    console.log(email)
    try {
      const [existingUser] = await connection.execute('SELECT id_user FROM users WHERE email = ?', [email])
      return existingUser.length > 0
    } catch (error) {
      console.log('Error en checking')
      console.log('Error: ', error)
      throw error
    }
  }

  static async create ({ input }) {
    const {
      user,
      email,
      phone,
      pass
    } = input

    // Create UUID
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

    // Hash the pass
    const salt = await bcryptjs.genSalt(7)
    const hashPass = await bcryptjs.hash(pass, salt)

    try {
      const newUser = await connection.execute(
      `INSERT INTO users (id_user, name, email, phone, password)
      VALUES (UNHEX(REPLACE('${uuid}','-', '')), ?, ?, ?, UNHEX(?))`,
      [user, email, phone, hashPass])

      return newUser
    } catch (error) {
      console.log('Error en creacion de usuario')
      console.log('Error:', error)
      throw error
    } finally {
      connection.end()
    }
  }
}
