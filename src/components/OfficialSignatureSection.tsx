import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Fingerprint,
  Copy,
  ExternalLink,
  Sparkles,
  Lock,
  BadgeCheck,
  FileCheck
} from 'lucide-react';
import { OfficialSignatureModal } from './OfficialSignatureModal';

interface OfficialSignatureSectionProps {
  botName?: string;
  creatorName?: string;
}

export const OfficialSignatureSection: React.FC<OfficialSignatureSectionProps> = ({
  botName = 'Zbot afan',
  creatorName = 'Afan',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const signatureId = 'SIGN-AFAN-ZBOT-2026-OK';

  const handleCopyId = () => {
    navigator.clipboard.writeText(`${signatureId} | Hak Cipta & Tanda Tangan Sah: ${creatorName} (${botName})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="my-10 relative">
      {/* Decorative Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-60 pointer-events-none"></div>

      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-[#0b141d] border-2 border-emerald-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
          <Award className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Column: Authentic Credentials & Description */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>TANDA TANGAN SAH TERVERIFIKASI</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Karya Asli & Resmi</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                2026 Edition
              </span>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Pengesahan Hak Cipta & Kepemilikan Web</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Website ini secara resmi memiliki tanda tangan otentik dari pembuatnya, yaitu{' '}
                <span className="text-emerald-400 font-bold underline decoration-emerald-500/50 underline-offset-4">
                  {creatorName}
                </span>{' '}
                sebagai pencipta dan pemilik sah bot WhatsApp{' '}
                <span className="text-white font-bold">{botName}</span>. Seluruh fitur, integrasi pairing code Baileys, 
                dan konfigurasi server beroperasi di bawah lisensi resmi beliau.
              </p>
            </div>

            {/* Micro Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Super Owner</span>
                <span className="text-sm font-bold text-emerald-300">{creatorName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nomor WA</span>
                <span className="text-sm font-mono font-bold text-cyan-300">08216787681</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Biaya Layanan</span>
                <span className="text-sm font-bold text-amber-300">100% Gratis</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hak Akses</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bebas Sewa & Prem</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Handwritten Signature Plaque */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30 shadow-inner">
            <div className="text-center w-full">
              <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase block">
                Tanda Tangan Pemilik :
              </span>

              {/* Distinctive Handwritten Signature */}
              <div className="my-2 py-1 px-4 bg-gradient-to-b from-slate-900/40 to-slate-950 rounded-xl border border-slate-800/80">
                <span className="font-['Caveat',cursive] text-5xl md:text-6xl text-emerald-400 font-bold tracking-wide select-none drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                  {creatorName}
                </span>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-0.5 rounded-full"></div>
              </div>

              <span className="text-[11px] text-slate-400 block font-medium">
                {creatorName} • Owner of {botName}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-2 pt-1">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all border border-emerald-400/30"
              >
                <FileCheck className="w-4 h-4" />
                <span>Buka Sertifikat Tanda Tangan</span>
              </button>

              <button
                onClick={handleCopyId}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">ID Tanda Tangan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Bukti ({signatureId})</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Modal Dialog */}
      <OfficialSignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        botName={botName}
        creatorName={creatorName}
      />
    </section>
  );
};
