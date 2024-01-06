import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

function onlyUser (req, res, next) {
  const cookieJwt = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('user=')).slice(5)
  const cookieVerified = jwt.verify(cookieJwt, process.env.JWT_SECRET)

  if (Object.keys(cookieVerified).length === 3) {
    if (cookieVerified.name === req.params.name) {
      return next()
    }
    return res.redirect('/')
  }
  return res.redirect('/')
}

export const METHODS = {
  onlyUser
}
