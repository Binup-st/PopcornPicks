import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const watchlist = async (req, res, next) => {
  const { movieId, movieTitle } = req.body;

  const userId = req.user.id;

  if (!movieId) {
    return next(errorHandler(404, "Movie not found..."));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const isAlreadyInWatchlist = user.watchlist.some(
      (item) => item.movieId === movieId
    );

    if (isAlreadyInWatchlist) {
      return next(errorHandler(409, "Movie is already in watchlist"));
    }

    user.watchlist.push({ movieId, movieTitle });
    await user.save();

    res.status(200).json({
      message: "Movie added to watchlist.",
      userId,
      watchlist: user.watchlist,
    });
  } catch (err) {
    next(err);
  }
};

export const getWatchlist = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ watchlist: user.watchlist });
  } catch (err) {
    next(err);
  }
};

export const updateWatchlist = async (req, res, next) => {
  const { movieId, movieTitle } = req.body;

  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    const movieIndex = user.watchlist.findIndex(
      (item) => Number(item.movieId) === movieId
    );

    if(movieIndex === -1){
      user.watchlist.push({
        movieId,
        movieTitle
      })
    }else{
    user.watchlist.splice(movieIndex, 1);
    }

    await user.save();

    res.status(200).json({
      message: "Movie removed from watchlist.",
      watchlist: user.watchlist,
    });
  } catch (err) {
    next(err);
  }
};
