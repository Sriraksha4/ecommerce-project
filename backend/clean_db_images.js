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
    
    // Update any product where image is literally "undefined" or "null" to be ""
    const resultUndefined = await Product.updateMany(
      { image: "undefined" },
      { $set: { image: "" } }
    );
    console.log(`Cleaned up 'undefined' image fields: matched ${resultUndefined.matchedCount}, modified ${resultUndefined.modifiedCount}`);

    const resultNull = await Product.updateMany(
      { image: "null" },
      { $set: { image: "" } }
    );
    console.log(`Cleaned up 'null' image fields: matched ${resultNull.matchedCount}, modified ${resultNull.modifiedCount}`);

    // Let's also check if any laptop has the default watch image and set it to "" so it resolves dynamically
    const watchUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
    const laptopsWithWatch = await Product.find({
      image: watchUrl,
      $or: [
        { name: /laptop/i },
        { name: /dell/i },
        { name: /hp/i },
        { name: /lenovo/i },
        { category: /laptop/i }
      ]
    });

    if (laptopsWithWatch.length > 0) {
      console.log(`Found ${laptopsWithWatch.length} laptop(s) with watch image URL. Cleaning them up...`);
      const resultLaptops = await Product.updateMany(
        {
          image: watchUrl,
          $or: [
            { name: /laptop/i },
            { name: /dell/i },
            { name: /hp/i },
            { name: /lenovo/i },
            { category: /laptop/i }
          ]
        },
        { $set: { image: "" } }
      );
      console.log(`Updated laptops: matched ${resultLaptops.matchedCount}, modified ${resultLaptops.modifiedCount}`);
    } else {
      console.log("No laptops found with incorrect watch image URL.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}
run();
