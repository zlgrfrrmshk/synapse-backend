import jwt from "jsonwebtoken";
import admin from 'firebase-admin'
import { con } from '../utils/db.js'
import dotenv from 'dotenv'
dotenv.config()

export const getUser = async (req, res) => {
  try {
    const result = await con.query(
      `SELECT id, name, avatar, google_avatar FROM users WHERE id = $1`,
      [req.params.userid]
    )
    if (result.rowCount === 0) return res.status(404).json('user not found')
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}