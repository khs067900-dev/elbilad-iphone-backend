require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const newDescription = `الشروط الواجب توفرها للتقديم:

• مواطن سعودي او مقيم بإقامة سارية.
• اتمام سداد الدفعة المقدمة لتأكيد الطلب.
• تقديم بيانات صحيحة للتواصل والمتابعة.
• توقيع عقد الأقساط عند استلام الجهاز.
• الالتزام بسداد القسط الشهري في موعده.`;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const result = await Product.updateMany(
      {},
      {
        $set: { description: newDescription },
        $unset: { specs: "" },
      }
    );

    console.log(`✅ تم تحديث ${result.modifiedCount} منتج بنجاح`);
    console.log("   - تم مسح المواصفات (specs)");
    console.log("   - تم تحديث الوصف بشروط التقديم");
  } catch (err) {
    console.error("❌ خطأ:", err.message ?? err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
