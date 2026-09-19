import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Shield,
  Smile,
  Cpu,
  Download,
  Wrench,
  Gamepad2,
  Crown,
  Check,
  Zap,
  Terminal,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Eye
} from 'lucide-react';
import { BotFeature, FeatureCategory } from '../types';
import { WhatsAppMenuModal } from './WhatsAppMenuModal';
import { SHORTCUT_COMMANDS } from '../data/menuTemplates';

interface FeaturesCatalogProps {
  features: BotFeature[];
  onToggleFeature: (id: string) => void;
  onSelectCommandForTest: (command: string) => void;
  prefix: string;
}

export const FeaturesCatalog: React.FC<FeaturesCatalogProps> = ({
  features,
  onToggleFeature,
  onSelectCommandForTest,
  prefix,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FeatureCategory>('all');
  const [permissionFilter, setPermissionFilter] = useState<'all' | 'admin' | 'owner'>('all');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: `Semua (${features.length})`, icon: Zap, count: features.length },
    { id: 'exclusive', label: 'Eksklusif (Tidak Pasaran)', icon: Sparkles, count: features.filter(f => f.category === 'exclusive').length },
    { id: 'group', label: 'Pengelola Grup', icon: Shield, count: features.filter(f => f.category === 'group').length },
    { id: 'sticker', label: 'Stiker & Audio', icon: Smile, count: features.filter(f => f.category === 'sticker').length },
    { id: 'ai', label: 'AI & Gemini', icon: Cpu, count: features.filter(f => f.category === 'ai').length },
    { id: 'downloader', label: 'Downloader', icon: Download, count: features.filter(f => f.category === 'downloader').length },
    { id: 'tools', label: 'Utilitas & OS', icon: Wrench, count: features.filter(f => f.category === 'tools').length },
    { id: 'games', label: 'Games & Fun', icon: Gamepad2, count: features.filter(f => f.category === 'games').length },
    { id: 'owner', label: 'Sewa & Owner', icon: Crown, count: features.filter(f => f.category === 'owner').length },
  ];

  const filteredFeatures = useMemo(() => {
    return features.filter((feat) => {
      const matchCat = selectedCategory === 'all' || feat.category === selectedCategory;
      const matchPerm = permissionFilter === 'all' || feat.permission === permissionFilter;
      const matchQuery =
        searchQuery === '' ||
        feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchPerm && matchQuery;
    });
  }, [features, selectedCategory, permissionFilter, searchQuery]);

  const activeCount = features.filter((f) => f.enabled).length;

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Lengkap Perintah Bot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            100+ Fitur Canggih Bot WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mulai dari pengelola grup ketat, pembuat stiker viral, AI Gemini asisten, downloader, hingga utilitas VPS Ubuntu & macOS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all border border-emerald-400/30"
          >
            <Smartphone className="w-4 h-4" />
            <span>Lihat Menu WA Rapi & Teratur</span>
          </button>
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Aktif: <span className="font-bold text-emerald-400">{activeCount}</span> / {features.length} Fitur
          </div>
        </div>
      </div>

      {/* Quick Fast-Typing Shortcut Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/20 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Command Singkat (Mudah Diketik di HP):</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                1-3 Huruf
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Cukup ketik shortcut di bawah tanpa perlu mengetik nama perintah yang panjang.
            </p>
          </div>
        </div>

        {/* Shortcut Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SHORTCUT_COMMANDS.slice(0, 8).map((sc) => {
            const shortDisplay = sc.short.replace(/^\./, prefix);
            return (
              <button
                key={sc.short}
                onClick={() => onSelectCommandForTest(shortDisplay)}
                title={`${sc.desc} (${sc.full})`}
                className="px-2 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-600 hover:text-white border border-slate-700/60 text-emerald-400 font-mono text-xs font-bold transition-all flex items-center gap-1"
              >
                <span>{shortDisplay}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">
                  {sc.cat}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition-all"
          >
            +14 Lainnya
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari perintah (misal: .antilink, .s, .ai, .tiktok, .speed)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </div>

          {/* Permission Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Akses:</span>
            <button
              onClick={() => setPermissionFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                permissionFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setPermissionFilter('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                permissionFilter === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setPermissionFilter('owner')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                permissionFilter === 'owner' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Owner
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feat) => {
          // Adjust command display with selected prefix
          const displayCommand = feat.command.replace(/^\./, prefix);

          return (
            <div
              key={feat.id}
              className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                feat.enabled
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
                  : 'bg-slate-950/50 border-slate-900 opacity-60'
              }`}
            >
              <div>
                {/* Card Top: Command & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                      {displayCommand}
                    </span>
                    {feat.shortCmd && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold" title="Command Singkat Mudah Diketik">
                        ⚡ {feat.shortCmd.replace(/^\./, prefix)}
                      </span>
                    )}
                    {feat.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                        Viral 🔥
                      </span>
                    )}
                    {feat.category === 'exclusive' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Eksklusif</span>
                      </span>
                    )}
                  </div>

                  {/* Permission badge */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium capitalize ${
                      feat.permission === 'owner'
                        ? 'bg-purple-950/60 border border-purple-500/30 text-purple-300'
                        : feat.permission === 'admin'
                        ? 'bg-amber-950/60 border border-amber-500/30 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {feat.permission === 'owner' ? 'Owner Only' : feat.permission === 'admin' ? 'Admin Grup' : 'Semua Member'}
                  </span>
                </div>

                {/* Name & Description */}
                <h4 className="text-sm font-bold text-white mb-1">{feat.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {feat.description}
                </p>

                {/* Usage Example */}
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 mb-3 truncate">
                  <span className="text-slate-500 select-none">Contoh: </span>
                  <span className="text-emerald-400">{feat.example.replace(/^\./, prefix)}</span>
                </div>
              </div>

              {/* Card Footer: Toggle Switch & Test Command */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      onChange={() => onToggleFeature(feat.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    {feat.enabled ? 'Aktif' : 'Off'}
                  </span>
                </label>

                <button
                  onClick={() => onSelectCommandForTest(displayCommand)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Coba di Terminal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Tidak ada fitur yang cocok dengan pencarian Anda.</p>
        </div>
      )}

      {/* WhatsApp Menu Modal Preview */}
      <WhatsAppMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        botName="Zbot afan"
        prefix={prefix}
        onTestInTerminal={onSelectCommandForTest}
      />
    </div>
  );
};
