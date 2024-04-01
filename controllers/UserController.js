import prisma from "../db/db.config.js"

// Fetch all users
const fetchUsers = async (req, res) => {
    const users = await prisma.user.findMany()

    return res.json({ status: 200, data: users })
}

// Create a user
const createUser = async (req, res) => {
    const { name, email, password } = req.body

    const findUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (findUser) {
        return res.json({ status: 400, message: "Email already exist. Please try with another email." })
    }

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    })

    return res.json({ status: 200, data: newUser, message: "User created successfully." })
}

// Get a user
const showUser = async (req, res) => {
    const userId = req.params.id
    const user = await prisma.user.findFirst({
        where: {
            id: Number(userId)
        }
    })

    if (!user) {
        return res.json({ status: 400, message: "User not found." })
    }

    return res.json({ status: 200, data: user })
}

// Update a user
const updateUser = async (req, res) => {
    const userId = req.params.id
    const { name, email, password } = req.body
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(userId)
        },
        data: {
            name,
            email,
            password
        }
    })

    return res.json({ status: 200, data: updatedUser, message: "User updated successfully." })
}

// Delete a user
const deleteUser = async (req, res) => {
    const userId = req.params.id
    const deletedUser = await prisma.user.delete({
        where: {
            id: Number(userId)
        }
    })

    return res.json({ status: 200, data: deletedUser, message: "User deleted successfully." })
}

export { fetchUsers, createUser, showUser, updateUser, deleteUser }