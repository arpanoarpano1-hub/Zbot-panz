import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  Zap,
  Layers,
  Terminal,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { WHATSAPP_MENU_STYLES, SHORTCUT_COMMANDS } from '../data/menuTemplates';

interface WhatsAppMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  botName: string;
  prefix: string;
  onTestInTerminal?: (cmd: string) => void;
}

export const WhatsAppMenuModal: React.FC<WhatsAppMenuModalProps> = ({
  isOpen,
  onClose,
  botName,
  prefix,
  onTestInTerminal,
}) => {
  const [activeStyleId, setActiveStyleId] = useState('box-modern');
  const [copied, setCopied] = useState(false);
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStyle = WHATSAPP_MENU_STYLES.find((s) => s.id === activeStyleId) || WHATSAPP_MENU_STYLES[0];
  const formattedMenuText = currentStyle.generate({
    botName,
    prefix,
    userName: 'Kawan WhatsApp',
    runtime: 'Ubuntu 22.04 LTS / macOS',
    speed: 18,
    featuresCount: 105,
  });

  const handleCopyMenu = () => {
    navigator.clipboard.writeText(formattedMenuText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyShortcut = (short: string) => {
    navigator.clipboard.writeText(short.replace(/^\./, prefix));
    setCopiedShortcut(short);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Tampilan Menu WhatsApp Rapi</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Estetik & Teratur
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Format bergaris indah, simetris, rapi, dan mudah diketik dengan command singkat.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: WhatsApp Chat Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0c1317] overflow-hidden">
            {/* WhatsApp Fake Header */}
            <div className="px-4 py-2.5 bg-[#1f2c34] flex items-center justify-between border-b border-slate-800/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  🤖
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{botName}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">online • Node.js Baileys</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMenu}
                  className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Format'}</span>
                </button>
                {onTestInTerminal && (
                  <button
                    onClick={() => {
                      onTestInTerminal(`${prefix}menu`);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Tes Terminal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Bubble Container with authentic WhatsApp wallpaper pattern feel */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]">
              {/* User Trigger Chat Bubble */}
              <div className="flex justify-end">
                <div className="bg-[#005c4b] text-slate-100 rounded-lg rounded-tr-none px-3 py-1.5 text-xs shadow max-w-[85%] font-mono">
                  {prefix}menu
                  <span className="text-[9px] text-emerald-300 ml-2 select-none">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </span>
                </div>
              </div>

              {/* Bot Response Bubble (The Aesthetic Menu) */}
              <div className="flex justify-start">
                <div className="bg-[#202c33] text-slate-200 rounded-lg rounded-tl-none p-3.5 text-xs shadow-md border border-slate-700/40 max-w-[98%] overflow-x-auto">
                  <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-slate-200 whitespace-pre font-medium selection:bg-emerald-500/30 selection:text-emerald-300">
                    {formattedMenuText}
                  </pre>
                  <div className="flex justify-end items-center gap-1 mt-2 text-[9px] text-slate-400 select-none">
                    <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Style Options & Fast Typing Shortcuts (5 cols) */}
          <div className="lg:col-span-5 flex flex-col p-4 sm:p-5 bg-slate-900/90 overflow-y-auto space-y-5">
            {/* Style Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pilih Gaya Garis & Tampilan</span>
              </label>
              <div className="space-y-2">
                {WHATSAPP_MENU_STYLES.map((style) => {
                  const isSelected = activeStyleId === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setActiveStyleId(style.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {style.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{style.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Commands Fast Typing Guide */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Command Singkat (Mudah Diketik)</span>
                </label>
                <span className="text-[10px] text-slate-400">Klik untuk salin</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Gunakan shortcut 1-3 huruf ini agar pengguna di grup WA tidak perlu repot mengetik perintah panjang.
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {SHORTCUT_COMMANDS.map((item) => {
                  const activeShort = item.short.replace(/^\./, prefix);
                  const isCopied = copiedShortcut === item.short;
                  return (
                    <button
                      key={item.short}
                      onClick={() => handleCopyShortcut(item.short)}
                      className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between group ${
                        isCopied
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800/80 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {activeShort}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">({item.full})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                      <span className="text-slate-500 group-hover:text-emerald-400 shrink-0">
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Guidelines Card */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Karakteristik Tampilan Rapi:</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-4 list-disc">
                <li>Garis kurva box tidak putus di WhatsApp Android & iPhone.</li>
                <li>Logo dan icon sejajar rata kiri tanpa tabrakan baris.</li>
                <li>Pengguna cukup ketik <strong>{prefix}s</strong> untuk stiker, <strong>{prefix}ht</strong> untuk hidetag, atau <strong>{prefix}tt</strong> untuk TikTok.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Format otomatis disesuaikan dengan prefix Anda: <strong>[{prefix}]</strong></span>
          </div>
          <button
            onClick={handleCopyMenu}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Berhasil Disalin!' : 'Salin Seluruh Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
