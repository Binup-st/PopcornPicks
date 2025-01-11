import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",

    },
    watchlist: [
      {
        movieId: String,
        movieTitle: String,
        addedAt : {type : Date, default: Date.now },
      }
    ]
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

export default User;
