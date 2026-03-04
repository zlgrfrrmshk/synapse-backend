import dotenv from 'dotenv'
import express from 'express';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import feedRoutes from './routes/feedRoutes.js'
import cookieParser from 'cookie-parser'
import { con } from './utils/db.js'
import admin from 'firebase-admin'
import serviceAccount from './utils/service.json' with { type: 'json' }
import path from 'path'

dotenv.config()

const port = 7021;
const app = express();

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

app.use(express.json());
app.use(cookieParser())

app.listen(port, () => {
  console.log(`server started on port ${port}`)
});

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/feed', feedRoutes)
app.use('/storage/avatars', express.static(path.join(process.cwd(), 'storage/avatars')))
app.use('/storage/photos', express.static(path.join(process.cwd(), 'storage/posts_photos')))

app.use(express.static(path.join(process.cwd(), 'dist')))

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

con.connect().then(() => console.log(`server connected to postgres`));