const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = mongoose.model("Product", new mongoose.Schema({
  name: { type: String },
  category: { type: String },
  image: { type: String },
  price: { type: Number },
  stock: { type: Number }
}, { timestamps: true }));

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`- ID: ${p._id}, Name: "${p.name}", Category: "${p.category}", Image: "${p.image}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}
run();
