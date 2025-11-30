import { Router } from "express"
import { validatePost } from "../middlewares/validatePost.js"
import { verifyToken, isAdmin } from "../middlewares/auth.js"
import {
    list,
    get,
    create,
    update,
    remove,
    stats
} from "../controllers/posts.controller.js"

const router = Router()

router.get('/', verifyToken, list)
router.get('/stats', verifyToken, stats)
router.get('/:id', verifyToken, get)
router.post('/', verifyToken, isAdmin, validatePost, create)
router.put('/:id', verifyToken, isAdmin, validatePost, update)
router.delete('/:id', verifyToken, isAdmin, remove)

export default router