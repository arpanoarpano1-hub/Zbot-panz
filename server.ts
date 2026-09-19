import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Bot state simulating Baileys Node.js session
let botState = {
  phoneNumber: "",
  botName: "Zbot afan",
  prefix: ".",
  status: "unregistered" as "unregistered" | "generating_code" | "awaiting_pair" | "verifying" | "connected" | "disconnected",
  pairingCode: "",
  codeExpiresAt: 0,
  linkedAt: null as number | null,
  expiredAt: null as number | null,
  planName: "Gratis Selamanya (Lisensi Afan)",
  batteryLevel: 94,
  isCharging: true,
  pingMs: 24,
  uptimeSeconds: 14280,
  messagesProcessed: 1845,
  commandsExecuted: 923,
  groupsCount: 4,
  isPublic: true,
  autoRead: false,
  antiCall: true,
  stickerWatermark: {
    packname: "Zbot afan",
    author: "Afan Official (08216787681)",
  },
  ownerNumber: "08216787681",
  ownerName: "Afan",
  isFreeAccess: true,
  premiumUsers: [
    "628216787681@s.whatsapp.net (Afan - Super Owner)",
    "6281234567890@s.whatsapp.net (VIP Member)",
  ],
};

// In-memory rental groups managed by owner
let rentalGroups = [
  { id: "1203630283719@g.us", name: "Komunitas Developers & Bot WA ID", daysLeft: 365, status: "Aktif (Gratis Afan)" },
  { id: "1203631982736@g.us", name: "Grup Mabar MLBB & Sharing Sticker", daysLeft: 180, status: "Aktif" },
  { id: "1203639847123@g.us", name: "Marketplace & Jual Beli Amanah", daysLeft: 90, status: "Aktif" },
];

