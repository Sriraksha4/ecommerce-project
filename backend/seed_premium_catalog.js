const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");
const Category = require("./models/Category");

const categoriesData = [
  { name: "Laptops", description: "High-performance notebooks, ultrabooks, and workstations" },
  { name: "Mobiles", description: "Smartphones, tablets, and mobile accessories" },
  { name: "Audio", description: "Noise-cancelling headphones, wireless earbuds, and home audio speakers" },
  { name: "Watches", description: "Smartwatches, chronographs, and luxury timepieces" },
  { name: "Clothing", description: "Premium apparel, jackets, shirts, and casual wear" },
  { name: "Home & Furniture", description: "Modern furniture, study desks, and decorative home items" },
  { name: "Books", description: "Bestselling novels, educational textbooks, and self-help literature" }
];

const productsData = [
  // --- Laptops ---
  {
    name: "Apple MacBook Pro 16-inch M3 Max",
    description: "The ultimate developer powerhouse featuring a 16-core CPU, 40-core GPU, 48GB Unified Memory, and 1TB SSD. Liquid Retina XDR display makes compilation and media work stunning.",
    price: 349900,
    discount: 10,
    stock: 15,
    category: "Laptops",
    brand: "Apple",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
    ]
  },
  {
    name: "Dell XPS 15 InfinityEdge Touch",
    description: "Sleek aluminum body with Carbon Fiber palm rest. Equipped with Intel Core i9, NVIDIA RTX 4060, 32GB RAM, and 1TB SSD. Beautiful 3.5K OLED touchscreen display.",
    price: 245000,
    discount: 12,
    stock: 20,
    category: "Laptops",
    brand: "Dell",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80"
    ]
  },
  {
    name: "HP Spectre x360 2-in-1 Laptop",
    description: "Convertible premium laptop with 360-degree hinge, tilt pen stylus, Intel Core i7, 16GB RAM, and 1TB PCIe NVMe SSD. Dynamic bezel-less anti-reflection OLED panel.",
    price: 165000,
    discount: 15,
    stock: 25,
    category: "Laptops",
    brand: "HP",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
    ]
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    description: "Military-grade carbon-fiber chassis business laptop. Powered by Intel Core i7 Evo, 32GB LPDDR5, 1TB SSD, and standard enterprise security (dTPM & privacy guard webcam).",
    price: 189000,
    discount: 8,
    stock: 12,
    category: "Laptops",
    brand: "Lenovo",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
    ]
  },
  {
    name: "ASUS ROG Zephyrus G14 Gaming Laptop",
    description: "Compact 14-inch gaming beast featuring AMD Ryzen 9, NVIDIA RTX 4070, 16GB DDR5, and ROG Nebula 165Hz Display. Premium anime matrix customizable lid.",
    price: 174900,
    discount: 10,
    stock: 8,
    category: "Laptops",
    brand: "ASUS",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
    ]
  },
  {
    name: "Acer Swift Go 14 OLED",
    description: "Lightweight portable notebook with Intel Core i5, 16GB RAM, 512GB SSD, and an incredibly sharp 90Hz OLED display. Perfect for college students and professionals.",
    price: 69990,
    discount: 20,
    stock: 45,
    category: "Laptops",
    brand: "Acer",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1496181130207-897410caca88?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1496181130207-897410caca88?w=800&q=80"
    ]
  },

  // --- Clothing / Apparel ---
  {
    name: "Men's Premium Denim Jacket",
    description: "Tailored from organic heavyweight cotton, featuring standard chest pockets, brass button closures, and vintage wash finish. A durable addition to any casual wardrobe.",
    price: 4999,
    discount: 15,
    stock: 50,
    category: "Clothing",
    brand: "AuraStyles",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80"
    ]
  },
  {
    name: "Classic Slim Fit Oxford Shirt",
    description: "Crafted from soft combed cotton yarns, this button-down oxford shirt offers double button barrel cuffs, a crisp collar stand, and a breathable fit for smart-casual wear.",
    price: 2499,
    discount: 20,
    stock: 120,
    category: "Clothing",
    brand: "AuraStyles",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"
    ]
  },
  {
    name: "Premium Fleece Crewneck Hoodie",
    description: "Ultra-comfortable double-lined fleece hoodie. Features relaxed drop shoulders, heavy rib knit cuffs, and kangaroo pocket in charcoal black. Built for cozy comfort.",
    price: 3499,
    discount: 10,
    stock: 80,
    category: "Clothing",
    brand: "AuraStyles",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80"
    ]
  },
  {
    name: "Designer Wool Trench Coat",
    description: "Double-breasted long woolen coat with customizable belt sash, notched lapels, and interior satin lining. Excellent insulation for high styling during cold seasons.",
    price: 12999,
    discount: 25,
    stock: 20,
    category: "Clothing",
    brand: "VogueAura",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80"
    ]
  },
  {
    name: "Classic White Leather Sneakers",
    description: "Handcrafted low-top sneakers with full-grain calfskin leather, padded collar linings, OrthoLite comfort footbeds, and vulcanized rubber outsoles.",
    price: 5999,
    discount: 5,
    stock: 60,
    category: "Clothing",
    brand: "AuraWalk",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
    ]
  },

  // --- Mobiles ---
  {
    name: "iPhone 15 Pro Max Titanium",
    description: "Features a strong and light aerospace-grade titanium design. Powered by A17 Pro Chip, 256GB storage, and a customized 5x telephoto camera system.",
    price: 159900,
    discount: 5,
    stock: 30,
    category: "Mobiles",
    brand: "Apple",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1565849906660-ae47e290f02c?w=800&q=80"
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "The peak of Android innovation. Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, built-in S-Pen, and a spectacular 200MP camera with AI photo assist.",
    price: 129999,
    discount: 8,
    stock: 35,
    category: "Mobiles",
    brand: "Samsung",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800&q=80"
    ]
  },

  // --- Audio ---
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading active noise cancellation. 30 hours battery life, high-resolution audio processing, and crystal clear hands-free calling mic arrays.",
    price: 29990,
    discount: 10,
    stock: 40,
    category: "Audio",
    brand: "Sony",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80"
    ]
  },
  {
    name: "AuraBoom Portable Bluetooth Speaker",
    description: "IPX7 waterproof wireless speaker delivering punchy 360-degree stereo sound, active dual bass radiators, and up to 15 hours of playback time.",
    price: 3999,
    discount: 25,
    stock: 90,
    category: "Audio",
    brand: "AuraSound",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
    ]
  },

  // --- Watches ---
  {
    name: "AuraFit Active Smartwatch",
    description: "Advanced health tracker featuring continuous heart rate monitoring, SpO2 sensor, sleep analytics, 15+ fitness modes, and 10 days battery life.",
    price: 4999,
    discount: 30,
    stock: 150,
    category: "Watches",
    brand: "AuraFit",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
    ]
  },
  {
    name: "Classic Steel Chronograph Watch",
    description: "Timeless analogue luxury watch with solid stainless steel link bracelet, quartz chronograph movement, scratch-resistant mineral crystal glass.",
    price: 9999,
    discount: 15,
    stock: 55,
    category: "Watches",
    brand: "Chronos",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"
    ]
  },

  // --- Home & Furniture ---
  {
    name: "Mid-Century Modern Velvet Armchair",
    description: "Upholstered in rich stain-resistant velvet fabric, supported by solid gold-tipped metal tapered legs. High-density foam padding provides premium reading seating.",
    price: 18500,
    discount: 20,
    stock: 10,
    category: "Home & Furniture",
    brand: "AuraDecor",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80"
    ]
  },
  {
    name: "Minimalist Wooden Work Desk",
    description: "Solid oak table top with powder-coated steel legs. Includes dual built-in cable management cutouts and a slim sliding organizer drawer.",
    price: 14900,
    discount: 15,
    stock: 14,
    category: "Home & Furniture",
    brand: "AuraDecor",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"
    ]
  },

  // --- Books ---
  {
    name: "Atomic Habits - James Clear",
    description: "An easy & proven way to build good habits and break bad ones. Explains the science of microscopic behavioral shifts yielding massive personal development.",
    price: 499,
    discount: 10,
    stock: 200,
    category: "Books",
    brand: "Penguin",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"
    ]
  },
  {
    name: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description: "A must-read reference manual for software engineering teams. Written by Robert C. Martin, explaining code structures, refactoring, and clean style designs.",
    price: 1899,
    discount: 5,
    stock: 85,
    category: "Books",
    brand: "Prentice",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80"
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");

    // Clear existing
    await Category.deleteMany({});
    console.log("Cleared categories.");
    await Product.deleteMany({});
    console.log("Cleared products.");

    // Seed Categories
    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);

    // Seed Products
    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} products with gorgeous high-quality images.`);

  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
