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

export const subscribe = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { targetId } = req.body

    if (decoded.id === targetId) return res.status(400).json('cannot subscribe to yourself')

    await con.query(
      'INSERT INTO subscriptions (subscriber_id, target_id) VALUES ($1, $2)',
      [decoded.id, targetId]
    )
    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const unsubscribe = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { targetId } = req.body

    await con.query(
      'DELETE FROM subscriptions WHERE subscriber_id = $1 AND target_id = $2',
      [decoded.id, targetId]
    )
    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const isSubscribed = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(200).json({ subscribed: false })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const result = await con.query(
      'SELECT 1 FROM subscriptions WHERE subscriber_id = $1 AND target_id = $2',
      [decoded.id, req.params.targetId]
    )
    res.json({ subscribed: result.rowCount > 0 })
  } catch (err) {
    res.status(500).json('server error')
  }
}

export const getSubscriptions = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const result = await con.query(
      'SELECT target_id FROM subscriptions WHERE subscriber_id = $1',
      [decoded.id]
    )
    res.json(result.rows.map(r => r.target_id))
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}