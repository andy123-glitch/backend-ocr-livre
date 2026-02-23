import express from "express";

const router = express.Router();
import * as bookCtrl from "../controllers/book.js";
import { auth } from "../middlewares/auth.js";

router.get("", bookCtrl.getBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("", auth, bookCtrl.createOneBook);
// router.post("/signup", signup);
// router.post("/login", login);

export default router;
