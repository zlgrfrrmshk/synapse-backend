import dotenv from 'dotenv'
import express from 'express';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import { con } from './utils/db.js'
import admin from 'firebase-admin'
import serviceAccount from './utils/service.json' with { type: 'json' }



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

con.connect().then(() => console.log(`server connected to postgres`));