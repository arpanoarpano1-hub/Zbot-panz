// Template Tampilan Menu WhatsApp Rapi, Estetik, Bergaris Bagus & Logo Teratur
export interface MenuStyle {
  id: string;
  name: string;
  description: string;
  generate: (params: {
    botName: string;
    prefix: string;
    userName?: string;
    runtime?: string;
    speed?: number;
    featuresCount?: number;
  }) => string;
}

export const WHATSAPP_MENU_STYLES: MenuStyle[] = [
  {
    id: 'box-modern',
    name: 'Garis Box Modern (Rapi & Teratur)',
    description: 'Batas garis kurva unicode ganda dengan logo rapi dan bullet monospaced sejajar.',
    generate: ({ botName, prefix, userName = 'Kawan WhatsApp', runtime = 'Ubuntu 22.04 LTS', speed = 18, featuresCount = 105 }) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
      const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

      return `╭━━━〔 🤖 *${botName.toUpperCase()}* 〕━━━╮
┃ 👤 *Pengguna* : ${userName}
┃ 👑 *Status*   : Member Sewa VIP
┃ ⚡ *Engine*   : Node.js (Baileys Multi-Device)
┃ 🖥️ *Server*   : ${runtime}
┃ 🚀 *Speed*    : ${speed}ms (Anti-Lag Zero Delay)
┃ 📅 *Hari*     : ${dateStr}
┃ ⏰ *Pukul*    : ${timeStr}
┃ 🔑 *Prefix*   : [ *${prefix}* ]
┃ 📦 *Total*    : ${featuresCount}+ Fitur Canggih
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭───「 🛡️ *PENGELOLA GRUP* 」
│ ⭔ *${prefix}al*  / ${prefix}antilink
│ ⭔ *${prefix}as*  / ${prefix}antispam
│ ⭔ *${prefix}vx*  / ${prefix}antivirtex
│ ⭔ *${prefix}vo*  / ${prefix}antiviewonce
│ ⭔ *${prefix}ht*  / ${prefix}hidetag
│ ⭔ *${prefix}ta*  / ${prefix}tagall
│ ⭔ *${prefix}k*   / ${prefix}kick
│ ⭔ *${prefix}add* / ${prefix}tambah
│ ⭔ *${prefix}p*   / ${prefix}promote
│ ⭔ *${prefix}d*   / ${prefix}demote
│ ⭔ *${prefix}g*   / ${prefix}group [o/c]
│ ⭔ *${prefix}w*   / ${prefix}welcome
│ ⭔ *${prefix}vt*  / ${prefix}vote
│ ⭔ *${prefix}pp*  / ${prefix}setppgc
│ ⭔ *${prefix}sn*  / ${prefix}setnamegc
│ ⭔ *${prefix}sd*  / ${prefix}setdesc
╰───────────────────────────

╭───「 🎨 *STIKER & AUDIO* 」
│ ⭔ *${prefix}s*   / ${prefix}sticker
│ ⭔ *${prefix}sw*  / ${prefix}swm
│ ⭔ *${prefix}bg*  / ${prefix}removebg
│ ⭔ *${prefix}sc*  / ${prefix}sircle
│ ⭔ *${prefix}sm*  / ${prefix}smeme
│ ⭔ *${prefix}qc*  / ${prefix}quotely
│ ⭔ *${prefix}vn*  / ${prefix}tovn
│ ⭔ *${prefix}bs*  / ${prefix}bass
│ ⭔ *${prefix}nc*  / ${prefix}nightcore
│ ⭔ *${prefix}sl*  / ${prefix}slowmo
│ ⭔ *${prefix}rv*  / ${prefix}reverse
│ ⭔ *${prefix}ttp* / ${prefix}attp
╰───────────────────────────

╭───「 🧠 *GEMINI & AI* 」
│ ⭔ *${prefix}ai*  / ${prefix}gemini
│ ⭔ *${prefix}img* / ${prefix}aiimg
│ ⭔ *${prefix}hd*  / ${prefix}remini
│ ⭔ *${prefix}tts* / ${prefix}voice
│ ⭔ *${prefix}tr*  / ${prefix}trans
│ ⭔ *${prefix}vs*  / ${prefix}vision
│ ⭔ *${prefix}ocr* / ${prefix}baca
│ ⭔ *${prefix}sot* / ${prefix}soundoftext
│ ⭔ *${prefix}ps*  / ${prefix}persona
╰───────────────────────────

╭───「 📥 *DOWNLOADER* 」
│ ⭔ *${prefix}tt*  / ${prefix}tiktok
│ ⭔ *${prefix}ig*  / ${prefix}instagram
│ ⭔ *${prefix}yt*  / ${prefix}ytmp4
│ ⭔ *${prefix}mp3* / ${prefix}ytmp3
│ ⭔ *${prefix}sp*  / ${prefix}spotify
│ ⭔ *${prefix}fb*  / ${prefix}facebook
│ ⭔ *${prefix}mf*  / ${prefix}mediafire
│ ⭔ *${prefix}pin* / ${prefix}pinterest
│ ⭔ *${prefix}sc*  / ${prefix}soundcloud
│ ⭔ *${prefix}git* / ${prefix}gitclone
╰───────────────────────────

╭───「 🛠️ *UTILITAS & VPS* 」
│ ⭔ *${prefix}vps* / ${prefix}vpsinfo
│ ⭔ *${prefix}sp*  / ${prefix}speed
│ ⭔ *${prefix}ip*  / ${prefix}cekip
│ ⭔ *${prefix}cu*  / ${prefix}cuaca
│ ⭔ *${prefix}gm*  / ${prefix}gempa
│ ⭔ *${prefix}js*  / ${prefix}jadwalsholat
│ ⭔ *${prefix}ks*  / ${prefix}kurs
│ ⭔ *${prefix}b64* / ${prefix}base64
│ ⭔ *${prefix}gc*  / ${prefix}cleanram
╰───────────────────────────

╭───「 🎮 *GAMES & FUN* 」
│ ⭔ *${prefix}tg*  / ${prefix}tebakgambar
│ ⭔ *${prefix}cl*  / ${prefix}caklontong
│ ⭔ *${prefix}f1*  / ${prefix}family100
│ ⭔ *${prefix}ww*  / ${prefix}werewolf
│ ⭔ *${prefix}tk*  / ${prefix}tebakkata
│ ⭔ *${prefix}tl*  / ${prefix}tebaklirik
│ ⭔ *${prefix}mg*  / ${prefix}mathgame
│ ⭔ *${prefix}tb*  / ${prefix}tebakbendera
╰───────────────────────────

╭───「 💎 *EKSKLUSIF & TIDAK PASARAN* 」
│ ⭔ *${prefix}notul*  / ${prefix}notulensi (AI Rangkum Rapat)
│ ⭔ *${prefix}ghost*  / ${prefix}vault (Pesan 1x Baca / PIN)
│ ⭔ *${prefix}vsum*   / ${prefix}transcribe (Voice Note ke Teks)
│ ⭔ *${prefix}threat* / ${prefix}scanlink (Cyber Anti-Phishing)
│ ⭔ *${prefix}solve*  / ${prefix}solver (AI Debug Kode & Math)
│ ⭔ *${prefix}bill*   / ${prefix}qris (Dynamic QRIS & Split Bill)
│ ⭔ *${prefix}heal*   / ${prefix}watchdog (Self-Healing Process)
╰───────────────────────────

╭───「 👑 *OWNER & SEWA* 」
│ ⭔ *${prefix}cs*  / ${prefix}ceksewa
│ ⭔ *${prefix}asw* / ${prefix}addsewa
│ ⭔ *${prefix}bc*  / ${prefix}broadcast
│ ⭔ *${prefix}bk*  / ${prefix}backupsession
│ ⭔ *${prefix}res* / ${prefix}restart
│ ⭔ *${prefix}pre* / ${prefix}addprem
│ ⭔ *${prefix}mod* / ${prefix}mode
╰───────────────────────────

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 💡 *TIPS CEPAT KETIK :*
│ Gunakan perintah singkat di atas
│ Contoh : *${prefix}s* (bikin stiker)
│         *${prefix}ht* (hidetag grup)
│         *${prefix}tt* (unduh tiktok)
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ ✍️ *TANDA TANGAN RESMI :*
│ Pemilik & Pengembang : *Afan*
│ Original Bot         : *Zbot afan*
│ ID Sertifikat        : SIGN-AFAN-2026
│ Status               : ✓ Terverifikasi Asli
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
    },
  },
  {
    id: 'cyber-minimal',
    name: 'Cyber Line (Minimalis Ramping)',
    description: 'Model garis presisi ala terminal modern, padat, rapi, dan mudah dibaca di layar HP.',
    generate: ({ botName, prefix, userName = 'User', runtime = 'Node.js v20', speed = 18 }) => {
      return `┌───「 *${botName.toUpperCase()}* 」───
│ ⚡ *Status*  : ONLINE (Active)
│ 🚀 *Speed*   : ${speed}ms
│ 💻 *Server*  : ${runtime}
│ 🔑 *Prefix*  : [ ${prefix} ]
└───

┌─〔 🛡️ *GRUP ADMIN* 〕
├ ⭔ *${prefix}al* ➔ Anti-Link
├ ⭔ *${prefix}as* ➔ Anti-Spam
├ ⭔ *${prefix}vx* ➔ Anti-Virtex
├ ⭔ *${prefix}vo* ➔ Anti-ViewOnce
├ ⭔ *${prefix}ht* ➔ Hidetag All
├ ⭔ *${prefix}ta* ➔ Tag All
├ ⭔ *${prefix}k*  ➔ Kick Member
├ ⭔ *${prefix}p*  ➔ Promote Admin
├ ⭔ *${prefix}g*  ➔ Group Open/Close
└─

┌─〔 🎨 *STIKER & MEDIA* 〕
├ ⭔ *${prefix}s*  ➔ Buat Stiker
├ ⭔ *${prefix}sw* ➔ Stiker Watermark
├ ⭔ *${prefix}bg* ➔ Hapus Background
├ ⭔ *${prefix}qc* ➔ Buat Gelembung Chat
├ ⭔ *${prefix}vn* ➔ Audio ke Voice Note
├ ⭔ *${prefix}bs* ➔ Bass Boost Audio
└─

┌─〔 🧠 *AI & TOOLS* 〕
├ ⭔ *${prefix}ai* ➔ Tanya Gemini AI
├ ⭔ *${prefix}hd* ➔ Remini HD Foto
├ ⭔ *${prefix}tt* ➔ Unduh TikTok
├ ⭔ *${prefix}ig* ➔ Unduh IG Video
├ ⭔ *${prefix}yt* ➔ Unduh YouTube MP4
├ ⭔ *${prefix}vps*➔ Cek Server Ubuntu
└─

┌─〔 💎 *EKSKLUSIF (TIDAK PASARAN)* 〕
├ ⭔ *${prefix}notul* ➔ AI Rangkum Rapat & PIC
├ ⭔ *${prefix}ghost* ➔ Pesan 1x Baca / PIN Vault
├ ⭔ *${prefix}vsum*  ➔ Voice Note ke Teks
├ ⭔ *${prefix}threat*➔ Cyber Anti-Phishing Scanner
├ ⭔ *${prefix}solve* ➔ AI Debug Kode & Math
├ ⭔ *${prefix}bill*  ➔ Dynamic QRIS & Split Bill
├ ⭔ *${prefix}heal*  ➔ Autonomous Self-Healing VPS
└─

┌─〔 👑 *SEWA BOT* 〕
├ ⭔ *${prefix}cs* ➔ Cek Sisa Masa Sewa
├ ⭔ *${prefix}bc* ➔ Broadcast Semua Grup
├ ⭔ *${prefix}bk* ➔ Backup Sesi Baileys
└─

┌─〔 ✍️ *TANDA TANGAN SAH* 〕
├ 👤 Owner : Afan (Zbot afan)
├ 🔐 Status: 100% Karya Asli
└─`;
    },
  },
];

// Daftar Shortcut Singkat Cepat Diketik
export const SHORTCUT_COMMANDS = [
  { short: '.s', full: '.sticker', desc: 'Buat stiker dari foto/video', cat: 'Stiker' },
  { short: '.sw', full: '.swm', desc: 'Ubah watermark stiker pack/author', cat: 'Stiker' },
  { short: '.bg', full: '.removebg', desc: 'Hapus background foto transparan', cat: 'Stiker' },
  { short: '.vn', full: '.tovn', desc: 'Ubah audio lagu jadi VN suara asli', cat: 'Stiker' },
  { short: '.al', full: '.antilink', desc: 'Nyalakan proteksi anti link grup', cat: 'Grup' },
  { short: '.as', full: '.antispam', desc: 'Cegah spam dan flood chat', cat: 'Grup' },
  { short: '.vx', full: '.antivirtex', desc: 'Tangkal teks virtex perusak WA', cat: 'Grup' },
  { short: '.vo', full: '.antiviewonce', desc: 'Tangkap media sekali lihat', cat: 'Grup' },
  { short: '.ht', full: '.hidetag', desc: 'Tag seluruh anggota tanpa terlihat', cat: 'Grup' },
  { short: '.ta', full: '.tagall', desc: 'Tag sebut semua nama anggota', cat: 'Grup' },
  { short: '.k', full: '.kick', desc: 'Tendang anggota dari grup', cat: 'Grup' },
  { short: '.g', full: '.group', desc: 'Buka atau tutup izin chat grup', cat: 'Grup' },
  { short: '.ai', full: '.gemini', desc: 'Tanya jawab cerdas Gemini AI', cat: 'AI' },
  { short: '.hd', full: '.remini', desc: 'Pertajam foto buram jadi HD', cat: 'AI' },
  { short: '.tt', full: '.tiktok', desc: 'Download video TikTok no WM', cat: 'Downloader' },
  { short: '.ig', full: '.instagram', desc: 'Download Reels & Post IG', cat: 'Downloader' },
  { short: '.yt', full: '.ytmp4', desc: 'Download video YouTube HD', cat: 'Downloader' },
  { short: '.mp3', full: '.ytmp3', desc: 'Download lagu YouTube audio', cat: 'Downloader' },
  { short: '.sp', full: '.speed', desc: 'Cek latency ping & respon server', cat: 'Tools' },
  { short: '.vps', full: '.vpsinfo', desc: 'Cek spesifikasi Ubuntu/Mac', cat: 'Tools' },
  { short: '.notul', full: '.notulensi', desc: 'AI Rangkum obrolan rapat grup', cat: 'Eksklusif' },
  { short: '.ghost', full: '.vault', desc: 'Pesan rahasia enkripsi 1x baca', cat: 'Eksklusif' },
  { short: '.vsum', full: '.transcribe', desc: 'Transkrip suara Voice Note ke teks', cat: 'Eksklusif' },
  { short: '.threat', full: '.scanlink', desc: 'Deep scan URL phishing berbahaya', cat: 'Eksklusif' },
  { short: '.solve', full: '.solver', desc: 'AI analisis error kode & math', cat: 'Eksklusif' },
  { short: '.bill', full: '.qris', desc: 'Dynamic QRIS & Split bill kas grup', cat: 'Eksklusif' },
  { short: '.heal', full: '.watchdog', desc: 'Self-healing RAM & Baileys socket', cat: 'Eksklusif' },
  { short: '.cs', full: '.ceksewa', desc: 'Cek sisa masa sewa bot aktif', cat: 'Owner' },
  { short: '.bc', full: '.broadcast', desc: 'Kirim pengumuman ke seluruh grup', cat: 'Owner' },
];
