import { con } from "../utils/db.js";
import dotenv from "dotenv";
dotenv.config();

export const search = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await con.query(
      `SELECT id, name, avatar FROM users WHERE name ILIKE $1 LIMIT 10`,
      [`%${q}%`],
    );

    const posts = await con.query(
      `SELECT id FROM posts WHERE caption ILIKE $1 ORDER BY created_at DESC LIMIT 20`,
      [`%${q}%`],
    );

    res.json({
      users: users.rows.map((u) => u.id),
      posts: posts.rows.map((p) => p.id),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("server error");
  }
};
