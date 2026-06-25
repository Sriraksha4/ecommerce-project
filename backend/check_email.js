const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    users.forEach(u => {
      console.log(`Email: "${u.email}", Length: ${u.email ? u.email.length : 0}, Role: "${u.role}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
