import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User.js";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI) throw new Error("MONGODB_URI is required.");
if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
  throw new Error("AUTH_SECRET must contain at least 32 characters.");
}
if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is required.");
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
}

await mongoose.connect(MONGODB_URI);
try {
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = await User.findOne({ email }).select("+passwordHash");
  if (user) {
    user.role = "admin";
    user.isActive = true;
    user.passwordHash = passwordHash;
    await user.save();
  } else {
    await User.create({
      name: "Bakery Admin",
      email,
      phone: "0000000000",
      passwordHash,
      role: "admin"
    });
  }
  console.log(`Administrator account ready for ${email}.`);
} finally {
  await mongoose.disconnect();
}
