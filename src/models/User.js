import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password should be at least 6 characters long"],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add this to make password not required during updates
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    this.password = this._previousSaved
      ? this._previousSaved.password
      : this.password;
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
