import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserMinus,
  CalendarPlus,
  Clock,
  Trash2,
  Plus,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  Layers,
  AlertCircle
} from 'lucide-react';
import { BotSession } from '../types';

interface OwnerControlPanelProps {
  session: BotSession;
  onRefreshSession?: () => void;
}

export const OwnerControlPanel: React.FC<OwnerControlPanelProps> = ({
  session,
  onRefreshSession,
}) => {
  const [premiumUsers, setPremiumUsers] = useState<string[]>(
    session.premiumUsers || [
      '6281234567890@s.whatsapp.net (Aktif: 30 Hari Bebas)',
      '6289876543210@s.whatsapp.net (Aktif: Permanen Bebas)',
    ]
  );
  const [rentalGroups, setRentalGroups] = useState<
    Array<{ id: string; name: string; daysLeft: number; status: string }>
  >([
    { id: '1203630283719@g.us', name: 'Komunitas Developer ID', daysLeft: 30, status: 'Aktif (Gratis Afan)' },
    { id: '1203630982341@g.us', name: 'Grup Mabar & Diskusi AI', daysLeft: 45, status: 'Aktif (Gratis Afan)' },
    { id: '1203631112233@g.us', name: 'Official Zbot afan Family', daysLeft: 365, status: 'Aktif (VIP Sultan)' },
  ]);

  const [newPremPhone, setNewPremPhone] = useState('');
  const [newPremDuration, setNewPremDuration] = useState('30 Hari Bebas');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDays, setNewGroupDays] = useState('30');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live owner data from backend
  const fetchOwnerData = async () => {
    try {
      const res = await fetch('/api/bot/owner/data');
      if (res.ok) {
        const data = await res.json();
        if (data.premiumUsers) setPremiumUsers(data.premiumUsers);
        if (data.rentalGroups) setRentalGroups(data.rentalGroups);
      }
    } catch (e) {
      console.error('Failed to fetch owner data', e);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const showAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleAddPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPremPhone.trim()) {
      showAlert('Masukkan nomor WhatsApp target!', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bot/owner/add-prem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: newPremPhone, duration: newPremDuration }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message, 'success');
        setPremiumUsers(data.premiumUsers);
        setNewPremPhone('');
        if (onRefreshSession) onRefreshSession();
      } else {
        showAlert(data.message || 'Gagal menambahkan premium', 'error');
      }
    } catch (err) {
      showAlert('Gagal menghubungi server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelPremium = async (targetEntry: string) => {
    const rawNumber = targetEntry.split('@')[0];
    try {
      const res = await fetch('/api/bot/owner/del-prem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: rawNumber }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message, 'success');
        setPremiumUsers(data.premiumUsers);
        if (onRefreshSession) onRefreshSession();
      }
    } catch (err) {
      showAlert('Gagal menghapus status premium', 'error');
    }
  };

  const handleAddSewa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showAlert('Masukkan nama grup tujuan sewa!', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bot/owner/add-sewa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName: newGroupName, days: newGroupDays }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message, 'success');
        setRentalGroups(data.rentalGroups);
        setNewGroupName('');
      } else {
        showAlert(data.message || 'Gagal menambahkan sewa', 'error');
      }
    } catch (err) {
      showAlert('Gagal menghubungi server sewa', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtendSewa = async (groupId: string, days: number = 30) => {
    try {
      const res = await fetch('/api/bot/owner/extend-sewa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, days }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message, 'success');
        setRentalGroups(data.rentalGroups);
      }
    } catch (err) {
      showAlert('Gagal memperpanjang sewa', 'error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-[#0b141d] border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>SUPER OWNER CONTROL PANEL</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              100% Bebas Biaya (Gratis)
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Otoritas Khusus: Afan</span>
            <span className="text-cyan-300 font-mono text-base md:text-lg">(08216787681)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Nomor ini memiliki otoritas mutlak untuk bebas <strong>.addprem</strong>, <strong>.delprem</strong>,{' '}
            <strong>.addsewa</strong>, dan <strong>.perpanjangsewa</strong> tanpa pungutan biaya apa pun.
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            👑
          </div>
          <div className="text-left text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Master Phone:</span>
            <span className="font-mono font-bold text-white text-sm">08216787681</span>
            <span className="text-emerald-400 text-[10px] block font-medium">Verified Sovereign Authority</span>
          </div>
        </div>
      </div>

      {/* Alert feedback */}
      {alertMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Two Column Layout: Premium Management & Rental Group Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1: Premium Management (.addprem / .delprem) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Kelola User Premium (.addprem / .delprem)</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              Total: {premiumUsers.length} VIP
            </span>
          </div>

          {/* Form Add Prem */}
          <form onSubmit={handleAddPremium} className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block">Tambah User Premium Baru (Gratis):</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newPremPhone}
                onChange={(e) => setNewPremPhone(e.target.value)}
                placeholder="Contoh: 628123456789"
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <select
                value={newPremDuration}
                onChange={(e) => setNewPremDuration(e.target.value)}
                className="px-2 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="30 Hari Bebas">30 Hari</option>
                <option value="60 Hari Bebas">60 Hari</option>
                <option value="365 Hari Bebas">1 Tahun</option>
                <option value="Permanen Bebas">Permanen</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah ke VIP Premium (Gratis)</span>
            </button>
          </form>

          {/* List of Active Premium Users */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">Daftar Pengguna Premium Aktif:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {premiumUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="font-mono text-slate-200 text-[11px] truncate">{user}</span>
                  </div>
                  <button
                    onClick={() => handleDelPremium(user)}
                    title="Hapus Status Premium (.delprem)"
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Box 2: Rental Group Management (.addsewa / .perpanjangsewa) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Kelola Sewa Grup (.addsewa / .perpanjangsewa)</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
              Total: {rentalGroups.length} Grup
            </span>
          </div>

          {/* Form Add Sewa */}
          <form onSubmit={handleAddSewa} className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block">Tambah Sewa Grup Baru (Bebas Biaya):</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nama Grup WhatsApp"
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="number"
                value={newGroupDays}
                onChange={(e) => setNewGroupDays(e.target.value)}
                placeholder="Durasi (Hari)"
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aktifkan Sewa Grup (Gratis)</span>
            </button>
          </form>

          {/* List of Rental Groups */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">Daftar Grup Sewa Aktif:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {rentalGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs gap-2"
                >
                  <div className="truncate">
                    <span className="font-semibold text-white block truncate">{grp.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Sisa: {grp.daysLeft} hari • {grp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleExtendSewa(grp.id, 30)}
                      title="Perpanjang +30 Hari Bebas (.perpanjangsewa)"
                      className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-[10px] flex items-center gap-1 transition-all"
                    >
                      <Clock className="w-3 h-3" />
                      <span>+30 Hari</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Super Owner Afan dapat menjalankan perintah ini langsung via WhatsApp atau melalui panel web ini.</span>
        </div>
        <span className="font-mono text-cyan-300 font-semibold">Node.js Baileys v6.7.x Multi-Device</span>
      </div>
    </div>
  );
};
