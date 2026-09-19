import React, { useState } from 'react';
import {
  Shield,
  Users,
  Lock,
  Unlock,
  Bell,
  Megaphone,
  UserX,
  RefreshCw,
  Plus,
  MessageSquare,
  AlertOctagon,
  CheckCircle2,
  Trash2,
  Send,
  Zap,
  Radio
} from 'lucide-react';
import { GroupConfig } from '../types';

interface GroupManagerProps {
  groups: GroupConfig[];
  onToggleGroupSetting: (groupId: string, key: keyof GroupConfig) => void;
  onAddGroup: (name: string, membersCount: number) => void;
  onRemoveGroup: (groupId: string) => void;
  onRunGroupCommand: (cmd: string) => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({
  groups,
  onToggleGroupSetting,
  onAddGroup,
  onRemoveGroup,
  onRunGroupCommand,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [hidetagText, setHidetagText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.id || '');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddGroup(newGroupName, Math.floor(Math.random() * 300) + 50);
    setNewGroupName('');
    notify('Grup baru berhasil ditambahkan ke sistem sewa bot!');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    onRunGroupCommand(`.bc ${broadcastMessage}`);
    notify(`Pesan broadcast dikirim ke ${groups.length} grup terdaftar!`);
    setBroadcastMessage('');
  };

  const handleHidetag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hidetagText.trim()) return;
    onRunGroupCommand(`.hidetag ${hidetagText}`);
    notify('Perintah Hidetag berhasil disebarkan ke grup!');
    setHidetagText('');
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Pengelola Grup Canggih (Node.js Baileys Group Admin)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manajemen & Keamanan Grup WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau dan kendalikan seluruh grup tempat bot Anda berada: proteksi anti-link, hidetag darurat, welcome greeting, dan filter spam.
          </p>
        </div>

        {actionSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Broadcast Multi-Group */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Broadcast Semua Grup</h4>
                <p className="text-[11px] text-slate-400">Kirim pesan serentak ke {groups.length} grup</p>
              </div>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Ketik pesan broadcast / pengumuman penting..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Broadcast (.bc)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Hidetag Announcer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Hidetag Pengumuman</h4>
                <p className="text-[11px] text-slate-400">Tag semua member tanpa teks nomor panjang</p>
              </div>
            </div>

            <form onSubmit={handleHidetag} className="space-y-3">
              <textarea
                value={hidetagText}
                onChange={(e) => setHidetagText(e.target.value)}
                placeholder="Ketik pengumuman (misal: Rapat malam ini jam 20.00 WIB)..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Eksekusi Hidetag (.ht)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Card 3: Tambah Grup via Invite Link / Name */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Tambahkan Grup Baru</h4>
                <p className="text-[11px] text-slate-400">Daftarkan grup baru ke sistem bot</p>
              </div>
            </div>

            <form onSubmit={handleAddGroupSubmit} className="space-y-3">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nama grup baru atau Link Undangan..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Daftarkan Grup Baru</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* List of Managed Groups with Security Toggles */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <span>Daftar Grup Aktif ({groups.length} Grup Terkelola)</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {group.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-white">{group.name}</h4>
                      {group.botIsAdmin ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          Admin Bot 🛡️
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          Member Biasa
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      ID: {group.id} • <Users className="w-3 h-3 inline mr-1" />
                      {group.membersCount} Peserta
                    </p>
                  </div>
                </div>

                {/* Group Admin Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      onRunGroupCommand(`.group ${group.isMuted ? 'open' : 'close'}`);
                      onToggleGroupSetting(group.id, 'isMuted');
                      notify(`Setelan grup ${group.name} berhasil diubah!`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      group.isMuted
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {group.isMuted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{group.isMuted ? 'Grup Ditutup (Admin Saja)' : 'Tutup Grup (.group close)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onRunGroupCommand(`.tagall Perhatian member ${group.name}!`);
                      notify(`Perintah .tagall dikirim ke ${group.name}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Tag All (.tagall)</span>
                  </button>

                  <button
                    onClick={() => {
                      onRunGroupCommand(`.revoke`);
                      notify(`Link undangan ${group.name} berhasil di-reset (.revoke)!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Link</span>
                  </button>

                  <button
                    onClick={() => onRemoveGroup(group.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                    title="Keluarkan bot dari grup"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Group Security Feature Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-4">
                {/* Antilink */}
                <div
                  onClick={() => onToggleGroupSetting(group.id, 'antilink')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    group.antilink
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Anti-Link</span>
                    <span className="text-[10px] font-mono">{group.antilink ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Hapus pesan & kick pengirim link
                  </p>
                </div>

                {/* Antispam */}
                <div
                  onClick={() => onToggleGroupSetting(group.id, 'antispam')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    group.antispam
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Anti-Spam</span>
                    <span className="text-[10px] font-mono">{group.antispam ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Cegah spam & flood pesan
                  </p>
                </div>

                {/* Antitoxic */}
                <div
                  onClick={() => onToggleGroupSetting(group.id, 'antitoxic')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    group.antitoxic
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Anti-Toxic</span>
                    <span className="text-[10px] font-mono">{group.antitoxic ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Filter kata kasar & sara
                  </p>
                </div>

                {/* Welcome */}
                <div
                  onClick={() => onToggleGroupSetting(group.id, 'welcome')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    group.welcome
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Welcome Card</span>
                    <span className="text-[10px] font-mono">{group.welcome ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Sambut member baru otomatis
                  </p>
                </div>

                {/* Goodbye */}
                <div
                  onClick={() => onToggleGroupSetting(group.id, 'goodbye')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    group.goodbye
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Goodbye Msg</span>
                    <span className="text-[10px] font-mono">{group.goodbye ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Salam perpisahan member keluar
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
