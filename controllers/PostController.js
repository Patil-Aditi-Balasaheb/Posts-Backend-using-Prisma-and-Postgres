import prisma from "../db/db.config.js"

// Fetch all posts along with comments and user (Pagination)
const fetchPosts = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    if (page <= 0) {
        page = 1
    }

    if (limit <= 0 || limit > 100) {
        limit = 10
    }

    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
        skip: skip,
        take: limit,
        include: {
            comment: {
                include: {
                    user: true
                }
            },
            user: true
        }
    })

    // get total posts count
    const totalPosts = await prisma.post.count()
    const totalPages = Math.ceil(totalPosts / limit)

    return res.json({ status: 200, data: posts, meta: { totalPages, currentPage: page, limit: limit } })
}

// Create a post
const createPost = async (req, res) => {
    const { user_id, title, description } = req.body

    const newPost = await prisma.post.create({
        data: {
            user_id: Number(user_id),
            title,
            description
        }
    })

    return res.json({ status: 200, data: newPost, message: "Post created successfully." })
}

// Get a post
const showPost = async (req, res) => {
    const postId = req.params.id
    const post = await prisma.post.findFirst({
        where: {
            id: Number(postId)
        },
        include: {
            user: true
        }
    })

    if (!post) {
        return res.json({ status: 400, message: "Post not found." })
    }

    return res.json({ status: 200, data: post })
}

// Update a post
const updatePost = async (req, res) => {
    const postId = req.params.id
    const { title, description } = req.body
    const updatedPost = await prisma.post.update({
        where: {
            id: Number(postId)
        },
        data: {
            title, description
        }
    })

    return res.json({ status: 200, data: updatedPost, message: "Post updated successfully." })
}

// Delete a post
const deletePost = async (req, res) => {
    const postId = req.params.id
    const deletedPost = await prisma.post.delete({
        where: {
            id: Number(postId)
        }
    })

    return res.json({ status: 200, data: deletedPost, message: "Post deleted successfully." })
}

// Search a post
const searchPost = async (req, res) => {
    const query = req.query.q

    if (!query) {
        return res.json({ status: 400, message: "No search param found." })
    }

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                {
                    description: {
                        search: query
                    }
                },
                {
                    title: {
                        // contains: query
                        search: query
                    }
                }
            ]
        }
    })

    return res.json({ status: 200, data: posts })
}

export { fetchPosts, createPost, showPost, updatePost, deletePost, searchPost }