import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Replace with your bot token
const SECRET_HASH = "67e58fbahey833349df3383dc910e196"; // Replace with your own secret hash

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// get webhook information
// GET https://api.telegram.org/bot{my_bot_token}/getWebhookInfo

//api.telegram.org/bot{token}/setWebhook?url={url}/api/telegram-hook?secret_hash={secret_hash}

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const { message } = ctx;
  const channelUrl = "t.me/braihjulagg"

  // Welcome message with Markdown formatting
  const reply = `
🔥 Ready to boost your proxy game? 🔥
Join Brain (VPN AND DPN) and get free Residential Socks5 & Mobile proxies—no trials, no payments, just full access!

🌍 Tap into 30M+ clean IPs with 0 fraud score
📍 Enjoy country targeting for precision control
⚡ Surf at blazing 4G speeds—fast and reliable
🖥️ RDPs coming soon to expand your toolkit

🔗 Join the community now: [Click here to join Brain (VPN AND DPN)](${channelUrl})
  `;

  try {
    await ctx.reply(reply, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🚀 Join Brain (VPN AND DPN) Now!",
          url: channelUrl
        },
      ],
    ],
  },
});
    console.log(`Reply to ${COMMAND} command sent successfully.`);
  } catch (error) {
    console.error(`Something went wrong with the ${COMMAND} command:`, error);
  }
}

// Register the /start command handler
bot.command("start", async (ctx) => {
  await handleStartCommand(ctx);
});

// API route handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    // Set webhook if requested
    if (query.setWebhook === "true") {
      const webhookUrl = `${baseUrl}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    // Handle incoming updates from Telegram
    if (query.secret_hash == SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Error handling Telegram update:", error.toString());
  }

  // Acknowledge the request with Telegram
  res.status(200).send("OK");
};
