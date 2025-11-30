import { Router } from 'express'
import { verifyToken } from '../middlewares/auth.js'
import {
    register,
    refresh,
    logout,
    login,
    me
} from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', verifyToken, me)

export default router