// Generate 8-character pairing code formatted as XXXX-XXXX (Standard Baileys WA pairing format)
function generatePairingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${part1}-${part2}`;
}

// Clean phone number (convert 08xx to 628xx, remove spaces and symbols)
function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (!cleaned.startsWith("62") && cleaned.length >= 9 && cleaned.length <= 13) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

// Gemini client (lazy initialization)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize Gemini client:", e);
    }
  }
  return geminiClient;
}

// ================= API ROUTES =================

// 1. Get bot session status
app.get("/api/bot/status", (req, res) => {
  res.json({
    success: true,
    session: botState,
    nodeVersion: process.version,
    platform: process.platform,
    baileysVersion: "6.7.8 (Multi-Device)",
  });
});

// 2. Request pairing code for phone number
app.post("/api/bot/request-pairing", (req, res) => {
  const { phoneNumber, botName, prefix } = req.body;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return res.status(400).json({ success: false, message: "Nomor telepon WhatsApp wajib diisi!" });
  }

  const cleanedPhone = cleanPhoneNumber(phoneNumber);
  if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
    return res.status(400).json({
      success: false,
      message: "Nomor WhatsApp tidak valid. Format contoh: 6281234567890 atau 081234567890",
    });
  }

  const code = generatePairingCode();
  const expiresAt = Date.now() + 180 * 1000; // 3 minutes

  botState.phoneNumber = cleanedPhone;
  if (botName) botState.botName = botName;
  if (prefix) botState.prefix = prefix;
  botState.pairingCode = code;
  botState.codeExpiresAt = expiresAt;
  botState.status = "awaiting_pair";

  res.json({
    success: true,
    message: "Kode pairing WhatsApp berhasil di-generate!",
    pairingCode: code,
    phoneNumber: cleanedPhone,
    expiresAt,
  });
});

// 3. Simulate or complete WhatsApp pairing verification
app.post("/api/bot/simulate-link", (req, res) => {
  if (!botState.phoneNumber || !botState.pairingCode) {
    return res.status(400).json({ success: false, message: "Belum ada permintaan pairing aktif." });
  }

  botState.status = "connected";
  botState.linkedAt = Date.now();
  botState.expiredAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  botState.batteryLevel = Math.floor(Math.random() * 20) + 80;
  botState.pingMs = Math.floor(Math.random() * 25) + 15;

  res.json({
    success: true,
    message: "Koneksi WhatsApp Web Socket berhasil terhubung (Multi-Device Active)!",
    session: botState,
  });
});

// 4. Disconnect bot
app.post("/api/bot/disconnect", (req, res) => {
  botState.status = "disconnected";
  botState.pairingCode = "";
  botState.linkedAt = null;

  res.json({
    success: true,
    message: "Bot WhatsApp telah diputuskan koneksinya.",
    session: botState,
  });
});

// 5. Update bot settings
app.post("/api/bot/update-settings", (req, res) => {
  const { botName, prefix, isPublic, autoRead, antiCall, stickerWatermark, planName } = req.body;

  if (botName) botState.botName = botName;
  if (prefix) botState.prefix = prefix;
  if (typeof isPublic === "boolean") botState.isPublic = isPublic;
  if (typeof autoRead === "boolean") botState.autoRead = autoRead;
  if (typeof antiCall === "boolean") botState.antiCall = antiCall;
  if (stickerWatermark) botState.stickerWatermark = stickerWatermark;
  if (planName) botState.planName = planName;

  res.json({
    success: true,
    message: "Pengaturan bot berhasil diperbarui!",
    session: botState,
  });
});

// 5b. Get Owner Data
app.get("/api/bot/owner/data", (req, res) => {
  res.json({
    success: true,
    ownerNumber: botState.ownerNumber,
    ownerName: botState.ownerName,
    isFreeAccess: botState.isFreeAccess,
    premiumUsers: botState.premiumUsers,
    rentalGroups: rentalGroups,
  });
});

// 5c. Owner Add Premium
app.post("/api/bot/owner/add-prem", (req, res) => {
  const { phoneNumber, duration } = req.body;
  if (!phoneNumber) return res.status(400).json({ success: false, message: "Nomor target wajib diisi!" });
  const cleaned = cleanPhoneNumber(phoneNumber);
  const dur = duration || "Permanen (Bebas)";
  const entry = `${cleaned}@s.whatsapp.net (Aktif: ${dur})`;
  if (!botState.premiumUsers.includes(entry)) {
    botState.premiumUsers.push(entry);
  }
  res.json({
    success: true,
    message: `Berhasil menambahkan ${cleaned} ke Premium (${dur}) secara gratis!`,
    premiumUsers: botState.premiumUsers,
  });
});

// 5d. Owner Del Premium
app.post("/api/bot/owner/del-prem", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ success: false, message: "Nomor target wajib diisi!" });
  const cleaned = cleanPhoneNumber(phoneNumber);
  botState.premiumUsers = botState.premiumUsers.filter((u) => !u.includes(cleaned));
  res.json({
    success: true,
    message: `Berhasil menghapus status premium ${cleaned}`,
    premiumUsers: botState.premiumUsers,
  });
});

// 5e. Owner Add Sewa
app.post("/api/bot/owner/add-sewa", (req, res) => {
  const { groupName, days } = req.body;
  const gName = groupName || "Grup Baru Komunitas";
  const d = parseInt(days) || 30;
  const newId = `120363${Math.floor(100000000 + Math.random() * 900000000)}@g.us`;
  rentalGroups.push({ id: newId, name: gName, daysLeft: d, status: "Aktif (Gratis Afan)" });
  res.json({
    success: true,
    message: `Sewa grup ${gName} berhasil diaktifkan selama ${d} hari gratis!`,
    rentalGroups,
  });
});

// 5f. Owner Extend Sewa
app.post("/api/bot/owner/extend-sewa", (req, res) => {
  const { groupId, days } = req.body;
  const d = parseInt(days) || 30;
  const target = rentalGroups.find((g) => g.id === groupId) || rentalGroups[0];
  if (target) {
    target.daysLeft += d;
    res.json({
      success: true,
      message: `Berhasil memperpanjang sewa ${target.name} sebanyak +${d} hari!`,
      rentalGroups,
    });
  } else {
    res.status(404).json({ success: false, message: "Grup tidak ditemukan" });
  }
});

// 6. Execute simulated bot command in terminal
app.post("/api/bot/execute-command", async (req, res) => {
  const { command, senderName = "User" } = req.body;
  if (!command || typeof command !== "string") {
    return res.status(400).json({ success: false, message: "Command harus diisi." });
  }

  botState.commandsExecuted += 1;
  botState.messagesProcessed += 2;

  const trimmed = command.trim();
  const currentPrefix = botState.prefix;
  const cmd = trimmed.startsWith(currentPrefix)
    ? trimmed.slice(currentPrefix.length).trim()
    : trimmed;

  const [cmdName, ...args] = cmd.split(/\s+/);
  const lowerCmd = cmdName.toLowerCase();
  const query = args.join(" ");

  // AI Command handler (Gemini Powered)
  if (["ai", "ask", "tanya", "gemini"].includes(lowerCmd)) {
    if (!query) {
      return res.json({
        success: true,
        response: `*🤖 ${botState.botName} - AI Assistant*\n\nSilakan masukkan pertanyaan setelah perintah.\nContoh: \`${currentPrefix}ai jelaskan apa itu Node.js dan Baileys WhatsApp?\``,
      });
    }

    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Kamu adalah asisten bot WhatsApp cerdas berbahasa Indonesia ramah, santai tapi akurat. Jawab pertanyaan berikut dengan ringkas, jelas, dan format ala WhatsApp (gunakan *tebal* untuk poin penting). Pertanyaan: "${query}"`,
        });

        const replyText = response.text || "Maaf, AI tidak memberikan respon.";
        return res.json({
          success: true,
          response: `*🤖 [GEMINI AI SMART RESPONSE]*\n\n${replyText}\n\n_⚡ Powered by Google Gemini & Node.js Engine_`,
        });
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local assistant:", err);
    }

    // Fallback smart response
    return res.json({
      success: true,
      response: `*🤖 ${botState.botName} - AI Assistant*\n\nJawaban untuk: *"${query}"*\n\nNode.js adalah JavaScript runtime yang efisien dan asinkron, sementara Baileys adalah library open-source tanpa browser berbasis WebSocket untuk menghubungkan bot WhatsApp langsung melalui pairing code.\n\n_⚡ Status AI: Online | Latency: 22ms_`,
    });
  }

  // Sticker Command
  if (["s", "sticker", "stiker"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*✅ [STIKER BERHASIL DIBUAT]*\n\n*• Packname:* ${botState.stickerWatermark.packname}\n*• Author:* ${botState.stickerWatermark.author}\n*• Resolusi:* 512x512 WebP\n*• Animasi:* Static/Animated Auto-Detect\n\n_Stiker terkirim langsung ke pesan Anda!_ 🎨✨`,
      mediaType: "sticker",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    });
  }

  // Antilink Command
  if (["antilink", "al"].includes(lowerCmd)) {
    const action = args[0]?.toLowerCase();
    if (action === "on") {
      return res.json({
        success: true,
        response: `*🛡️ [ANTILINK GRUP AKTIF]*\n\nSistem pengaman grup telah *DIAKTIFKAN*.\n• Mode: Otomatis Hapus Pesan Link & Peringatan\n• Tindakan: Kick member jika mengirim link undangan grup lain.`,
      });
    } else if (action === "off") {
      return res.json({
        success: true,
        response: `*🛡️ [ANTILINK GRUP NONAKTIF]*\n\nSistem deteksi link grup telah *DIMATIKAN* oleh admin.`,
      });
    }
    return res.json({
      success: true,
      response: `*🛡️ PANDUAN ANTILINK CEPAT*\n\nGunakan perintah singkat:\n• \`${currentPrefix}al on\` (Aktifkan)\n• \`${currentPrefix}al off\` (Matikan)\n• \`${currentPrefix}al kick\` (Mode langsung tendang)`,
    });
  }

  // Antispam Command
  if (["antispam", "as"].includes(lowerCmd)) {
    const action = args[0]?.toLowerCase() || "on";
    return res.json({
      success: true,
      response: `*⚡ [ANTI-SPAM & FLOOD SHIELD]*\n\nStatus: *${action.toUpperCase()}*\n• Batas pesan: Maks 5 pesan per 10 detik\n• Sanksi: Peringatan ke-1 ➔ Mute 10 Menit ➔ Kick otomatis`,
    });
  }

  // Hidetag Command
  if (["hidetag", "ht"].includes(lowerCmd)) {
    const textAnnounce = query || "Perhatian untuk seluruh anggota grup!";
    return res.json({
      success: true,
      response: `*📢 [PENGUMUMAN HIDETAG]*\n\n${textAnnounce}\n\n_Tag tersembunyi ke 482 member grup terkirim!_ 👥🔔`,
    });
  }

  // Tagall Command
  if (["tagall", "ta"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*👥 [TAG ALL ANGGOTA GRUP]*\n\nPesan: ${query || "Halo semuanya!"}\n\n1. @6281298765432\n2. @6285712345678\n3. @6289654321098\n4. @6282133445566\n\n_Seluruh anggota berhasil disebut!_ ✨`,
    });
  }

  // Kick member short command
  if (["kick", "k"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*👢 [KICK MEMBER BERHASIL]*\n\nAnggota target telah dikeluarkan dari grup sesuai instruksi admin.`,
    });
  }

  // Group open/close short command
  if (["group", "g"].includes(lowerCmd)) {
    const act = args[0]?.toLowerCase();
    if (act === "close" || act === "c" || act === "tutup") {
      return res.json({
        success: true,
        response: `*🔒 [GRUP DITUTUP]*\nHanya admin yang dapat mengirim pesan ke grup ini.`,
      });
    }
    return res.json({
      success: true,
      response: `*🔓 [GRUP DIBUKA]*\nSeluruh anggota kini dapat mengirim pesan di grup ini.`,
    });
  }

  // TikTok Downloader short command
  if (["tiktok", "tt"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*📥 [TIKTOK DOWNLOADER NO WATERMARK]*\n\n*• Judul:* Video Tren TikTok Indonesia\n*• Author:* @creator_pro\n*• Resolusi:* 1080p HD (MP4)\n*• Durasi:* 00:45 Detik\n\n_Video sedang dikirimkan ke chat Anda..._ 🎬🍿`,
    });
  }

  // Instagram Downloader short command
  if (["instagram", "ig"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*📸 [INSTAGRAM REELS DOWNLOADER]*\n\n*• Tipe:* Instagram Reel / Video Post\n*• Kualitas:* High Definition 1080p\n\n_Media berhasil diunduh dan terkirim!_ ✨`,
    });
  }

  // YouTube MP3 / MP4 short command
  if (["yt", "ytmp4"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🎥 [YOUTUBE VIDEO DOWNLOADER]*\n\n*• Judul:* Tutorial WhatsApp Bot Node.js 2026\n*• Kualitas:* 720p HD\n*• Ukuran:* 14.2 MB\n\n_File video sedang dikirimkan..._`,
    });
  }

  if (["mp3", "ytmp3"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🎵 [YOUTUBE AUDIO MP3]*\n\n*• Bitrate:* 320 kbps (Crystal Clear)\n*• Format:* Audio MP3 Asli\n\n_Lagu sedang dikirimkan ke chat Anda..._ 🎧`,
    });
  }

  // RemoveBG short command
  if (["removebg", "bg", "nobg"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*✂️ [REMOVE BACKGROUND SUKSES]*\n\nLatar belakang foto telah dihapus transparan menggunakan AI deteksi subjek. File PNG/Stiker terkirim! 🖼️✨`,
    });
  }

  // Voice Note short command
  if (["tovn", "vn"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🎙️ [CONVERT TO VOICE NOTE]*\n\nFile audio berhasil dikonversi ke pesan suara asli (PTT Hijau WhatsApp).`,
    });
  }

  // Speed / Ping
  if (["speed", "ping", "sp"].includes(lowerCmd)) {
    const speed = Math.floor(Math.random() * 8) + 15;
    return res.json({
      success: true,
      response: `*⚡ [PONG / SPEEDTEST BOT]*\n\n*• Response Time:* ${speed} ms\n*• Engine:* Node.js ${process.version} (LTS)\n*• Heap Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n*• OS Server:* Ubuntu Linux / macOS Darwin\n*• Status:* Standby & Anti-Lag (Zero Delay)`,
    });
  }

  // Cek Sewa
  if (["ceksewa", "sewa", "cs"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*📋 [INFORMASI SEWA BOT WHATSAPP]*\n\n*• Nomor Bot:* +${botState.phoneNumber || "628xxxxxxxxxx"}\n*• Paket Sewa:* ${botState.planName}\n*• Status:* Aktif Normal (Online)\n*• Sisa Masa Aktif:* 28 Hari 14 Jam\n*• Uptime Server:* 99.98%\n*• Grup Terdaftar:* 4 Grup Aktif\n\n_Perpanjang sewa hubungi admin atau ketik ${currentPrefix}addsewa._`,
    });
  }

  // Menu command (SUPER RAPI, BERGARIS BAGUS & LOGO TERATUR)
  if (["menu", "help", "fitur", "m"].includes(lowerCmd)) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";
    const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

    return res.json({
      success: true,
      response: `╭━━━〔 🤖 *${botState.botName.toUpperCase()}* 〕━━━╮
┃ 👤 *Pengguna* : ${senderName}
┃ 👑 *Status*   : Member Sewa VIP
┃ ⚡ *Engine*   : Node.js (Baileys Multi-Device)
┃ 🖥️ *Server*   : Ubuntu 22.04 LTS / macOS
┃ 🚀 *Speed*    : 18ms (Anti-Lag Zero Delay)
┃ 📅 *Hari*     : ${dateStr}
┃ ⏰ *Pukul*    : ${timeStr}
┃ 🔑 *Prefix*   : [ *${currentPrefix}* ]
┃ 📦 *Total*    : 105+ Fitur Canggih
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭───「 🛡️ *PENGELOLA GRUP* 」
│ ⭔ *${currentPrefix}al*  / ${currentPrefix}antilink [on/off]
│ ⭔ *${currentPrefix}as*  / ${currentPrefix}antispam [on/off]
│ ⭔ *${currentPrefix}vx*  / ${currentPrefix}antivirtex [on/off]
│ ⭔ *${currentPrefix}vo*  / ${currentPrefix}antiviewonce [on/off]
│ ⭔ *${currentPrefix}ht*  / ${currentPrefix}hidetag [pesan]
│ ⭔ *${currentPrefix}ta*  / ${currentPrefix}tagall
│ ⭔ *${currentPrefix}k*   / ${currentPrefix}kick [@user]
│ ⭔ *${currentPrefix}add* / ${currentPrefix}tambah [nomor]
│ ⭔ *${currentPrefix}p*   / ${currentPrefix}promote [@user]
│ ⭔ *${currentPrefix}d*   / ${currentPrefix}demote [@user]
│ ⭔ *${currentPrefix}g*   / ${currentPrefix}group [open/close]
│ ⭔ *${currentPrefix}w*   / ${currentPrefix}welcome [on/off]
│ ⭔ *${currentPrefix}vt*  / ${currentPrefix}vote [judul|opsi]
│ ⭔ *${currentPrefix}pp*  / ${currentPrefix}setppgc
│ ⭔ *${currentPrefix}sn*  / ${currentPrefix}setnamegc
│ ⭔ *${currentPrefix}sd*  / ${currentPrefix}setdesc
╰───────────────────────────

╭───「 🎨 *STIKER & AUDIO* 」
│ ⭔ *${currentPrefix}s*   / ${currentPrefix}sticker
│ ⭔ *${currentPrefix}sw*  / ${currentPrefix}swm [pack|author]
│ ⭔ *${currentPrefix}bg*  / ${currentPrefix}removebg
│ ⭔ *${currentPrefix}sc*  / ${currentPrefix}sircle
│ ⭔ *${currentPrefix}sm*  / ${currentPrefix}smeme [atas|bawah]
│ ⭔ *${currentPrefix}qc*  / ${currentPrefix}quotely [teks]
│ ⭔ *${currentPrefix}vn*  / ${currentPrefix}tovn
│ ⭔ *${currentPrefix}bs*  / ${currentPrefix}bass [1-20]
│ ⭔ *${currentPrefix}nc*  / ${currentPrefix}nightcore
│ ⭔ *${currentPrefix}sl*  / ${currentPrefix}slowmo
│ ⭔ *${currentPrefix}rv*  / ${currentPrefix}reverse
│ ⭔ *${currentPrefix}ttp* / ${currentPrefix}attp [teks]
╰───────────────────────────

╭───「 🧠 *GEMINI & AI* 」
│ ⭔ *${currentPrefix}ai*  / ${currentPrefix}gemini [tanya]
│ ⭔ *${currentPrefix}img* / ${currentPrefix}aiimg [prompt]
│ ⭔ *${currentPrefix}hd*  / ${currentPrefix}remini [reply foto]
│ ⭔ *${currentPrefix}tts* / ${currentPrefix}voice [teks]
│ ⭔ *${currentPrefix}tr*  / ${currentPrefix}trans [id/en teks]
│ ⭔ *${currentPrefix}vs*  / ${currentPrefix}vision [reply foto]
│ ⭔ *${currentPrefix}ocr* / ${currentPrefix}baca [reply dokumen]
│ ⭔ *${currentPrefix}sot* / ${currentPrefix}soundoftext [teks]
│ ⭔ *${currentPrefix}ps*  / ${currentPrefix}persona [karakter]
╰───────────────────────────

╭───「 📥 *DOWNLOADER* 」
│ ⭔ *${currentPrefix}tt*  / ${currentPrefix}tiktok [link]
│ ⭔ *${currentPrefix}ig*  / ${currentPrefix}instagram [link]
│ ⭔ *${currentPrefix}yt*  / ${currentPrefix}ytmp4 [link]
│ ⭔ *${currentPrefix}mp3* / ${currentPrefix}ytmp3 [link]
│ ⭔ *${currentPrefix}sp*  / ${currentPrefix}spotify [judul]
│ ⭔ *${currentPrefix}fb*  / ${currentPrefix}facebook [link]
│ ⭔ *${currentPrefix}mf*  / ${currentPrefix}mediafire [link]
│ ⭔ *${currentPrefix}pin* / ${currentPrefix}pinterest [kata]
│ ⭔ *${currentPrefix}sc*  / ${currentPrefix}soundcloud [link]
│ ⭔ *${currentPrefix}git* / ${currentPrefix}gitclone [url repo]
╰───────────────────────────

╭───「 🛠️ *UTILITAS & VPS* 」
│ ⭔ *${currentPrefix}vps* / ${currentPrefix}vpsinfo
│ ⭔ *${currentPrefix}sp*  / ${currentPrefix}speed
│ ⭔ *${currentPrefix}ip*  / ${currentPrefix}cekip
│ ⭔ *${currentPrefix}cu*  / ${currentPrefix}cuaca [kota]
│ ⭔ *${currentPrefix}gm*  / ${currentPrefix}gempa
│ ⭔ *${currentPrefix}js*  / ${currentPrefix}jadwalsholat [kota]
│ ⭔ *${currentPrefix}ks*  / ${currentPrefix}kurs [USD IDR]
│ ⭔ *${currentPrefix}b64* / ${currentPrefix}base64 [teks]
│ ⭔ *${currentPrefix}gc*  / ${currentPrefix}cleanram
╰───────────────────────────

╭───「 🎮 *GAMES & FUN* 」
│ ⭔ *${currentPrefix}tg*  / ${currentPrefix}tebakgambar
│ ⭔ *${currentPrefix}cl*  / ${currentPrefix}caklontong
│ ⭔ *${currentPrefix}f1*  / ${currentPrefix}family100
│ ⭔ *${currentPrefix}ww*  / ${currentPrefix}werewolf
│ ⭔ *${currentPrefix}tk*  / ${currentPrefix}tebakkata
│ ⭔ *${currentPrefix}tl*  / ${currentPrefix}tebaklirik
│ ⭔ *${currentPrefix}mg*  / ${currentPrefix}mathgame
│ ⭔ *${currentPrefix}tb*  / ${currentPrefix}tebakbendera
╰───────────────────────────

╭───「 💎 *EKSKLUSIF & TIDAK PASARAN* 」
│ ⭔ *${currentPrefix}notul*  / ${currentPrefix}notulensi [AI Rangkum Rapat]
│ ⭔ *${currentPrefix}ghost*  / ${currentPrefix}vault [Pesan 1x Baca / PIN]
│ ⭔ *${currentPrefix}vsum*   / ${currentPrefix}transcribe [Voice Note ke Teks]
│ ⭔ *${currentPrefix}threat* / ${currentPrefix}scanlink [Cyber Anti-Phishing]
│ ⭔ *${currentPrefix}solve*  / ${currentPrefix}solver [AI Debug Kode & Math]
│ ⭔ *${currentPrefix}bill*   / ${currentPrefix}qris [Dynamic QRIS & Split Bill]
│ ⭔ *${currentPrefix}heal*   / ${currentPrefix}watchdog [Self-Healing Process]
╰───────────────────────────

╭───「 👑 *OWNER & SEWA* 」
│ ⭔ *${currentPrefix}cs*  / ${currentPrefix}ceksewa
│ ⭔ *${currentPrefix}asw* / ${currentPrefix}addsewa [hari]
│ ⭔ *${currentPrefix}bc*  / ${currentPrefix}broadcast [teks]
│ ⭔ *${currentPrefix}bk*  / ${currentPrefix}backupsession
│ ⭔ *${currentPrefix}res* / ${currentPrefix}restart
│ ⭔ *${currentPrefix}pre* / ${currentPrefix}addprem [@user]
│ ⭔ *${currentPrefix}mod* / ${currentPrefix}mode [public/self]
╰───────────────────────────

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 💡 *TIPS KETIK CEPAT :*
│ Gunakan perintah singkat 1-3 huruf
│ Contoh: *${currentPrefix}s* (bikin stiker)
│        *${currentPrefix}ht* (hidetag grup)
│        *${currentPrefix}tt* (unduh tiktok)
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ ✍️ *TANDA TANGAN RESMI :*
│ Pemilik & Pengembang : *Afan*
│ Original Bot         : *Zbot afan*
│ ID Sertifikat        : CERT-AFAN-ZBOT-2026
│ Status               : ✓ Sah & Terverifikasi
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
    });
  }

  // Owner & Official Signature Command
  if (["owner", "ttd", "signature", "creator", "pemilik"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*📜 [KARTU IDENTITAS & HAK AKSES SUPER OWNER]*
━━━━━━━━━━━━━━━━━━━━━━━
👑 *Nama Pemilik:* Afan
📱 *Nomor WhatsApp:* *08216787681* (+62 821-6787-681)
🤖 *Bot Resmi:* Zbot afan (Baileys Multi-Device)
💎 *Status Lisensi:* 100% GRATIS TANPA BIAYA
🔑 *Tingkat Hak Akses:* SUPER OWNER (Otoritas Penuh Tanpa Batas)
🆔 *ID Sertifikat:* CERT-AFAN-ZBOT-2026-ORIGINAL
🔐 *Digital Hash:* SHA256:7e8d3f1a9c04b862e5b7194f28dcafan009187326

✨ *Hak Istimewa Super Owner (Bebas Biaya):*
• Bebas Tambah User Premium: *${currentPrefix}addprem <nomor> [hari]*
• Bebas Hapus User Premium: *${currentPrefix}delprem <nomor>*
• Bebas Tambah Sewa Grup: *${currentPrefix}addsewa <link_grup> [hari]*
• Bebas Perpanjang Sewa: *${currentPrefix}perpanjangsewa <id_grup> [hari]*
• Bebas Hapus Sewa: *${currentPrefix}delsewa <id_grup>*
• Cek Daftar Premium: *${currentPrefix}listprem*
• Cek Daftar Sewa Aktif: *${currentPrefix}listsewa*

✍️ *Tanda Tangan Sah: Afan*
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Add Premium Command (.addprem / .addpremium)
  if (["addprem", "addpremium", "tambahprem"].includes(lowerCmd)) {
    const rawTarget = query.trim() || "6281234567890 30d";
    const parts = rawTarget.split(/\s+/);
    const targetPhone = parts[0];
    const duration = parts[1] || "Permanen (Bebas)";
    
    // Add to premium list in memory
    const formattedUser = `${targetPhone}@s.whatsapp.net (Aktif: ${duration})`;
    if (!botState.premiumUsers.includes(formattedUser)) {
      botState.premiumUsers.push(formattedUser);
    }

    return res.json({
      success: true,
      response: `*👑 [BERHASIL MENAMBAHKAN USER PREMIUM]*
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Nomor Target:* \`${targetPhone}\`
⏳ *Durasi Masa Aktif:* *${duration}*
💰 *Biaya Transaksi:* *Rp 0 (GRATIS - Lisensi Afan)*
🔑 *Otoritas Eksekusi:* Super Owner *Afan* (08216787681)
📊 *Total User Premium:* ${botState.premiumUsers.length} Pengguna

✨ *Keuntungan User Premium:*
• Akses tanpa limit ke 112+ Fitur Zbot afan
• Prioritas AI Gemini & Downloader Super Cepat
• Bebas gunakan fitur Eksklusif (Ghost Vault, Voice Transcriber, Threat Scanner)

_Status user premium telah aktif seketika di database bot._
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Delete Premium Command (.delprem / .deleteprem)
  if (["delprem", "deleteprem", "hapusprem"].includes(lowerCmd)) {
    const targetPhone = query.trim() || "6281234567890";
    botState.premiumUsers = botState.premiumUsers.filter(u => !u.includes(targetPhone));

    return res.json({
      success: true,
      response: `*🗑️ [HAPUS STATUS PREMIUM SELESAI]*
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Nomor Target:* \`${targetPhone}\`
🚫 *Status Terkini:* Regular User
🔑 *Otoritas Eksekusi:* Super Owner *Afan* (08216787681)
📊 *Sisa User Premium:* ${botState.premiumUsers.length} Pengguna

_Pengguna kembali menggunakan kuota standar._
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Add Sewa Command (.addsewa / .sewa)
  if (["addsewa", "sewa", "tambahsewa"].includes(lowerCmd)) {
    const rawInput = query.trim() || "Grup Komunitas Baru 30";
    const parts = rawInput.split(/\s+/);
    const days = parseInt(parts[parts.length - 1]) || 30;
    const groupName = parts.slice(0, -1).join(" ") || "Grup WhatsApp";
    const newGroupId = `120363${Math.floor(100000000 + Math.random() * 900000000)}@g.us`;
    
    rentalGroups.push({
      id: newGroupId,
      name: groupName,
      daysLeft: days,
      status: "Aktif (Gratis Afan)",
    });

    return res.json({
      success: true,
      response: `*🎉 [SEWA GRUP BERHASIL DIAKTIFKAN]*
━━━━━━━━━━━━━━━━━━━━━━━
👥 *Nama Grup:* *${groupName}*
🆔 *ID Grup:* \`${newGroupId}\`
⏳ *Masa Aktif Sewa:* *${days} Hari* (Bebas Perpanjang)
💰 *Tarif Sewa:* *Rp 0 (GRATIS TANPA BIAYA)*
👑 *Diberikan Oleh:* Super Owner *Afan* (08216787681)

🤖 *Status Bot di Grup:*
• Bot siap join & aktif mengelola grup 24 jam
• Fitur otomatis: Anti-Link, Anti-Virtex, Welcome, AI Rangkum Rapat
• Bot tidak akan keluar sebelum masa sewa berakhir

Ketik \`${currentPrefix}cs\` di grup untuk cek masa aktif kapan saja.
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Perpanjang Sewa Command (.perpanjangsewa / .extendsewa)
  if (["perpanjangsewa", "extendsewa", "tambahdurasi", "renewsewa"].includes(lowerCmd)) {
    const rawInput = query.trim() || "30";
    const addedDays = parseInt(rawInput) || 30;
    
    // Perpanjang grup pertama sebagai demo / aktif
    if (rentalGroups.length > 0) {
      rentalGroups[0].daysLeft += addedDays;
    }

    return res.json({
      success: true,
      response: `*⚡ [PERPANJANG MASA SEWA SUKSES]*
━━━━━━━━━━━━━━━━━━━━━━━
👥 *Target:* ${rentalGroups[0]?.name || "Grup Utama"}
➕ *Tambahan Durasi:* *+${addedDays} Hari*
📅 *Total Masa Aktif Baru:* *${rentalGroups[0]?.daysLeft || 395} Hari*
💰 *Biaya Tambahan:* *Rp 0 (100% Bebas Biaya)*
👑 *Super Owner Otoritas:* *Afan* (08216787681)

_Bot Zbot afan tetap setia mendampingi & mengamankan grup Anda tanpa jeda!_
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Del Sewa Command (.delsewa / .hapussewa)
  if (["delsewa", "hapussewa", "endsewa"].includes(lowerCmd)) {
    const removed = rentalGroups.pop();
    return res.json({
      success: true,
      response: `*🛑 [SEWA GRUP DINONAKTIFKAN]*
━━━━━━━━━━━━━━━━━━━━━━━
👥 *Grup:* ${removed ? removed.name : "Grup Terpilih"}
⚠️ *Status:* Masa sewa dihentikan oleh Owner Afan (08216787681).
🚪 *Tindakan Bot:* Mengirim pesan perpisahan dan siap meninggalkan grup.
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // List Premium Command (.listprem)
  if (["listprem", "listpremium"].includes(lowerCmd)) {
    const userList = botState.premiumUsers.map((u, i) => `${i + 1}. 👑 ${u}`).join("\n");
    return res.json({
      success: true,
      response: `*👑 [DAFTAR PENGGUNA PREMIUM ZBOT AFAN]*
━━━━━━━━━━━━━━━━━━━━━━━
*Super Owner Utama:*
⭐ *Afan* (08216787681) - Akses Otoritas Mutlak

*Daftar Member Premium Aktif:*
${userList}

💰 *Sistem Lisensi:* Bebas & Gratis Dikelola oleh Afan
Ketik \`${currentPrefix}addprem <nomor>\` untuk menambah pengguna baru.
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // List Sewa Command (.listsewa)
  if (["listsewa", "daftarrent", "sewalist"].includes(lowerCmd)) {
    const grpList = rentalGroups.map((g, i) => `${i + 1}. 🏢 *${g.name}*\n   ├ Sisa: *${g.daysLeft} Hari*\n   └ ID: \`${g.id}\``).join("\n\n");
    return res.json({
      success: true,
      response: `*📋 [DAFTAR GRUP SEWA AKTIF - ZBOT AFAN]*
━━━━━━━━━━━━━━━━━━━━━━━
👑 *Owner Pengelola:* Afan (08216787681)
🏢 *Total Grup Terhubung:* ${rentalGroups.length} Grup

${grpList}

💡 *Otoritas Owner:*
Bebas perpanjang masa sewa ketik \`${currentPrefix}perpanjangsewa 30\` kapan saja tanpa dipungut biaya!
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Cek Sewa Command (.cs / .ceksewa)
  if (["cs", "ceksewa", "infosewa"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*⏱️ [INFORMASI MASA AKTIF SEWA BOT]*
━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Grup:* Komunitas Developers & Bot WA ID
📅 *Sisa Masa Aktif:* *365 Hari (Aktif Permanen)*
👑 *Pemilik Resmi Bot:* Afan (08216787681)
💎 *Paket:* Gratis Selamanya / Bebas Biaya
⚡ *Status Server:* Online (Ubuntu 22.04 LTS Node.js Baileys)

_Butuh perpanjangan? Hubungi langsung Owner Afan di 08216787681 (Bebas biaya)._
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // VPS / OS Info command
  if (["vpsinfo", "vps", "server", "neofetch"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🖥️ [SPESIFIKASI SERVER UBUNTU & MACOS]*
━━━━━━━━━━━━━━━━━━━━━━━
*• Operating System:* Ubuntu 22.04 LTS (Jammy) / macOS Darwin ARM64
*• CPU Architecture:* x86_64 / Apple Silicon M-Series
*• Kernel Version:* Linux 6.2.0-generic
*• Node.js Version:* ${process.version} (LTS High Speed)
*• V8 Heap Used:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / 1024 MB
*• Resident Set Size (RSS):* ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
*• Event Loop Delay:* 0.12 ms (Zero Lag)
*• WhatsApp Engine:* Baileys WebSocket v6.7.8 (No Browser)
*• Uptime Server:* 14 Hari 6 Jam 32 Menit
━━━━━━━━━━━━━━━━━━━━━━━
_⚡ Server siap menangani ratusan grup dengan response kilat!_`,
    });
  }

  // Anti-Virtex Command
  if (["antivirtex", "anticrash"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🛡️ [ANTI-VIRTEX DEFENDER AKTIF]*\n\nSistem proteksi virtex grup telah *DIAKTIFKAN*.\n• Mode: Deteksi teks unicode berbahaya & crash string (>10.000 karakter)\n• Tindakan: Otomatis hapus pesan perusak & auto-kick pengirim seketika.`,
    });
  }

  // Anti-ViewOnce Command
  if (["antiviewonce", "antivo"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*👁️ [ANTI-VIEWONCE AKTIF]*\n\nBot akan otomatis mengunduh media sekali lihat (foto/video view once) dan mengirimkannya kembali ke grup sebagai media biasa agar tidak hilang.`,
    });
  }

  // Backup Session Command
  if (["backupsession", "backupsesi"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*📦 [BACKUP SESI BAILEYS BERHASIL]*\n\nFolder autentikasi \`session_auth\` berhasil dikompresi ke \`session-backup-${Date.now()}.zip\` (1.4 MB) dan telah dikirimkan ke nomor WhatsApp Owner untuk keamanan data anti-logout.`,
    });
  }

  // 1. AI Notulensi Rapat & Action Items (.notul / .notulensi)
  if (["notulensi", "notul", "sumchat", "rangkumrapat"].includes(lowerCmd)) {
    const targetCount = query.trim() || "35";
    return res.json({
      success: true,
      response: `*📋 [NOTULENSI RAPAT OTOMATIS - ZBOT AFAN]*
━━━━━━━━━━━━━━━━━━━━━━━
📅 *Tanggal:* ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
🕒 *Waktu Analisis:* ${new Date().toLocaleTimeString("id-ID")} WIB
📊 *Data Dianalisis:* ${targetCount} obrolan terakhir grup

📌 *1. TOPIK UTAMA DISKUSI:*
• Evaluasi jadwal rilis fitur bot WhatsApp & kesiapan pairing server Ubuntu
• Pembagian tugas teknis modul anti-phishing & sistem sewa QRIS

✅ *2. KEPUTUSAN BERSAMA:*
• Seluruh grup resmi wajib mengaktifkan modul Anti-Virtex & Anti-Link
• Periode uji coba trial 3 hari diberikan otomatis untuk member baru
• Rapat mingguan disepakati setiap Jumat pukul 20:00 WIB

🎯 *3. ACTION ITEMS & PENANGGUNG JAWAB (PIC):*
• @afan (Owner) ➔ Deploy patch optimasi RAM Baileys ke VPS (Deadline: Esok 12:00)
• @admin1 ➔ Verifikasi pembayaran sewa via kode QRIS otomatis
• @member2 ➔ Uji coba filter scan link berbahaya di grup diskusi

✍️ _Notulensi disusun otomatis oleh engine AI Zbot afan (Karya Afan)._
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 2. Ghost Vault - Enkripsi 1x Baca (.ghost / .vault)
  if (["vault", "ghost", "rahasia", "1xbaca"].includes(lowerCmd)) {
    const vaultId = "GHOST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const pin = Math.floor(1000 + Math.random() * 9000);
    return res.json({
      success: true,
      response: `*👻 [GHOST VAULT - PESAN RAHASIA 1X BACA]*
━━━━━━━━━━━━━━━━━━━━━━━
Pesan rahasia Anda berhasil dienkripsi dengan standar *AES-256-GCM*!

🔐 *Token Vault:* \`${vaultId}\`
🔑 *PIN Buka Kunci:* \`${pin}\`
⏳ *Masa Berlaku:* 5 Menit atau 1x Dibuka
💥 *Auto-Destruct:* Pesan otomatis terhapus permanen dari memori setelah dibaca penerima.

*Format Akses Penerima:*
Ketik \`${currentPrefix}open ${vaultId} ${pin}\` untuk mendekripsi pesan ini.

_Keamanan privasi tingkat tinggi, tidak meninggalkan jejak log di server!_
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 3. Voice Note Transcriber & AI Summary (.vsum / .transcribe)
  if (["transcribe", "vsum", "vn2text", "suarateks"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🎙️ [VOICE NOTE TRANSCRIBER & AI SUMMARY]*
━━━━━━━━━━━━━━━━━━━━━━━
⏱️ *Durasi Audio:* 01 menit 42 detik
🗣️ *Akurasi Bahasa:* Indonesia (99.2% Confidence)

📝 *Hasil Transkrip Teks:*
_"Halo bro, mau ngingetin nanti sore jam 4 kita langsung sinkronisasi token bot WhatsApp ke server. Tolong pastikan script PM2 sudah running di port 3000 ya, biar pairing code dari HP langsung nyambung tanpa putus."_

💡 *Intisari 3 Poin AI:*
1. Jadwal sinkronisasi bot WhatsApp sore ini pukul 16:00 WIB.
2. Port 3000 pada PM2 server harus dipastikan aktif.
3. Pairing code ponsel siap ditautkan secara realtime.
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 4. Cyber Deep Threat & Anti-Phishing Scanner (.threat / .scanlink)
  if (["threat", "scanlink", "ceklink", "antiphishing"].includes(lowerCmd)) {
    const targetUrl = query.trim() || "https://claim-saldo-dana-gratis2026.xyz";
    const isSuspicious = targetUrl.includes("dana") || targetUrl.includes("promo") || targetUrl.includes("xyz") || targetUrl.includes("free");
    return res.json({
      success: true,
      response: `*🛡️ [CYBER DEEP THREAT SCANNER]*
━━━━━━━━━━━━━━━━━━━━━━━
🔍 *Target URL:* \`${targetUrl}\`
🌐 *IP Address / Host:* 104.21.45.192 (Cloudflare CDN)
📜 *Sertifikat SSL:* ${isSuspicious ? "⚠️ Let's Encrypt (Usia Domain Baru: 3 Hari)" : "✅ Valid DigiCert TLS 1.3"}
📅 *Registrar Age:* ${isSuspicious ? "3 Hari (High Risk Typo-Squatting)" : "4 Tahun (Established)"}

📊 *Hasil Audit Keamanan:*
• Phishing Heuristic: ${isSuspicious ? "🚨 *BAHAYA (94% Phishing Score)*" : "✅ Bersih (0% Risk)"}
• Google Safe Browsing: ${isSuspicious ? "❌ Terindikasi Deceptive Site" : "✅ Safe"}
• Blacklist Check: ${isSuspicious ? "Terdaftar di 4 DB Malware (Spamhaus, PhishTank)" : "0/87 Engine Malware"}

💡 *Rekomendasi Zbot afan:*
${isSuspicious ? "⛔ *JANGAN KLIK ATAU MASUKKAN NOMOR HP / PIN!* Situs ini mencoba mencuri kredensial dompet digital Anda." : "✅ Tautan aman untuk dikunjungi."}
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 5. AI Vision Math & Code Bug Debugger (.solver / .solve)
  if (["solver", "solve", "debug", "bedahkode"].includes(lowerCmd)) {
    return res.json({
      success: true,
      response: `*🧠 [AI VISION CODE & MATH SOLVER]*
━━━━━━━━━━━━━━━━━━━━━━━
🔍 *Kategori:* Debugging TypeScript / Node.js Baileys

⚠️ *Akar Permasalahan (Root Cause):*
Terjadi \`TypeError: Cannot read properties of undefined (reading 'sendMessage')\` karena socket koneksi Baileys belum mencapai status \`open\` saat pesan dikirim.

🛠️ *Kode Solusi Perbaikan:*
\`\`\`typescript
// Pastikan sock sudah siap sebelum eksekusi
if (sock?.ws?.isOpen) {
  await sock.sendMessage(jid, { text: "Pesan terkirim!" });
} else {
  console.warn("Socket Baileys sedang reconnect...");
}
\`\`\`

💡 *Penjelasan Logika:*
Gunakan optional chaining (\`sock?.ws?.isOpen\`) untuk mencegah unhandled rejection, dan pasang listener event \`connection.update\` untuk auto-reconnect.
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 6. Dynamic QRIS & Split-Bill Kas Grup (.qris / .bill / .splitbill)
  if (["qris", "bill", "splitbill", "tagihan", "uangkas"].includes(lowerCmd)) {
    const rawAmt = parseInt(query.replace(/[^0-9]/g, "")) || 50000;
    const formattedAmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(rawAmt);
    const splitPerPerson = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(rawAmt / 4));
    const refCode = "QRIS-" + Math.floor(100000 + Math.random() * 900000);
    return res.json({
      success: true,
      response: `*💳 [DYNAMIC QRIS & BILLING KAS GRUP]*
━━━━━━━━━━━━━━━━━━━━━━━
🏪 *Merchant:* KAS GRUP RESMI (ZBOT AFAN)
💰 *Total Tagihan:* *${formattedAmt}*
🔖 *Kode Referensi:* \`${refCode}\`
👥 *Simulasi Split-Bill (4 Orang):* *${splitPerPerson}* / member

📱 *Metode Pembayaran Didukung:*
BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, LinkAja.

*QRIS Payload String (NMID: ID1020039182918):*
\`00020101021226590014ID.LINKAJA.WWW01189360091800216172655204581253033605802ID5913ZBOT AFAN PAY6007JAKARTA62070703A016304C92A\`

_Scan menggunakan aplikasi m-Banking atau E-Wallet apa saja. Pembayaran akan terverifikasi otomatis dalam 10 detik._
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // 7. Autonomous Self-Healing Process Watchdog (.watchdog / .heal)
  if (["watchdog", "heal", "optimizer", "autorepair"].includes(lowerCmd)) {
    const beforeMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const afterMem = (Math.max(18, parseFloat(beforeMem) * 0.45)).toFixed(1);
    return res.json({
      success: true,
      response: `*🩺 [AUTONOMOUS PROCESS HEALER - ZBOT AFAN]*
━━━━━━━━━━━━━━━━━━━━━━━
⚙️ *Status Watchdog:* AKTIF (Realtime Autonomous Daemon)

🧹 *Tindakan Perbaikan yang Dilakukan:*
1. Flush Garbage Collection V8 & Baileys Session Cache:
   • RAM Sebelum: *${beforeMem} MB* ➔ Setelah: *${afterMem} MB* (-55%)
2. Socket Keep-Alive Ping check:
   • WebSocket Latency: *14 ms* (Koneksi Stabil)
3. Defragmentasi Indeks Auth Multi-Device:
   • 0 corrupted keys detected, 41 keys optimized.
4. Auto-Heal Listener:
   • Watchdog siap me-restart socket secara otomatis bila latensi > 2.500 ms.

✅ *Kondisi Bot:* *SEHAT 100% & RESPON KILAT!*
━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  }

  // Default response for other valid commands
  return res.json({
    success: true,
    response: `*✅ Perintah [ ${currentPrefix}${lowerCmd} ] berhasil dieksekusi!*\n\n• Target: Chat Grup / Private\n• Waktu: ${new Date().toLocaleTimeString("id-ID")}\n• Info: Fitur ini aktif pada bot sewa Anda. Ketik \`${currentPrefix}menu\` untuk melihat seluruh daftar 100+ fitur canggih.`,
  });
});

// ================= VITE / STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server WhatsApp Bot Rental running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
