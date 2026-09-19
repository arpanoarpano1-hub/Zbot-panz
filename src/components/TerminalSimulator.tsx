import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Terminal,
  Bot,
  User,
  Trash2,
  Sparkles,
  Zap,
  CheckCheck,
  Smartphone,
  Copy,
  Info,
  Play,
  Layers
} from 'lucide-react';
import { ChatMessage, BotSession } from '../types';
import { WhatsAppMenuModal } from './WhatsAppMenuModal';

interface TerminalSimulatorProps {
  session: BotSession;
  onExecuteCommand: (cmd: string) => Promise<{ text: string; mediaType?: string; mediaUrl?: string }>;
  initialCommand?: string;
  onClearCommandPrefill?: () => void;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  session,
  onExecuteCommand,
  initialCommand,
  onClearCommandPrefill,
}) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'system',
      text: `[Node.js Baileys Socket] Terhubung ke Multi-Device WhatsApp (Ubuntu/macOS). Prefix aktif: "${session.prefix}"`,
      timestamp: '10:00',
    },
    {
      id: 'm-2',
      sender: 'bot',
      text: `👋 Halo! Saya *${session.botName}* bot WhatsApp resmi berbasis Node.js.\n✍️ *Tanda Tangan Pemilik*: *Afan* (Verified Owner & Developer)\n\nKetik *${session.prefix}menu* untuk melihat 112+ fitur lengkap berformat kotak rapi, atau coba fitur canggih eksklusif terbaru:\n• *${session.prefix}notul* (AI Notulensi Rapat & PIC)\n• *${session.prefix}ghost* (Pesan Rahasia Enkripsi 1x Baca)\n• *${session.prefix}threat* (Deep Scan Link Phishing)\n• *${session.prefix}vsum* (Transkrip Voice Note ke Teks)\n• *${session.prefix}qris* (Dynamic QRIS & Split Bill)\n• *${session.prefix}solve* (AI Debug Kode & Math)\n• *${session.prefix}heal* (Self-Healing Watchdog)\n• *${session.prefix}s* (stiker) • *${session.prefix}al on* (anti-link)`,
      timestamp: '10:01',
    },
  ]);

  const [inputCommand, setInputCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'logs'>('chat');
  const [logs, setLogs] = useState<string[]>([
    `[INFO] [${new Date().toLocaleTimeString()}] Node.js runtime booted: ${typeof process !== 'undefined' ? process.version : 'v20.12.0'}`,
    `[SIGNATURE] Verified digital signature: Afan (Owner: Zbot afan) [CERT-AFAN-ZBOT-2026]`,
    `[BAILEYS] Socket initialized with AuthState: Multi-Device v6.7.8`,
    `[PAIRING] Pairing code mechanism enabled (no QR scan required)`,
    `[READY] Bot listening for incoming message.upsert events`,
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle prefilled command from other components
  useEffect(() => {
    if (initialCommand) {
      setInputCommand(initialCommand);
      if (onClearCommandPrefill) onClearCommandPrefill();
    }
  }, [initialCommand, onClearCommandPrefill]);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickCommands = [
    { label: `${session.prefix}menu (Menu Rapi)`, cmd: `${session.prefix}menu` },
    { label: `👑 ${session.prefix}owner (Afan 08216787681)`, cmd: `${session.prefix}owner` },
    { label: `👑 ${session.prefix}addprem (Bebas Add Prem)`, cmd: `${session.prefix}addprem 628123456789 30d` },
    { label: `👑 ${session.prefix}delprem (Del Prem)`, cmd: `${session.prefix}delprem 628123456789` },
    { label: `👑 ${session.prefix}addsewa (Bebas Add Sewa)`, cmd: `${session.prefix}addsewa Grup Komunitas Dev 30` },
    { label: `👑 ${session.prefix}perpanjangsewa (Perpanjang Sewa)`, cmd: `${session.prefix}perpanjangsewa 30` },
    { label: `👑 ${session.prefix}listprem (Daftar Prem)`, cmd: `${session.prefix}listprem` },
    { label: `👑 ${session.prefix}listsewa (Daftar Sewa)`, cmd: `${session.prefix}listsewa` },
    { label: `💎 ${session.prefix}notul (Rangkum Rapat)`, cmd: `${session.prefix}notul 35` },
    { label: `👻 ${session.prefix}ghost (Pesan 1x Baca)`, cmd: `${session.prefix}ghost tokenAksesBCA9988 | pin:4321` },
    { label: `🛡️ ${session.prefix}threat (Cek Phishing)`, cmd: `${session.prefix}threat https://claim-saldo-dana-gratis2026.xyz` },
    { label: `🎙️ ${session.prefix}vsum (Transkrip VN)`, cmd: `${session.prefix}vsum` },
    { label: `💳 ${session.prefix}qris (Dynamic QRIS)`, cmd: `${session.prefix}qris 50000 | Kas Bulanan Grup` },
    { label: `🧠 ${session.prefix}solve (Debug Kode)`, cmd: `${session.prefix}solve` },
    { label: `🩺 ${session.prefix}heal (Auto-Heal RAM)`, cmd: `${session.prefix}heal` },
    { label: `${session.prefix}s (Stiker)`, cmd: `${session.prefix}s` },
    { label: `${session.prefix}al on (Anti-Link)`, cmd: `${session.prefix}al on` },
    { label: `${session.prefix}ht (Hidetag)`, cmd: `${session.prefix}ht Pengumuman penting untuk seluruh member grup!` },
    { label: `${session.prefix}tt (TikTok)`, cmd: `${session.prefix}tt https://vt.tiktok.com/ZS12345/` },
    { label: `${session.prefix}ai (Gemini)`, cmd: `${session.prefix}ai jelaskan keunggulan Zbot afan dibanding bot biasa` },
    { label: `${session.prefix}vps (Server Info)`, cmd: `${session.prefix}vps` },
    { label: `${session.prefix}cs (Cek Sewa)`, cmd: `${session.prefix}cs` },
  ];

  const handleSend = async (commandToSend?: string) => {
    const textToRun = (commandToSend || inputCommand).trim();
    if (!textToRun || isTyping) return;

    const userMsgId = 'msg-' + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: textToRun,
        timestamp: timeStr,
      },
    ]);

    setLogs((prev) => [
      ...prev,
      `[RECV] Inbound message from 62812xxxx: "${textToRun}"`,
      `[EXEC] Parsing command with prefix "${session.prefix}"`,
    ]);

    setInputCommand('');
    setIsTyping(true);

    try {
      // 2. Execute via backend API
      const res = await onExecuteCommand(textToRun);

      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: res.text,
          timestamp: botTime,
          mediaType: res.mediaType as any,
          mediaUrl: res.mediaUrl,
        },
      ]);

      setLogs((prev) => [
        ...prev,
        `[SEND] Response sent successfully via Baileys sock.sendMessage() [200 OK]`,
      ]);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'system',
          text: `Gagal mengeksekusi perintah: ${err?.message || 'Server timeout'}`,
          timestamp: timeStr,
        },
      ]);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'system',
        text: 'Chat dibersihkan. Bot siap menerima perintah baru.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Node.js Bot Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Terminal Uji Coba Perintah WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Uji langsung perintah bot Anda seperti stiker, antilink, Gemini AI, dan hidetag di lingkungan chat simulasi yang realistis.
          </p>
        </div>

          {/* View Switcher: Chat vs Console Logs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Lihat Format Tampilan Menu WhatsApp Rapi"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Menu WA Rapi</span>
            </button>

            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tampilan Chat WhatsApp
              </button>
              <button
                onClick={() => setActiveView('logs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'logs' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Log Server Node.js
              </button>
            </div>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Bersihkan Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      {/* Main Terminal Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* WhatsApp Chat Bar Header */}
        <div className="bg-[#111b21] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#111b21]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{session.botName}</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/20">
                  Bot Resmi
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">
                {isTyping ? 'sedang mengetik...' : 'online • Baileys MD Active'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Nomor: +{session.phoneNumber || '628xxxxxxxxxx'}
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="bg-[#0b141a] px-4 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Cepat:
          </span>
          {quickCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.cmd)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white border border-slate-700/60 text-slate-300 text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5 text-emerald-400 group-hover:text-white" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body: Chat or Server Logs */}
        {activeView === 'chat' ? (
          <div
            className="p-4 sm:p-6 min-h-[420px] max-h-[520px] overflow-y-auto space-y-3.5 bg-[#0b141a] bg-opacity-95"
            style={{
              backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          >
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-3 py-1 rounded-lg bg-[#182229] border border-slate-800 text-[11px] text-slate-400 font-mono shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm shadow-md ${
                      isUser
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/40'
                    }`}
                  >
                    {/* Simulated media preview (e.g. Sticker) */}
                    {msg.mediaType === 'sticker' && msg.mediaUrl && (
                      <div className="mb-2 p-2 bg-[#111b21] rounded-xl flex items-center justify-center">
                        <img
                          src={msg.mediaUrl}
                          alt="Sticker WhatsApp"
                          className="w-28 h-28 object-contain rounded-lg drop-shadow-md animate-pulse"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Formatted Message text (preserve newlines and simple markdown bold) */}
                    <div className="whitespace-pre-line leading-relaxed break-words font-sans">
                      {msg.text}
                    </div>

                    {/* Timestamp & Double Tick */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-300/80 select-none">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-cyan-300 inline" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#202c33] text-slate-300 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2 border border-slate-700/40">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Bot mengeksekusi...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Logs View */
          <div className="p-4 sm:p-6 min-h-[420px] max-h-[520px] overflow-y-auto bg-[#070b0e] font-mono text-xs text-slate-300 space-y-1.5">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`py-1 border-b border-slate-900 ${
                  log.includes('[RECV]')
                    ? 'text-cyan-400'
                    : log.includes('[SEND]')
                    ? 'text-emerald-400'
                    : log.includes('[EXEC]')
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-[#202c33] p-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-mono font-bold text-xs select-none">
                {session.prefix}
              </span>
              <input
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="Ketik perintah (contoh: menu, s, antilink on, ai apa itu Node.js?)..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#2a3942] border border-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputCommand.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Menu Preview Modal */}
      <WhatsAppMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        botName={session.botName}
        prefix={session.prefix}
        onTestInTerminal={(cmd) => handleSend(cmd)}
      />
    </div>
  );
};
