const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String },
  role: { type: String, default: "customer" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. Promote srirakshakr.4@gmail.com to admin
    const emailToPromote = "srirakshakr.4@gmail.com";
    const user = await User.findOne({ email: emailToPromote });
    if (user) {
      user.role = "admin";
      user.isActive = true;
      await user.save();
      console.log(`Successfully promoted ${emailToPromote} to "admin" role.`);
    } else {
      console.log(`User ${emailToPromote} not found to promote.`);
    }

    // 2. Create master backup admin account if it doesn't exist
    const backupEmail = "admin@ecommerce.com";
    const existingBackup = await User.findOne({ email: backupEmail });
    if (!existingBackup) {
      const hashedPassword = await bcrypt.hash("Admin@1234", 10);
      const newAdmin = new User({
        name: "Master Administrator",
        email: backupEmail,
        phone: "9999999999",
        password: hashedPassword,
        role: "admin",
        isActive: true
      });
      await newAdmin.save();
      console.log(`Created master admin account: ${backupEmail} with password "Admin@1234".`);
    } else {
      console.log(`Master admin account ${backupEmail} already exists.`);
    }

  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}
run();
