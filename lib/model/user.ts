import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    githubId: String,
    username: String,
    bio: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User2 || mongoose.model("User2", userSchema);
export default User;
