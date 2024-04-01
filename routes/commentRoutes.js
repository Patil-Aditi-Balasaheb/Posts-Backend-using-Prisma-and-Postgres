import { Router } from "express";
import { createComment, deleteComment, fetchComments, showComment, updateComment } from "../controllers/CommentController.js";

const router = Router()

router.get("/", fetchComments)
router.get("/:id", showComment)
router.post("/", createComment)
router.put("/:id", updateComment)
router.delete("/:id", deleteComment)

export default router