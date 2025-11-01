import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import "dotenv/config";

// Settings
const channelsWhitelist = process.env.CHANNELS_WHITELIST ? process.env.CHANNELS_WHITELIST.split(",") : [];
const channelsBlacklist = process.env.CHANNELS_BLACKLIST ? process.env.CHANNELS_BLACKLIST.split(",") : [];
const groupsToForward = process.env.GROUP_LIST ? process.env.GROUP_LIST.split(",") : [];

if (groupsToForward.length === 0) {
  console.error("Error: Specify at least 1 group to forward channels messages in .env");
  process.exit(1);
}

const puppeteerOptions = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--disable-dev-shm-usage",
    "--disable-session-crashed-bubble",
    "--start-maximized",
    "--disable-prompt-on-repost",
    "--disable-beforeunload",
    "--disable-features=InfiniteSessionRestore",
    "--window-name=channel-forwarder",
  ],
  headless: false,
};

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "channel-forwarder" }),
  puppeteer: puppeteerOptions,
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp Channel Forwarder client is ready!");
  console.log(`	Groups: [${groupsToForward.join(", ")}]`);
  console.log(`	Whitelist: [${channelsWhitelist.join(", ")}]`);
  console.log(`	Blacklist: [${channelsBlacklist.join(", ")}]`);
  console.log("Waiting for channel (@newsletter) messages...");
});

client.on("message", async (msg) => {
  if (!msg.from.includes("@newsletter")) {
    return;
  }

  const channelId = msg.from;

  if (channelsWhitelist.length > 0 && !channelsWhitelist.includes(channelId)) {
    console.log(`[${channelId}][ignored] Channel is not whitelisted.`);
    return;
  }

  if (channelsBlacklist.length > 0 && channelsBlacklist.includes(channelId)) {
    console.log(`[${channelId}][ignored] Channel is blacklisted.`);
    return;
  }

  try {
    const messageContent = msg.hasMedia ? await msg.downloadMedia() : msg.body;
    const opts = {
      caption: msg.hasMedia ? msg.body : undefined,
      sendMediaAsSticker: msg.type === "sticker",
      sendVideoAsGif: msg.isGif,
    };

    const msgSize = messageContent?.filesize ?? messageContent.length ?? "?";

    console.log(`[${channelId}][forwarding] Forwarding ${msg.type} message (${msgSize} bytes) to ${groupsToForward.length} groups.`);

    const forwardPromises = groupsToForward.map((group) => client.sendMessage(group, messageContent, opts));
    await Promise.all(forwardPromises);

    console.log(`[${channelId}][forwarded] Message forwarded to all groups.`);
  } catch (error) {
    console.error(`[${channelId}][error] Failed to forward message:`, error);
  }
});

client.initialize();
