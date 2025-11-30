import jwt from 'jsonwebtoken'
import { ACCESS_SECRET, REFRESH_SECRET } from '../config.js'

// Verify access token.
export const verifyToken = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ error: 'No token.' })

    const token = header.split(' ')[1]
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' })
    }
}

// Helpers for controllers.
export const signAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: '15m' }
    )
}

export const signRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        REFRESH_SECRET,
        { expiresIn: '15d' }
    )
}

export const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    return res.status(403).json({ error: 'Forbidden: Admin only.' })
}

export const isUserOrAdmin = (req, res, next) => {
    if (req.user?.role === 'user' || req.user?.role === 'admin') return next()
    return res.status(403).json({ error: 'Forbidden.' })
}