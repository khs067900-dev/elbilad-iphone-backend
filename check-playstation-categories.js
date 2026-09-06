require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to DB\n");

  const results = await Product.aggregate([
    {
      $match: {
        $or: [
          { name:        { $regex: /playstation|ps4|ps5/i } },
          { category:    { $regex: /playstation|ps4|ps5/i } },
          { subCategory: { $regex: /playstation|ps4|ps5/i } },
          { brand:       { $regex: /playstation|ps4|ps5|sony/i } },
        ],
      },
    },
    {
      $group: {
        _id: { category: "$category", subCategory: "$subCategory" },
        count: { $sum: 1 },
        sample: { $first: "$name" },
      },
    },
    { $sort: { "_id.category": 1, "_id.subCategory": 1 } },
  ]);

  if (!results.length) {
    console.log("❌ مفيش منتجات بلايستيشن في الداتا بيز");
  } else {
    console.log(`📦 الكاتيجوري الخاصة بالبلايستيشن (${results.length} مجموعة):\n`);
    console.log("─".repeat(60));
    results.forEach((r) => {
      console.log(`Category    : ${r._id.category    || "(فاضي)"}`);
      console.log(`SubCategory : ${r._id.subCategory || "(فاضي)"}`);
      console.log(`عدد المنتجات: ${r.count}`);
      console.log(`مثال        : ${r.sample}`);
      console.log("─".repeat(60));
    });
  }

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
