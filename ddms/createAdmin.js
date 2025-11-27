// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust the path if needed

// MongoDB connection
const MONGODB_URI = "mongodb+srv://DDMS-1:Wefive@cluster0.6p4e0gt.mongodb.net/inventory?retryWrites=true&w=majority";

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "raffizaman7@gmail.com" });
    if (existing) {
      console.log("Admin user already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = new User({
      name: "Raffi Zaman",
      email: "raffizaman7@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
