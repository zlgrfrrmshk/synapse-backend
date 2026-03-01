import jwt from "jsonwebtoken";
import admin from 'firebase-admin'
import { con } from '../utils/db.js'
import dotenv from 'dotenv'
dotenv.config()

export const getUser = async (req, res) => {
  try {
    const result = await con.query(
  `SELECT u.id, u.name, u.avatar, u.google_avatar,
    COUNT(s.subscriber_id) AS subscribers
  FROM users u
  LEFT JOIN subscriptions s ON s.target_id = u.id
  WHERE u.id = $1
  GROUP BY u.id, u.name, u.avatar, u.google_avatar`,
  [req.params.userid]
)
    if (result.rowCount === 0) return res.status(404).json('user not found')
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}