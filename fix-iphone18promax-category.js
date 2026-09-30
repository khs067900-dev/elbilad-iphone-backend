require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function fixCategory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ تم الاتصال بقاعدة البيانات");

    // البحث عن المنتج القديم اللي category بتاعته غلط
    const oldProduct = await Product.findOne({
      name: { $regex: "آيفون 18 برو ماكس", $options: "i" },
      category: "ابل ايفون 18",
    });

    if (oldProduct) {
      console.log("\n📦 وجدت المنتج القديم بـ category خطأ:");
      console.log("🆔 ID:", oldProduct._id);
      console.log("❌ Category القديم:", oldProduct.category);
      
      // حذف المنتج القديم
      await Product.findByIdAndDelete(oldProduct._id);
      console.log("🗑️  تم حذف المنتج القديم");
    }

    // التأكد من وجود المنتج الجديد الصحيح
    const correctProduct = await Product.findOne({
      category: "ايفون 18 برو ماكس",
    });

    if (correctProduct) {
      console.log("\n✅ المنتج الصحيح موجود:");
      console.log("🆔 ID:", correctProduct._id);
      console.log("📱 Name:", correctProduct.name);
      console.log("✅ Category:", correctProduct.category);
      console.log("💰 Price:", correctProduct.salePrice);
      console.log("\n🎉 كل شيء تمام! المنتج جاهز للعرض");
    } else {
      console.log("\n⚠️  المنتج الصحيح مش موجود - شغل seed-iphone18promax.js الأول");
    }

    await mongoose.disconnect();
    console.log("\n✅ تم قطع الاتصال بنجاح");
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    process.exit(1);
  }
}

fixCategory();
