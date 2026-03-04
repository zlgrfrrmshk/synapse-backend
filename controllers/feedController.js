import { con } from "../utils/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getFeed = async (req, res) => {
  try {
    const token = req.cookies.access_token
    const decoded = token ? jwt.verify(token, process.env.JWT_SECRET) : null

    let posts;

    if (decoded) {
      posts = await con.query(`
        SELECT p.id,
          CASE WHEN s.subscriber_id IS NOT NULL THEN 1 ELSE 0 END AS priority
        FROM posts p
        LEFT JOIN subscriptions s ON s.target_id = p.user_id AND s.subscriber_id = $1
        ORDER BY priority DESC, p.created_at DESC
        LIMIT 50
      `, [decoded.id])
    } else {
      posts = await con.query(`
        SELECT id FROM posts ORDER BY created_at DESC LIMIT 50
      `)
    }

    res.json(posts.rows.map(p => p.id))
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}