require("dotenv").config();
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require("./models/Product");
  const p = await Product.findById("69dfb0bf7867136004af66ce").lean();
  console.log("Name:", p.name);
  console.log("Description:", JSON.stringify(p.description));
  console.log("Installment:", JSON.stringify(p.installment, null, 2));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
