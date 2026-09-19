import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Award,
  Fingerprint,
  Calendar,
  Sparkles,
  Copy,
  ExternalLink,
  Lock
} from 'lucide-react';

interface OfficialSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  botName?: string;
  creatorName?: string;
}

export const OfficialSignatureModal: React.FC<OfficialSignatureModalProps> = ({
  isOpen,
  onClose,
  botName = 'Zbot afan',
  creatorName = 'Afan',
}) => {
  const [copied, setCopied] = useState(false);
  const signatureHash = 'SHA256:7e8d3f1a9c04b862e5b7194f28dcafan009187326';
  const certId = 'CERT-AFAN-ZBOT-2026-ORIGINAL';
  const issueDate = '19 September 2026';

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`${certId} | ${signatureHash} | Signed by ${creatorName} (${botName})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1620] border-2 border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden">
        
        {/* Certificate Golden/Emerald Top Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold tracking-wider uppercase border border-emerald-500/30">
                  Sertifikat Keaslian & Hak Cipta
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  100% Terverifikasi
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">
                Tanda Tangan Resmi Pemilik Web
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Parchment Styled Card) */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Statement Box */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/20 text-center space-y-4">
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-8xl font-black tracking-widest text-emerald-400 font-mono">
                AFAN
              </span>
            </div>

            <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Surat Pengesahan & Tanda Tangan Digital Resmi
            </p>

            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Website Ini Secara Sah Dimiliki & Ditandatangani Oleh:
            </h3>

            <div className="py-2">
              <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                {creatorName}
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Founder, Bot Architect & Super Owner <span className="text-emerald-400 font-bold">{botName}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300">
                <span>WhatsApp Owner:</span>
                <strong className="text-white font-bold tracking-wider">08216787681</strong>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-sans">Super Owner</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              &quot;Dengan ini dinyatakan dengan sah bahwa platform web, sistem pairing Baileys Node.js, 
              infrastruktur server, serta seluruh modul fitur <b>{botName}</b> merupakan hasil karya asli 
              dan berada di bawah kepemilikan mutlak <b>{creatorName}</b> (08216787681). Bot ini disediakan 
              <b> 100% GRATIS TANPA BIAYA</b> dengan hak otoritas penuh bagi Owner untuk bebas menambah/menghapus 
              status premium dan bebas memperpanjang sewa kapan saja.&quot;
            </p>

            {/* Visual Signature & Wax Seal */}
            <div className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-slate-800">
              {/* Handwritten Signature Box */}
              <div className="text-center sm:text-left bg-slate-950/80 px-6 py-3 rounded-2xl border border-emerald-500/30">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                  Tanda Tangan Otentik:
                </span>
                <div className="font-['Caveat',cursive] text-4xl md:text-5xl text-emerald-400 tracking-wide font-bold select-none drop-shadow-md">
                  {creatorName}
                </div>
                <div className="w-24 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent mx-auto sm:mx-0 mt-1"></div>
                <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">
                  Digital Timestamp: {issueDate}
                </span>
              </div>

              {/* Verified Seal */}
              <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/40 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>CAP RESMI SAH</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </div>
                  <span className="text-slate-400 text-[11px] block">Verified Authenticity</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">ORIGINAL WORK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certificate ID</span>
              </div>
              <p className="font-mono font-bold text-white text-[11px] truncate">
                {certId}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Tanggal Pengesahan</span>
              </div>
              <p className="font-bold text-white">
                {issueDate}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Status Hak Cipta</span>
              </div>
              <p className="font-bold text-emerald-400 flex items-center gap-1">
                <span>Terlindungi Penuh</span>
                <CheckCircle2 className="w-3 h-3" />
              </p>
            </div>
          </div>

          {/* Digital Signature Hash */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="truncate">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Cryptographic Signature Hash (Integritas Web):
              </span>
              <span className="font-mono text-slate-300 text-[11px] truncate block">
                {signatureHash}
              </span>
            </div>

            <button
              onClick={handleCopyHash}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Bukti</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Kredensial Keaslian Resmi • Ditandatangani oleh {creatorName}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
          >
            Tutup & Mengerti
          </button>
        </div>

      </div>
    </div>
  );
};
