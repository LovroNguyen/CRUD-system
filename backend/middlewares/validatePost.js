export const validatePost = (req, res, next) => {
    const { title, content } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    next();
}