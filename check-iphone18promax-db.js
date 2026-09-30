require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB متصل");

    try {
      // البحث عن منتجات iPhone 18 Pro Max
      const products = await Product.find({
        $or: [
          { name: { $regex: /iPhone 18 Pro Max/i } },
          { name: { $regex: /آيفون 18 برو ماكس/i } },
          { name: { $regex: /ايفون 18 برو ماكس/i } },
          { category: { $regex: /ايفون 18 برو ماكس/i } }
        ]
      }).lean();

      console.log(`\n📦 عدد المنتجات: ${products.length}\n`);

      products.forEach((product, i) => {
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`المنتج ${i + 1}:`);
        console.log(`  الاسم: ${product.name}`);
        console.log(`  ID: ${product._id}`);
        console.log(`  السعر: ${product.originalPrice} ر.س`);
        console.log(`  الكاتيجوري: ${product.category}`);
        console.log(`  الصور: ${product.images?.length || 0}`);
        console.log(`  الوصف: ${product.description ? product.description.substring(0, 50) + "..." : "لا يوجد"}`);
        console.log(`  Brief: ${product.brief ? "موجود" : "غير موجود"}`);
        console.log(`  Variants: ${product.variants?.length || 0}`);
        console.log(`  SpecGroups: ${product.specGroups?.length || 0}`);
        console.log(`  Sections: ${product.sections?.length || 0}`);
        console.log(`  Gallery: ${product.gallery?.length || 0}`);
        
        if (product.variants && product.variants.length > 0) {
          console.log(`\n  الألوان المتاحة:`);
          product.variants.forEach(v => {
            console.log(`    - ${v.color} (${v.storageOptions?.length || 0} سعة)`);
          });
        }
        
        if (product.sections && product.sections.length > 0) {
          console.log(`\n  الأقسام:`);
          product.sections.forEach(s => {
            console.log(`    - ${s.type}: ${s.title}`);
          });
        }
      });

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      if (products.length > 0) {
        const first = products[0];
        console.log("🔍 تفاصيل المنتج الأول:");
        console.log(JSON.stringify(first, null, 2));
      }

    } catch (error) {
      console.error("❌ خطأ:", error.message);
    } finally {
      await mongoose.disconnect();
      console.log("\n👋 تم قطع الاتصال بـ MongoDB");
    }
  })
  .catch((err) => {
    console.error("❌ فشل الاتصال بـ MongoDB:", err.message);
    process.exit(1);
  });
