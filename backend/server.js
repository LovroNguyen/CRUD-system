import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

import { logger } from './middlewares/logger.js'

import authRoutes from './routes/auth.routes.js'
import postsRoutes from './routes/posts.routes.js'
import authorsRoutes from './routes/authors.routes.js'

const app = express()
const PORT = 3000

app.use(cookieParser()) // Parse cookies.
app.use(express.json()) // Parse JSON request bodies.
app.use(logger) // Custom logging middleware.
app.use(cors({
    origin: 'http://localhost:5173', // front end
    credentials: true                // Allow cookie exchange.
}))

// Define routes.
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/authors', authorsRoutes)

// Handle undefined routes.
app.all(/.*/, (req, res) => res.status(404).json({ error: 'Endpoint not found.' }))

// Start the server.
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}.`))

/* CONNECT TO DATABASE */
// const PASSWORD = encodeURIComponent('Greenwich@123')
// const URI = `mongodb+srv://tester:${PASSWORD}@cluster0.d7o5uji.mongodb.net/?appName=Cluster0`
const URI = `mongodb://127.0.0.1:27017/`

mongoose.set('strictQuery', true)
mongoose.connect(URI, { dbName: 'cw_web2' })
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Error connecting to MongoDB:', err))