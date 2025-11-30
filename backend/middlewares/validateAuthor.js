export const validateAuthor = (req, res, next) => {
    const { name, email } = req.body || {}

    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' })
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' })
    }

    next()
}