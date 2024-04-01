import { Router } from "express";
import userRoutes from "./userRoutes.js"
import postRoutes from "./postRoutes.js"
import commentRoutes from "./commentRoutes.js"

const router = Router()

// For User Routes
router.use("/api/user", userRoutes)

// For Post Routes
router.use("/api/post", postRoutes)

// For Comment Routes
router.use("/api/comment", commentRoutes)

export default router