/**
 * Test script to verify Telegram notifications are sent to all chat IDs
 * 
 * Usage: node test-telegram.js
 */

require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_IDS = (process.env.TELEGRAM_CHAT_ID || "").split(",").map(id => id.trim()).filter(Boolean);

console.log("🤖 Telegram Configuration Test");
console.log("=" .repeat(50));
console.log(`Bot Token: ${BOT_TOKEN ? "✅ Configured" : "❌ Missing"}`);
console.log(`Chat IDs: ${CHAT_IDS.length > 0 ? `✅ ${CHAT_IDS.length} configured` : "❌ Missing"}`);
console.log("");

if (!BOT_TOKEN) {
  console.error("❌ ERROR: TELEGRAM_BOT_TOKEN is not set in .env file");
  process.exit(1);
}

if (CHAT_IDS.length === 0) {
  console.error("❌ ERROR: TELEGRAM_CHAT_ID is not set in .env file");
  process.exit(1);
}

console.log("📋 Chat IDs:");
CHAT_IDS.forEach((id, index) => {
  console.log(`  ${index + 1}. ${id}`);
});
console.log("");

// Test message
const testMessage = `
🧪 Test Message - رسالة اختبار

🏪 متجر مؤسسة البلاد الحديثة للإلكترونيات

⏰ Time: ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}

This is a test message to verify the bot is working correctly.
If you received this message, the bot is working properly!

✅ Bot Status: Active
`.trim();

async function testTelegramBot() {
  console.log("🚀 Sending test message to all chat IDs...");
  console.log("");

  const results = await Promise.allSettled(
    CHAT_IDS.map(async (chat_id, index) => {
      console.log(`  Sending to Chat ${index + 1} (${chat_id})...`);
      
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id,
            text: testMessage,
            parse_mode: "HTML",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description || "Unknown error"}`);
      }

      return { chat_id, success: true, messageId: data.result?.message_id };
    })
  );

  console.log("");
  console.log("📊 Results:");
  console.log("=" .repeat(50));

  let successCount = 0;
  let failedCount = 0;

  results.forEach((result, index) => {
    const chat_id = CHAT_IDS[index];
    
    if (result.status === "fulfilled") {
      successCount++;
      console.log(`✅ Chat ${index + 1} (${chat_id}): Success`);
      console.log(`   Message ID: ${result.value.messageId}`);
    } else {
      failedCount++;
      console.log(`❌ Chat ${index + 1} (${chat_id}): Failed`);
      console.log(`   Error: ${result.reason.message}`);
    }
  });

  console.log("");
  console.log("=" .repeat(50));
  console.log(`✅ Success: ${successCount}/${CHAT_IDS.length}`);
  console.log(`❌ Failed: ${failedCount}/${CHAT_IDS.length}`);
  console.log("");

  if (failedCount > 0) {
    console.log("⚠️  Some messages failed to send. Common issues:");
    console.log("   1. Wrong chat ID");
    console.log("   2. Bot was blocked by user");
    console.log("   3. Bot doesn't have permission to send messages");
    console.log("   4. Chat ID is a group but bot is not admin");
    console.log("");
    console.log("💡 To fix:");
    console.log("   1. Make sure users have started the bot (/start)");
    console.log("   2. Check that chat IDs are correct");
    console.log("   3. For groups, add bot as admin");
  }

  if (successCount === CHAT_IDS.length) {
    console.log("🎉 All messages sent successfully!");
    console.log("✅ Telegram integration is working correctly.");
  }

  return { successCount, failedCount, total: CHAT_IDS.length };
}

// Run the test
testTelegramBot()
  .then(({ successCount, total }) => {
    process.exit(successCount === total ? 0 : 1);
  })
  .catch((error) => {
    console.error("");
    console.error("❌ CRITICAL ERROR:", error.message);
    console.error("");
    process.exit(1);
  });
