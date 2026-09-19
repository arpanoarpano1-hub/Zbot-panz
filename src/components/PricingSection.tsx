import React from 'react';
import { Check, Zap, Sparkles, Shield, ArrowRight, Star } from 'lucide-react';
import { RENTAL_PLANS } from '../data/botFeatures';
import { RentalPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: RentalPlan) => void;
  selectedPlanId?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  selectedPlanId = 'monthly',
}) => {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-10">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Gratis Tanpa Biaya • Karya Resmi Afan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Akses Bot WhatsApp & Lisensi Bebas Biaya
        </h2>
        <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
          Semua fitur Zbot afan dapat Anda gunakan secara <span className="text-emerald-400 font-semibold">GRATIS TANPA BIAYA</span>. Khusus Super Owner <strong className="text-white">Afan (08216787681)</strong>, tersedia akses master tak terbatas untuk bebas <code className="text-cyan-300 font-mono text-xs">.addprem</code>, <code className="text-cyan-300 font-mono text-xs">.delprem</code>, <code className="text-cyan-300 font-mono text-xs">.addsewa</code>, dan <code className="text-cyan-300 font-mono text-xs">.perpanjangsewa</code>.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {RENTAL_PLANS.map((plan) => {
          const isPopular = plan.popular;
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative ${
                isPopular
                  ? 'bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2'
                  : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase shadow-sm ${
                    isPopular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-4">Durasi: {plan.period}</p>

                {/* Price */}
                <div className="mb-6 pb-4 border-b border-slate-800">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {plan.formattedPrice}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">/ {plan.period}</span>
                </div>

                {/* Feature List */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isPopular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <span>Pilih Paket Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Guarantees banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Pairing Code Tanpa Scan QR
          </h4>
          <p className="text-xs text-slate-300">
            Aktivasi langsung dari handphone hanya dengan memasukkan 8 karakter kode ke menu Perangkat Tertaut.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Anti Logout & Auto Reconnect
          </h4>
          <p className="text-xs text-slate-300">
            Sesi bot otomatis tersimpan dengan aman di server Node.js Baileys dan otomatis reconnect bila sinyal terputus.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Owner Afan (08216787681)</span>
          </h4>
          <p className="text-xs text-slate-300">
            Nomor resmi <strong>08216787681</strong> memiliki hak otoritas penuh: bebas menambah/menghapus premium & bebas memperpanjang sewa kapan saja gratis.
          </p>
        </div>
      </div>
    </div>
  );
};
