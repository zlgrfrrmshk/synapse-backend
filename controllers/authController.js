import jwt from "jsonwebtoken";
import admin from 'firebase-admin'
import { con } from '../utils/db.js'
import dotenv from 'dotenv'
dotenv.config()

export const googleAuth = async (req, res) => {
  try {
    const decoded = await admin.auth().verifyIdToken(req.body.idToken)
    const { email, name, picture } = decoded
    let user = await con.query('SELECT * FROM users WHERE googleemail = $1', [email])
    if (user.rowCount === 0) {
      user = await con.query(
        'INSERT INTO users (name, avatar, googleemail) VALUES ($1, $2, $3) RETURNING *',
        [name, picture, email]
      )
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '21d' })
    res.cookie('access_token', token, { httpOnly: true }).json(user.rows[0])
    res.status(200);
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json(null)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await con.query('SELECT * FROM users WHERE id = $1', [decoded.id])
    res.json(user.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
}
}

export const logout = (req, res) => {
  res.clearCookie('access_token').json({ ok: true })
}

export const changeInfo = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    await con.query('UPDATE users SET name = $1 WHERE id = $2', [req.body.name, decoded.id])
    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}