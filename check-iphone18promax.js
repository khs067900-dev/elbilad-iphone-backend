require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function checkProduct() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ تم الاتصال بقاعدة البيانات");

    // البحث عن المنتج
    const product = await Product.findOne({
      $or: [
        { name: { $regex: "آيفون 18 برو ماكس", $options: "i" } },
        { category: { $regex: "ايفون 18 برو ماكس", $options: "i" } },
      ],
    });

    if (product) {
      console.log("\n📦 المنتج موجود في قاعدة البيانات:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🆔 ID:", product._id);
      console.log("📱 Name:", product.name);
      console.log("🏷️  Category:", product.category);
      console.log("🏷️  SubCategory:", product.subCategory);
      console.log("💰 Price:", product.salePrice);
      console.log("📦 In Stock:", product.inStock);
      console.log("🎨 Variants:", product.variants?.length || 0);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      console.log("\n❌ المنتج غير موجود في قاعدة البيانات");
    }

    // عرض جميع المنتجات المتعلقة بـ iPhone 18
    const allIPhone18 = await Product.find({
      $or: [
        { name: { $regex: "iPhone 18", $options: "i" } },
        { name: { $regex: "آيفون 18", $options: "i" } },
      ],
    }).select("name category subCategory");

    console.log("\n📱 جميع منتجات iPhone 18 في قاعدة البيانات:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    allIPhone18.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   SubCategory: ${p.subCategory}`);
      console.log("");
    });

    await mongoose.disconnect();
    console.log("✅ تم قطع الاتصال بنجاح");
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    process.exit(1);
  }
}

checkProduct();
