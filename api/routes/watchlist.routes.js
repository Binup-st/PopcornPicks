import express from "express";
import {
  getWatchlist,
  updateWatchlist,
  watchlist,
} from "../controllers/watchlist.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/watchlist", verifyToken, watchlist);

router.get("/getWatchlist", verifyToken, getWatchlist);

router.put("/updateWatchlist", verifyToken, updateWatchlist);

export default router;
