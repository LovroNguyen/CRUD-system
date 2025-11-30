import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { REFRESH_SECRET } from '../config.js'
import { signAccessToken, signRefreshToken } from '../middlewares/auth.js'

export const register = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json({ message: 'User created.' })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ error: 'User not found.' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Wrong password.' })

    const accessToken = signAccessToken(user) // 15 mins
    const refreshToken = signRefreshToken(user) // 15 days

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: false, // "true" in HTTPS.
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days.
    })

    res.json({ token: accessToken })
}

export const refresh = async (req, res) => {
    const token = req.cookies.refresh
    if (!token) return res.status(401).json({ error: 'No refresh token.' })

    try {
        const payload = jwt.verify(token, REFRESH_SECRET)

        const user = await User.findById(payload.id)
        if (!user || user.refreshToken !== token)
            return res.status(403).json({ error: 'Invalid refresh token.' })

        const newAccess = signAccessToken(user)
        const newRefresh = signRefreshToken(user)
        user.refreshToken = newRefresh
        await user.save()

        res.cookie('refresh', newRefresh, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/api/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ token: newAccess })
    } catch (e) {
        res.status(403).json({ error: 'Invalid refresh token.' })
    }
}

export const logout = async (req, res) => {
    const token = req.cookies.refresh
    if (token) {
        const user = await User.findOne({ refreshToken: token })
        if (user) {
            user.refreshToken = null
            await user.save()
        }
    }

    res.clearCookie('refresh', { path: '/api/auth/refresh' })
    res.json({ message: 'Logged out.' })
}

export const me = async (req, res) => {
    const user = await User.findById(req.user.id).select('username role')
    res.json(user)
}