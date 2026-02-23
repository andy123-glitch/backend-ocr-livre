import express from "express";

const router = express.Router();
import * as bookCtrl from "../controllers/book.js";
import { auth } from "../middlewares/auth.js";
import multer from "../middlewares/multer.js";

router.get("", bookCtrl.getBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("", auth, multer, bookCtrl.createOneBook);
router.delete("/:id", auth, bookCtrl.deleteOneBook);
// router.post("/signup", signup);
// router.post("/login", login);

export default router;
