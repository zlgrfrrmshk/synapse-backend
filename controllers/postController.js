import jwt from "jsonwebtoken";
import { con } from '../utils/db.js'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import dotenv from 'dotenv'
dotenv.config()

export const createPost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET)
    const { caption } = req.body

    let photo = null
    if (req.file) {
      const filename = `${crypto.randomUUID()}.jpg`
      const outputPath = `./storage/posts_photos/${filename}`

      await new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
          .outputOptions(['-vf scale=-2:1280', '-q:v 2'])
          .output(outputPath)
          .on('end', () => {
            fs.unlinkSync(req.file.path)
            resolve()
          })
          .on('error', reject)
          .run()
      })

      photo = filename
    }

    const result = await con.query(
      'INSERT INTO posts (user_id, caption, photo) VALUES ($1, $2, $3) RETURNING *',
      [decoded.id, caption, photo]
    )
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const updatePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET)
    const { caption } = req.body
    const result = await con.query(
      'UPDATE posts SET caption = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [caption, req.params.postId, decoded.id]
    )
    if (result.rowCount === 0) return res.status(404).json('post not found')
    res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const deletePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET)
    const result = await con.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2',
      [req.params.postId, decoded.id]
    )
    if (result.rowCount === 0) return res.status(404).json('post not found')
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const likePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET)
    await con.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [decoded.id, req.params.postId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const unlikePost = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET)
    await con.query(
      'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
      [decoded.id, req.params.postId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const getPost = async (req, res) => {
  try {
    const result = await con.query(
      `SELECT p.*, u.name, u.avatar, u.google_avatar,
        COUNT(l.user_id) AS likes
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN likes l ON l.post_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, u.name, u.avatar, u.google_avatar`,
      [req.params.postId]
    )
    if (result.rowCount === 0) return res.status(404).json('post not found')
    res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json('server error')
  }
}

export const isLiked = async (req, res) => {
  try {
    const token = req.cookies.access_token
    if (!token) return res.json({ liked: false })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const result = await con.query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2',
      [decoded.id, req.params.postId]
    )
    res.json({ liked: result.rowCount > 0 })
  } catch (err) {
    res.json({ liked: false })
  }
}
