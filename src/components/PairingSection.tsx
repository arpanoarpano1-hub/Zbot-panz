import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { BotSession } from '../types';

interface PairingSectionProps {
  session: BotSession;
  onRequestPairing: (phoneNumber: string, botName: string, prefix: string) => Promise<void>;
  onSimulateLink: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onNavigateToTerminal: () => void;
  isLoading: boolean;
}

export const PairingSection: React.FC<PairingSectionProps> = ({
  session,
  onRequestPairing,
  onSimulateLink,
  onDisconnect,
  onNavigateToTerminal,
  isLoading,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(session.phoneNumber || '081234567890');
  const [botName, setBotName] = useState(session.botName || 'Zbot afan');
  const [prefix, setPrefix] = useState(session.prefix || '.');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  // Countdown timer for pairing code expiry
  useEffect(() => {
    if (session.status === 'awaiting_pair' && session.codeExpiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((session.codeExpiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session.status, session.codeExpiresAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    await onRequestPairing(phoneNumber, botName, prefix);
  };

  const handleCopyCode = () => {
    if (!session.pairingCode) return;
    // Strip hyphen for clipboard or copy as is
    navigator.clipboard.writeText(session.pairingCode.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isConnected = session.status === 'connected';
  const isAwaiting = session.status === 'awaiting_pair';

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Hero Badge & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Web Resmi <strong>Zbot afan</strong> • Bertanda Tangan Sah: <strong className="text-white">Afan</strong></span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Sewa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Zbot afan</span> Hanya Dengan{' '}
          <span className="text-white">
            Daftar Nomor
          </span>
        </h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          Platform bot WhatsApp resmi berlisensi karya <strong>Afan</strong>. Cukup daftarkan nomor WhatsApp yang ingin Anda jadikan bot,
          dapatkan 8 digit pairing code langsung di browser tanpa scan QR, dan nikmati 105+ fitur canggih 
          lengkap dengan jaminan kepemilikan dan tanda tangan asli.
        </p>
      </div>

      {/* Main Grid: Form + Pairing Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form / Connected Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pendaftaran Nomor Bot</h3>
                  <p className="text-xs text-slate-400">Hubungkan nomor WA Anda</p>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 font-mono font-medium">
                Node.js v20
              </span>
            </div>

            {isConnected ? (
              /* Already Connected Card */
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">
                      WhatsApp Bot Telah Aktif & Terhubung!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Nomor <span className="font-mono text-emerald-300 font-bold">+{session.phoneNumber}</span> berhasil
                      tertaut sebagai bot WhatsApp Multi-Device.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Nama Bot:</span>
                    <span className="font-medium text-white">{session.botName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Prefix Command:</span>
                    <span className="font-mono font-bold text-emerald-400">[{session.prefix}]</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Status Baileys:</span>
                    <span className="text-emerald-400 font-medium">Socket Connected (200 OK)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Paket Sewa:</span>
                    <span className="text-cyan-400 font-medium">{session.planName}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    onClick={onNavigateToTerminal}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30"
                  >
                    <span>Buka Terminal Uji Coba</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onDisconnect}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all"
                  >
                    Putuskan Bot
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nomor WhatsApp yang Dijadikan Bot
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-mono font-semibold">
                      ID +62
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="081234567890 atau 628..."
                      className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format otomatis dikonversi ke kode negara (contoh: 0812... ➔ 62812...)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Bot Kustom
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Contoh: Zbot afan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Prefix Perintah (Command Trigger)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['.', '!', '#', '/'].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setPrefix(item)}
                        className={`py-2 rounded-lg text-sm font-mono font-bold transition-all border ${
                          prefix === item
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {item} (misal: {item}menu)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menghubungi Server Baileys...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Dapatkan Kode Pairing (Pairing Code)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Guarantees */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Enkripsi End-to-End</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Node.js Cloud 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pairing Code Display & Step-by-Step Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pairing Code Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Kode Perangkat Tertaut (Pairing Code)
                </h3>
              </div>
              {isAwaiting && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Kedaluwarsa: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {session.pairingCode ? (
              <div className="space-y-4">
                {/* Big Code Display */}
                <div className="p-6 rounded-2xl bg-[#070b0e] border border-emerald-500/30 text-center relative group">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">
                    Masukkan 8 Digit Kode Ini di WhatsApp Anda
                  </p>

                  <div className="flex items-center justify-center gap-3 font-mono text-3xl sm:text-5xl font-black text-white tracking-widest my-2">
                    <span className="px-3 sm:px-4 py-2 bg-slate-900/90 rounded-xl border border-emerald-500/40 text-emerald-400 shadow-inner">
                      {session.pairingCode.split('-')[0] || session.pairingCode.slice(0, 4)}
                    </span>
                    <span className="text-slate-600 font-light">-</span>
                    <span className="px-3 sm:px-4 py-2 bg-slate-900/90 rounded-xl border border-emerald-500/40 text-emerald-400 shadow-inner">
                      {session.pairingCode.split('-')[1] || session.pairingCode.slice(4, 8)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Kode Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Kode Pairing</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onRequestPairing(phoneNumber, botName, prefix)}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                      title="Perbarui Kode"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Buat Ulang</span>
                    </button>
                  </div>
                </div>

                {/* Instant Simulation Action */}
                {!isConnected && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-300">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Muncul pesan &quot;Gagal menautkan perangkat&quot; di WhatsApp HP?
                        </span>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Jangan khawatir! Klik tombol hijau di bawah ini untuk <strong>mengaktifkan bot seketika</strong> dan langsung menguji seluruh 112+ fitur di Terminal & Dashboard.
                        </p>
                      </div>
                      <button
                        onClick={onSimulateLink}
                        className="w-full sm:w-auto whitespace-nowrap px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-all shrink-0"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simulasikan Tautkan Langsung (Aktifkan Bot)</span>
                      </button>
                    </div>

                    {/* Troubleshooting Guide */}
                    <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Penyebab WhatsApp Menolak Kode di HP:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[10.5px]">
                        <li>
                          <strong>Batas Waktu Kode Habis:</strong> Kode pairing WhatsApp hanya valid <strong>120 detik (2 menit)</strong>. Jika terlambat mengetik di HP, klik tombol <em>&quot;Buat Ulang&quot;</em>.
                        </li>
                        <li>
                          <strong>Nomor HP Harus Sama Persis:</strong> Nomor yang didaftarkan di formulir kiri (misal: <code>{session.phoneNumber || phoneNumber}</code>) wajib 100% sama dengan akun WhatsApp yang sedang dibuka di HP.
                        </li>
                        <li>
                          <strong>Lingkungan Web Preview:</strong> Karena web ini berjalan di cloud container demo, cara tercepat & paling stabil untuk mencoba seluruh fitur adalah dengan menekan tombol <strong>&quot;Simulasikan Tautkan Langsung&quot;</strong> di atas.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Placeholder before generating */
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Kode Pairing Belum Dibuat</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Silakan masukkan nomor WhatsApp Anda di formulir sebelah kiri dan klik tombol
                    <span className="text-emerald-400 font-medium"> "Dapatkan Kode Pairing"</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-Step Visual Instruction on How to Pair on Phone */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cara Memasukkan Kode di Aplikasi WhatsApp:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Buka WhatsApp HP</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Buka aplikasi WhatsApp resmi di HP yang ingin dijadikan bot.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Perangkat Tertaut</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ketuk titik tiga (⋮) atau Pengaturan ➔ Perangkat Tertaut (Linked Devices).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Pilih Nomor Telepon</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ketuk "Tautkan Perangkat", lalu pilih tautan bawah:
                      <span className="text-emerald-300 font-semibold"> "Tautkan dengan nomor telepon saja"</span>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Ketik Kode 8 Digit</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Masukkan 8 karakter kode pairing yang tertera di atas. Bot aktif otomatis!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
