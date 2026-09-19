import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle2, ChevronRight, FileSignature, Sparkles } from 'lucide-react';
import { OfficialSignatureModal } from './OfficialSignatureModal';

interface OfficialSignatureBannerProps {
  botName?: string;
  creatorName?: string;
}

export const OfficialSignatureBanner: React.FC<OfficialSignatureBannerProps> = ({
  botName = 'Zbot afan',
  creatorName = 'Afan',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-teal-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Signature Notice */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <FileSignature className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white">Tanda Tangan Resmi:</span>{' '}
              <span>Website ini sah milik & ditandatangani oleh{' '}
                <strong className="text-emerald-400 font-bold underline decoration-emerald-400/40 underline-offset-2">{creatorName}</strong>{' '}
                (No WA: <strong className="text-cyan-300 font-mono">08216787681</strong> • Super Owner Bebas Add Prem & Sewa • 100% Gratis)
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Bukti Tanda Tangan</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <OfficialSignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        botName={botName}
        creatorName={creatorName}
      />
    </>
  );
};
