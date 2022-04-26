const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    unique: true,
    required: [true, "User must have a name"],
  },
  email: { type: String, required: [true, "User must have an email"] },
  password: {
    type: String,
    minlength: 8,
    required: [true, "User must have a password"],
  },
  profilePic: { type: String, default: "" },
  friends: [{ id: mongoose.Types.ObjectId }],
  pendingRequests: [{ from: { name: String, id: mongoose.Types.ObjectId } }],
  sentRequests: [{ to: mongoose.Types.ObjectId }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 15);
  next();
});

userSchema.methods.isPasswordValid = async function (
  hashedPassword,
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
