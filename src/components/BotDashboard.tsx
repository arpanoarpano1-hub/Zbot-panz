import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Server,
  Zap,
  Battery,
  Clock,
  ShieldCheck,
  Settings,
  Globe,
  Lock,
  Eye,
  PhoneCall,
  Sparkles,
  Save,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { BotSession } from '../types';
import { OwnerControlPanel } from './OwnerControlPanel';

interface BotDashboardProps {
  session: BotSession;
  onUpdateSettings: (settings: Partial<BotSession>) => Promise<void>;
  onNavigateToPairing: () => void;
}

export const BotDashboard: React.FC<BotDashboardProps> = ({
  session,
  onUpdateSettings,
  onNavigateToPairing,
}) => {
  const [botName, setBotName] = useState(session.botName);
  const [prefix, setPrefix] = useState(session.prefix);
  const [isPublic, setIsPublic] = useState(session.isPublic);
  const [autoRead, setAutoRead] = useState(session.autoRead);
  const [antiCall, setAntiCall] = useState(session.antiCall);
  const [packname, setPackname] = useState(session.stickerWatermark.packname);
  const [author, setAuthor] = useState(session.stickerWatermark.author);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      botName,
      prefix,
      isPublic,
      autoRead,
      antiCall,
      stickerWatermark: {
        packname,
        author,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isConnected = session.status === 'connected';

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard Performa Bot Node.js</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Status Server & Konfigurasi Bot
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau latency, statistik pesan yang diproses, serta kustomisasi watermark stiker dan mode akses.
          </p>
        </div>

        {!isConnected && (
          <button
            onClick={onNavigateToPairing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
          >
            Tautkan Nomor Sekarang
          </button>
        )}
      </div>

      {/* Stats Cards (4 items) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency / Ping */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Latency Response</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{session.pingMs}</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">ms (Ultra Fast)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kecepatan soket Baileys</p>
        </div>

        {/* Runtime RAM & Node.js */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Memory / Engine</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">38.4</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">MB / 512 MB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Node.js v20 LTS Runtime</p>
        </div>

        {/* Total Messages & Commands */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Perintah Terproses</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{session.commandsExecuted}</span>
            <span className="text-xs font-mono text-amber-400 font-semibold">eksekusi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{session.messagesProcessed} total pesan masuk</p>
        </div>

        {/* Device Battery */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Baterai HP Tertaut</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{session.batteryLevel}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Mengisi Daya ⚡</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-Device Standby</p>
        </div>
      </div>

      {/* Super Owner Afan Authority & Control Panel */}
      <OwnerControlPanel session={session} />

      {/* Main Settings Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Kustom Bot Anda</h3>
              <p className="text-xs text-slate-400">Atur preferensi watermark, mode akses, dan keamanan</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tersimpan!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bot Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Tampilan Bot
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Prefix */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Simbol Prefix (Trigger)
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                maxLength={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Sticker Packname */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Watermark Stiker - Nama Pack (Packname)
              </label>
              <input
                type="text"
                value={packname}
                onChange={(e) => setPackname(e.target.value)}
                placeholder="Contoh: SewaBot Pack"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Sticker Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Watermark Stiker - Nama Pembuat (Author)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: @pemilik_bot"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Public Mode */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Mode Public</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Semua orang bisa panggil bot
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Auto Read */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Auto-Read Pesan</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Otomatis centang biru saat perintah
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRead}
                  onChange={(e) => setAutoRead(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Anti Call */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-xs font-bold text-white">Anti-Call (Tolak Telp)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tolak panggilan WA otomatis
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiCall}
                  onChange={(e) => setAntiCall(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
