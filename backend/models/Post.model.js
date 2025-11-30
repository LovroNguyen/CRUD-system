import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { 
            type: String, 
            required: true,
            enum: ['Technology', 'Business', 'Lifestyle', 'Education', 'Other'],
            default: 'Other'
        },
    },
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post