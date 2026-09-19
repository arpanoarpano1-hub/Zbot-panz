import React, { useState } from 'react';
import { Bot, Shield, Terminal, Zap, CheckCircle2, AlertCircle, Smartphone, Server, FileSignature, Award } from 'lucide-react';
import { BotSession } from '../types';
import { OfficialSignatureModal } from './OfficialSignatureModal';

interface NavbarProps {
  session: BotSession;
  activeTab: 'pairing' | 'features' | 'groups' | 'terminal' | 'server' | 'pricing' | 'dashboard';
  setActiveTab: (tab: 'pairing' | 'features' | 'groups' | 'terminal' | 'server' | 'pricing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ session, activeTab, setActiveTab }) => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const isConnected = session.status === 'connected';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b1015]/90 border-b border-emerald-900/20 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Zbot <span className="text-emerald-400">afan</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Resmi</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Bot WhatsApp Multi-Device (105+ Fitur) • Tanda Tangan Sah: <strong className="text-emerald-300 font-semibold">Afan</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pairing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'pairing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Daftar & Pairing
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'features'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            100+ Fitur Bot
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'groups'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Pengelola Grup
          </button>

          <button
            onClick={() => setActiveTab('server')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'server'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            Server Ubuntu/Mac
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal Uji Coba
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Paket Sewa
          </button>
        </nav>

        {/* Live Bot Connection Status & Official Signature */}
        <div className="flex items-center gap-2">
          {/* Creator Signature Button */}
          <button
            onClick={() => setIsSignatureModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm group"
            title="Lihat Tanda Tangan & Hak Cipta Resmi Afan"
          >
            <span className="font-['Caveat',cursive] text-lg text-emerald-400 font-bold group-hover:scale-105 transition-transform">
              ✍️ Afan
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans font-semibold hidden sm:inline">
              Sah & Terverifikasi
            </span>
          </button>

          {isConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-medium hidden sm:inline">+{session.phoneNumber}</span>
              <span className="font-semibold">Aktif</span>
            </div>
          ) : session.status === 'awaiting_pair' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-medium">Menunggu Pairing</span>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('pairing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tautkan Nomor</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-between overflow-x-auto gap-1 mt-2.5 pt-2 border-t border-slate-800/60 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('pairing')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'pairing' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Pairing
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'features' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          100+ Fitur
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'groups' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Grup
        </button>
        <button
          onClick={() => setActiveTab('server')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'server' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Ubuntu/Mac
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'terminal' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
            activeTab === 'pricing' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          Sewa
        </button>
      </div>

      {/* Official Signature Modal */}
      <OfficialSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        botName="Zbot afan"
        creatorName="Afan"
      />
    </header>
  );
};
