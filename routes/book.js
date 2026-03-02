import express from "express";

import * as bookCtrl from "../controllers/book.js";
import { auth } from "../middlewares/auth.js";
import multer from "../middlewares/multer.js";

const router = express.Router();

router.get("", bookCtrl.getBooks);
router.get("/bestrating", bookCtrl.getBestRatingsBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("", auth, multer, bookCtrl.createOneBook);
router.post("/:id/rating", auth, bookCtrl.addRating);
router.delete("/:id", auth, bookCtrl.deleteOneBook);

export default router;
