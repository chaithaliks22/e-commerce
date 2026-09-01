import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const sampleProducts = [
  // --- ELECTRONICS ---
  {
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise cancellation with two processors and eight microphones. Exceptional sound quality with Hi-Res Audio and up to 30 hours battery life.',
    price: 24990,
    originalPrice: 29990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 142,
    stock: 15,
    featured: true,
    specifications: [
      { title: 'Battery Life', value: '30 Hours' },
      { title: 'Connectivity', value: 'Bluetooth 5.2' },
      { title: 'Noise Cancellation', value: 'Active Hybrid ANC' },
      { title: 'Weight', value: '250g' },
    ],
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'The most powerful smartwatch with the S9 SiP chip, magical double tap gesture, brighter display, and advanced health sensors including ECG and blood oxygen tracking.',
    price: 37900,
    originalPrice: 41900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 98,
    stock: 10,
    featured: true,
    specifications: [
      { title: 'Display', value: 'Always-On Retina OLED' },
      { title: 'Case Size', value: '45mm Aluminum' },
      { title: 'Water Resistance', value: '50m Swimproof' },
      { title: 'Sensors', value: 'ECG, SpO2, Temperature' },
    ],
  },
  {
    name: 'Samsung 27-inch 4K UHD IPS Monitor',
    description: 'Stunning 4K resolution with HDR10, borderless design, 99% sRGB color accuracy, and USB-C 65W power delivery. Perfect for work and creative professionals.',
    price: 28500,
    originalPrice: 34999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 64,
    stock: 8,
    featured: false,
    specifications: [
      { title: 'Resolution', value: '3840 x 2160 (4K)' },
      { title: 'Panel Type', value: 'IPS with HDR10' },
      { title: 'Refresh Rate', value: '60Hz' },
      { title: 'Ports', value: 'HDMI 2.0, DP 1.2, USB-C' },
    ],
  },
  {
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    description: 'Quiet click technology, 8000 DPI track-on-glass sensor, and MagSpeed electromagnetic scrolling. Seamlessly multi-computer workflow via Bluetooth and Logi Bolt.',
    price: 8995,
    originalPrice: 10995,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 210,
    stock: 25,
    featured: true,
    specifications: [
      { title: 'DPI Range', value: '200 to 8000 DPI' },
      { title: 'Battery', value: 'Up to 70 days per charge' },
      { title: 'Connectivity', value: 'Bluetooth & Logi Bolt' },
      { title: 'Ergonomics', value: 'Right-handed sculpted silhouette' },
    ],
  },

  // --- FASHION ---
  {
    name: 'Classic Indigo Denim Jacket',
    description: 'Timeless trucker jacket crafted from 100% heavyweight cotton denim with vintage brass buttons and chest flap pockets. Tailored for an easy regular fit.',
    price: 2499,
    originalPrice: 3999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 87,
    stock: 20,
    featured: true,
    specifications: [
      { title: 'Material', value: '100% Raw Cotton Denim' },
      { title: 'Fit', value: 'Regular Classic Fit' },
      { title: 'Care', value: 'Machine wash cold' },
      { title: 'Closure', value: 'Brass Button Shank' },
    ],
  },
  {
    name: 'Premium Heavyweight Cotton Hoodie',
    description: 'Cozy 450 GSM organic French terry cotton hoodie. Features double-layered hood, ribbed side gussets, kangaroo pouch, and pre-shrunk durability.',
    price: 1899,
    originalPrice: 2599,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 115,
    stock: 30,
    featured: false,
    specifications: [
      { title: 'Fabric', value: '450 GSM French Terry' },
      { title: 'Color', value: 'Charcoal Grey' },
      { title: 'Fit', value: 'Relaxed Drop Shoulder' },
      { title: 'Origin', value: 'Ethically Made' },
    ],
  },
  {
    name: 'Slim Fit Stretch Chino Trousers',
    description: 'Versatile chinos tailored from comfortable stretch-twill cotton. Suitable for smart-casual office wear or relaxed weekend outings.',
    price: 1599,
    originalPrice: 2199,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 53,
    stock: 18,
    featured: false,
    specifications: [
      { title: 'Material', value: '98% Cotton, 2% Elastane' },
      { title: 'Rise', value: 'Mid Rise' },
      { title: 'Fit', value: 'Slim Tapered' },
      { title: 'Pockets', value: '4 Pockets' },
    ],
  },
  {
    name: 'Merino Wool Crewneck Knit Sweater',
    description: 'Ultra-soft extrafine Merino wool sweater with natural temperature regulating properties, ribbed collar, and understated refinement.',
    price: 3299,
    originalPrice: 4499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 42,
    stock: 12,
    featured: false,
    specifications: [
      { title: 'Material', value: '100% Extrafine Merino Wool' },
      { title: 'Knit', value: '12 Gauge Fine Knit' },
      { title: 'Neckline', value: 'Ribbed Crewneck' },
      { title: 'Care', value: 'Hand wash cold or dry clean' },
    ],
  },

  // --- SHOES ---
  {
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    description: 'A responsive ride for everyday training. Dual Zoom Air units paired with React foam deliver energized cushioning from 5K runs to marathons.',
    price: 9995,
    originalPrice: 11995,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 180,
    stock: 16,
    featured: true,
    specifications: [
      { title: 'Type', value: 'Road Running' },
      { title: 'Cushioning', value: 'Dual Zoom Air + React' },
      { title: 'Upper', value: 'Engineered Breathable Mesh' },
      { title: 'Drop', value: '10mm' },
    ],
  },
  {
    name: 'Urban Chelsea Handcrafted Leather Boots',
    description: 'Sleek Chelsea silhouette in supple full-grain oiled leather with elastic side goring and durable Goodyear welted Dainite rubber soles.',
    price: 4799,
    originalPrice: 6999,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 76,
    stock: 14,
    featured: true,
    specifications: [
      { title: 'Upper', value: 'Full-Grain Pull-Up Leather' },
      { title: 'Sole', value: 'Anti-Slip Studded Rubber' },
      { title: 'Construction', value: 'Goodyear Welt' },
      { title: 'Lining', value: 'Calfskin Leather' },
    ],
  },
  {
    name: 'Classic White Canvas Low-Top Sneakers',
    description: 'Clean minimalist silhouette featuring breathable canvas upper, vulcanized rubber outsole, and Ortholite insole for all-day comfort.',
    price: 1999,
    originalPrice: 2799,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 132,
    stock: 22,
    featured: false,
    specifications: [
      { title: 'Upper', value: '12oz Heavy Canvas' },
      { title: 'Sole', value: 'Vulcanized Rubber' },
      { title: 'Closure', value: 'Cotton Lace-up' },
      { title: 'Insole', value: 'Ortholite Foam' },
    ],
  },
  {
    name: 'Ultralight All-Terrain Trail Shoes',
    description: 'Aggressive Vibram lugged outsole designed for mud, rocks, and steep inclines. Reinforced toe-cap and water-repellent ripstop mesh.',
    price: 5499,
    originalPrice: 6999,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 48,
    stock: 11,
    featured: false,
    specifications: [
      { title: 'Outsole', value: 'Vibram Megagrip 5mm Lugs' },
      { title: 'Upper', value: 'Ripstop with TPU Overlays' },
      { title: 'Weight', value: '310g' },
      { title: 'Water Resistance', value: 'DWR Coated' },
    ],
  },

  // --- ACCESSORIES ---
  {
    name: 'Polarized Aviator Classic Sunglasses',
    description: 'Classic gold wire frame with polarized crystal green lenses offering 100% UV400 protection, anti-reflective coating, and adjustable silicone nose pads.',
    price: 2199,
    originalPrice: 3499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 92,
    stock: 25,
    featured: true,
    specifications: [
      { title: 'Lens', value: 'Polarized UV400 Glass' },
      { title: 'Frame', value: 'Monel Metal Alloy' },
      { title: 'Lens Width', value: '58mm' },
      { title: 'Includes', value: 'Leather Case & Microfiber Cloth' },
    ],
  },
  {
    name: 'Minimalist RFID Slim Leather Wallet',
    description: 'Handcrafted bifold wallet from Italian vegetable-tanned leather. Holds up to 10 cards and flat banknotes with integrated RFID blocking layer.',
    price: 1299,
    originalPrice: 1999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 165,
    stock: 35,
    featured: false,
    specifications: [
      { title: 'Material', value: 'Italian Full-Grain Leather' },
      { title: 'Capacity', value: '8-10 Cards + Cash Slot' },
      { title: 'Security', value: '13.56 MHz RFID Shielding' },
      { title: 'Thickness', value: '0.8cm (Ultra Thin)' },
    ],
  },
  {
    name: 'Stainless Steel Chronograph Luxury Watch',
    description: 'Precision Japanese quartz movement with chronograph sub-dials, sapphire coated crystal glass, date aperture, and 100m water resistance.',
    price: 6499,
    originalPrice: 8999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 110,
    stock: 9,
    featured: true,
    specifications: [
      { title: 'Movement', value: 'Japanese Quartz Chronograph' },
      { title: 'Case', value: '316L Surgical Stainless Steel' },
      { title: 'Diameter', value: '42mm' },
      { title: 'Water Resistance', value: '10 ATM (100 Meters)' },
    ],
  },
  {
    name: 'Waterproof Commuter Backpack 25L',
    description: 'Weatherproof rolltop backpack with dedicated 16-inch fleece laptop sleeve, hidden passport pocket, ergonomic air-mesh straps, and luggage pass-through.',
    price: 2899,
    originalPrice: 3999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 88,
    stock: 19,
    featured: false,
    specifications: [
      { title: 'Capacity', value: '25 Liters' },
      { title: 'Material', value: 'Cordura 500D Waterproof' },
      { title: 'Laptop Sleeve', value: 'Padded Fits up to 16-inch' },
      { title: 'Zippers', value: 'YKK Aquaguard' },
    ],
  },

  // --- HOME ---
  {
    name: 'Ceramic Pour-Over Coffee Dripper Set',
    description: 'Artisan handcrafted ribbed ceramic dripper with 600ml borosilicate glass carafe and heat-resistant olive wood handle collar for the perfect morning brew.',
    price: 1699,
    originalPrice: 2299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 73,
    stock: 17,
    featured: true,
    specifications: [
      { title: 'Capacity', value: '600ml (2-4 Cups)' },
      { title: 'Carafe', value: 'Thermal Shock Resistant Glass' },
      { title: 'Dripper', value: 'Matte Glazed Ceramic' },
      { title: 'Filters', value: 'Includes 40 paper filters' },
    ],
  },
  {
    name: 'Minimalist Architectural LED Desk Lamp',
    description: 'Sleek aluminum arch lamp with touch-capacitive dimming, 5 color temperature modes, 10W wireless charging base, and flexible 360-degree rotation.',
    price: 2499,
    originalPrice: 3199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 61,
    stock: 20,
    featured: false,
    specifications: [
      { title: 'Brightness', value: '800 Lumens' },
      { title: 'Color Temp', value: '2700K - 6500K' },
      { title: 'Wireless Base', value: '10W Qi Fast Charging' },
      { title: 'Lifespan', value: '50,000 Hours LED' },
    ],
  },
  {
    name: 'Ultrasonic Essential Oil Aroma Diffuser',
    description: 'Real ceramic cover with whisper-quiet ultrasonic diffusion, 7 soothing ambient LED moods, and auto shut-off for relaxing bedroom aromatherapy.',
    price: 1499,
    originalPrice: 2199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 94,
    stock: 23,
    featured: false,
    specifications: [
      { title: 'Water Tank', value: '250ml' },
      { title: 'Run Time', value: 'Up to 10 Hours' },
      { title: 'Noise Level', value: '< 25 dB (Ultra-quiet)' },
      { title: 'Coverage', value: '300 sq ft' },
    ],
  },

  // --- BEAUTY ---
  {
    name: 'Hydrating Botanical Hyaluronic Acid Serum',
    description: 'Triple molecular weight hyaluronic acid combined with vitamin B5 and aloe vera extracts. Plumps skin and provides 72-hour continuous moisture.',
    price: 899,
    originalPrice: 1299,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 245,
    stock: 40,
    featured: true,
    specifications: [
      { title: 'Volume', value: '30ml / 1.0 fl. oz.' },
      { title: 'Skin Type', value: 'All Skin Types (Non-comedogenic)' },
      { title: 'Key Actives', value: 'Multi-weight HA 2% + B5' },
      { title: 'Cruelty-Free', value: '100% Vegan & Paraben-Free' },
    ],
  },
  {
    name: 'Organic Rosehip & Jojoba Facial Oil',
    description: 'Cold-pressed virgin rosehip seed oil rich in omega 3, 6, 9 fatty acids and natural retinoids. Restores elasticity and imparts a radiant natural glow.',
    price: 1199,
    originalPrice: 1699,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608248597358-1e4344d59a80?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 128,
    stock: 30,
    featured: false,
    specifications: [
      { title: 'Volume', value: '50ml / 1.7 fl. oz.' },
      { title: 'Extraction', value: '100% Cold-Pressed Unrefined' },
      { title: 'Fragrance', value: 'No Synthetic Fragrance' },
      { title: 'Packaging', value: 'Amber Glass Dropper' },
    ],
  },
];

