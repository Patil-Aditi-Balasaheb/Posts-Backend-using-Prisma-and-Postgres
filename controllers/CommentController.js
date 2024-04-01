import prisma from "../db/db.config.js"

// Fetch all comments
const fetchComments = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    if (page <= 0) {
        page = 1
    }

    if (limit <= 0 || limit > 100) {
        limit = 10
    }

    const skip = (page - 1) * limit

    const comments = await prisma.comment.findMany({
        skip: skip,
        take: limit,
        include: {
            post: {
                include: {
                    user: true
                }
            },
            user: true
        }
    })

    // get total comments count
    const totalComments = await prisma.comment.count()
    const totalPages = Math.ceil(totalComments / limit)

    return res.json({ status: 200, data: comments, meta: { totalPages, currentPage: page, limit: limit } })
}

// Create a comment
const createComment = async (req, res) => {
    const { user_id, post_id, comment } = req.body

    // increase comment counter
    await prisma.post.update({
        where: {
            id: Number(post_id)
        },
        data: {
            comment_count: {
                increment: 1
            }
        }
    })

    const newComment = await prisma.comment.create({
        data: {
            user_id: Number(user_id),
            post_id: Number(post_id),
            comment
        }
    })

    return res.json({ status: 200, data: newComment, message: "Comment created successfully." })
}

// Get a comment
const showComment = async (req, res) => {
    const commentId = req.params.id
    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId
        },
        include: {
            user: true
        }
    })

    if (!comment) {
        return res.json({ status: 400, message: "Comment not found." })
    }

    return res.json({ status: 200, data: comment })
}

// Update a comment
const updateComment = async (req, res) => {
    const commentId = req.params.id
    const { comment } = req.body

    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            comment
        }
    })

    return res.json({ status: 200, data: updatedComment, message: "Comment updated successfully." })
}

// Delete a comment
const deleteComment = async (req, res) => {
    const commentId = req.params.id
    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    // decrease comment counter
    await prisma.post.update({
        where: {
            id: Number(deletedComment.post_id)
        },
        data: {
            comment_count: {
                decrement: 1
            }
        }
    })

    return res.json({ status: 200, data: deletedComment, message: "Comment deleted successfully." })
}

export { fetchComments, createComment, showComment, updateComment, deleteComment }