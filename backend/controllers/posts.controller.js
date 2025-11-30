import Post from '../models/Post.model.js'

export const list = async (req, res) => {
    try {
        const { search, category } = req.query
        let query = {}

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ]
        }

        // Filter by category 
        if (category && category !== 'All') {
            query.category = category
        }

        const items = await Post.find(query).sort({ createdAt: -1 })
        
        res.json(items)
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve posts.' })
    }
}

export const get = async (req, res) => {
    try {
        const item = await Post.findById(req.params.id)
        if (!item) return res.status(404).json({ error: 'Post not found.' })
        res.json(item)
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve the post.' })
    }
}

export const create = async (req, res) => {
    try {
        const created = await Post.create(req.body)
        res.status(201).json(created)
    } catch (err) {
        res.status(500).json({ error: 'Failed to create the post.' })
    }
}

export const update = async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ error: 'Post not found.' })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the post.' })
    }
}

export const remove = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Post not found.' })
        res.status(204).end()
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the post.' })
    }
}

export const stats = async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments()
        const categoryStats = await Post.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
        
        const recentPosts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title category createdAt')

        res.json({
            totalPosts,
            categoryStats,
            recentPosts
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to get statistics.' })
    }
}