export const seedUsers = [
  {
    name: 'System Administrator',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Demo Customer',
    email: 'user@example.com',
    password: 'User@123',
    role: 'user',
  },
];

// Helper to seed if database has zero products
export const seedDataIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seed] Database is empty. Seeding initial products and demo accounts...');

      // Seed Users
      for (const u of seedUsers) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
          await User.create(u);
          console.log(`[Seed] Created ${u.role}: ${u.email}`);
        }
      }

      // Seed Products
      await Product.insertMany(sampleProducts);
      console.log(`[Seed] Successfully inserted ${sampleProducts.length} sample products!`);
    } else {
      console.log(`[Seed] Database already contains ${productCount} products. Skipping auto-seed.`);
    }
  } catch (err) {
    console.error('[Seed] Error auto-seeding database:', err);
  }
};

// Standalone runner function
export const runSeed = async () => {
  try {
    const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_ecommerce';
    console.log(`[Seed Script] Connecting to ${primaryUri}...`);
    await mongoose.connect(primaryUri);
    console.log('[Seed Script] Connected. Resetting and inserting seed data...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    // Insert Users
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('[Seed Script] Demo users created:');
    console.log('  Admin: admin@example.com / Admin@123');
    console.log('  User:  user@example.com  / User@123');

    // Insert Products
    await Product.insertMany(sampleProducts);
    console.log(`[Seed Script] Successfully seeded ${sampleProducts.length} products!`);

    await mongoose.disconnect();
    console.log('[Seed Script] Done and disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Script] Error:', err);
    process.exit(1);
  }
};

// If run directly from terminal: node seed/seedProducts.js
if (process.argv[1] && process.argv[1].endsWith('seedProducts.js')) {
  runSeed();
}
