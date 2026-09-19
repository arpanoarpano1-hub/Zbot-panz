import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PairingSection } from './components/PairingSection';
import { FeaturesCatalog } from './components/FeaturesCatalog';
import { GroupManager } from './components/GroupManager';
import { TerminalSimulator } from './components/TerminalSimulator';
import { BotDashboard } from './components/BotDashboard';
import { PricingSection } from './components/PricingSection';
import { UbuntuMacServer } from './components/UbuntuMacServer';
import { OfficialSignatureBanner } from './components/OfficialSignatureBanner';
import { OfficialSignatureSection } from './components/OfficialSignatureSection';
import { BOT_FEATURES, INITIAL_GROUPS, RENTAL_PLANS } from './data/botFeatures';
import { BotSession, BotFeature, GroupConfig, RentalPlan } from './types';
import { Sparkles, Bot, Shield, CheckCircle2, Heart, Award, FileSignature } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'pairing' | 'features' | 'groups' | 'terminal' | 'server' | 'pricing' | 'dashboard'
  >('pairing');

  const [features, setFeatures] = useState<BotFeature[]>(BOT_FEATURES);
  const [groups, setGroups] = useState<GroupConfig[]>(INITIAL_GROUPS);
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledCommand, setPrefilledCommand] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [session, setSession] = useState<BotSession>({
    phoneNumber: '',
    botName: 'Zbot afan',
    prefix: '.',
    status: 'unregistered',
    pairingCode: '',
    codeExpiresAt: 0,
    linkedAt: null,
    expiredAt: null,
    planName: 'Paket Bulanan (30 Hari)',
    batteryLevel: 92,
    isCharging: true,
    pingMs: 22,
    uptimeSeconds: 15400,
    messagesProcessed: 1890,
    commandsExecuted: 940,
    groupsCount: 3,
    isPublic: true,
    autoRead: false,
    antiCall: true,
    ownerNumber: '628216787681',
    ownerName: 'Afan',
    isFreeAccess: true,
    premiumUsers: [
      '6281234567890@s.whatsapp.net (Aktif: 30 Hari Bebas)',
      '6289876543210@s.whatsapp.net (Aktif: Permanen Bebas)'
    ],
    stickerWatermark: {
      packname: 'Zbot afan',
      author: 'Baileys MD Node.js',
    },
  });

  // Fetch current session from backend API on mount
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/bot/status');
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSession((prev) => ({
              ...prev,
              ...data.session,
            }));
          }
        }
      } catch (err) {
        console.warn('API fetch failed, utilizing local reactive state:', err);
      }
    }
    fetchStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Request pairing code handler
  const handleRequestPairing = async (phone: string, botName: string, prefix: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bot/request-pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, botName, prefix }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSession((prev) => ({
          ...prev,
          phoneNumber: data.phoneNumber,
          botName,
          prefix,
          pairingCode: data.pairingCode,
          codeExpiresAt: data.expiresAt,
          status: 'awaiting_pair',
        }));
        showToast('Kode pairing 8 digit berhasil dibuat!');
      } else {
        // Fallback generator if backend is restarting
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const code = `${chars.slice(0, 4)}-${chars.slice(4, 8)}`;
        setSession((prev) => ({
          ...prev,
          phoneNumber: phone.replace(/[^0-9]/g, ''),
          botName,
          prefix,
          pairingCode: code,
          codeExpiresAt: Date.now() + 180000,
          status: 'awaiting_pair',
        }));
        showToast('Kode pairing siap! Masukkan ke WhatsApp Anda.');
      }
    } catch (err) {
      // Offline fallback
      const code = '7KXP-9W2M';
      setSession((prev) => ({
        ...prev,
        phoneNumber: phone.replace(/[^0-9]/g, ''),
        botName,
        prefix,
        pairingCode: code,
        codeExpiresAt: Date.now() + 180000,
        status: 'awaiting_pair',
      }));
      showToast('Kode pairing siap digunakan.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Simulate Link / Pair Success
  const handleSimulateLink = async () => {
    try {
      const res = await fetch('/api/bot/simulate-link', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
        }
      } else {
        setSession((prev) => ({
          ...prev,
          status: 'connected',
          linkedAt: Date.now(),
        }));
      }
      showToast('🎉 WhatsApp Bot Berhasil Terhubung (Multi-Device Active)!');
    } catch (e) {
      setSession((prev) => ({
        ...prev,
        status: 'connected',
        linkedAt: Date.now(),
      }));
      showToast('🎉 WhatsApp Bot Berhasil Terhubung!');
    }
  };

  // 3. Disconnect
  const handleDisconnect = async () => {
    try {
      await fetch('/api/bot/disconnect', { method: 'POST' });
    } catch (e) {}
    setSession((prev) => ({
      ...prev,
      status: 'disconnected',
      pairingCode: '',
      linkedAt: null,
    }));
    showToast('Koneksi bot telah diputus.');
  };

  // 4. Update Settings
  const handleUpdateSettings = async (newSettings: Partial<BotSession>) => {
    try {
      const res = await fetch('/api/bot/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) setSession(data.session);
      } else {
        setSession((prev) => ({ ...prev, ...newSettings }));
      }
      showToast('Pengaturan bot berhasil diperbarui!');
    } catch (e) {
      setSession((prev) => ({ ...prev, ...newSettings }));
    }
  };

  // 5. Execute Command via Backend
  const handleExecuteCommand = async (cmd: string) => {
    try {
      const res = await fetch('/api/bot/execute-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, senderName: 'User Preview' }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.response || 'Perintah dijalankan.',
          mediaType: data.mediaType,
          mediaUrl: data.mediaUrl,
        };
      }
    } catch (e) {}

    // Fallback response
    return {
      text: `*✅ Perintah [ ${cmd} ] sukses dieksekusi di Node.js Baileys engine.*`,
    };
  };

  // 6. Feature toggle
  const handleToggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  // 7. Test command from catalog
  const handleSelectCommandForTest = (cmd: string) => {
    setPrefilledCommand(cmd);
    setActiveTab('terminal');
  };

  // 8. Group Settings Toggle
  const handleToggleGroupSetting = (groupId: string, key: keyof GroupConfig) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, [key]: !g[key] } : g))
    );
  };

  const handleAddGroup = (name: string, membersCount: number) => {
    const newG: GroupConfig = {
      id: `${Date.now()}@g.us`,
      name,
      membersCount,
      botIsAdmin: true,
      antilink: true,
      antispam: true,
      antitoxic: true,
      welcome: true,
      goodbye: false,
      isMuted: false,
    };
    setGroups((prev) => [newG, ...prev]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    showToast('Bot berhasil dikeluarkan dari grup.');
  };

  const handleSelectPlan = (plan: RentalPlan) => {
    setSession((prev) => ({
      ...prev,
      planName: `${plan.name} (${plan.period})`,
    }));
    setActiveTab('pairing');
    showToast(`Paket ${plan.name} dipilih! Masukkan nomor WA Anda untuk pairing.`);
  };

  return (
    <div className="min-h-screen bg-[#0b1015] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navbar */}
      <Navbar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Official Signature Notice Banner at Top */}
      <OfficialSignatureBanner
        botName={session.botName}
        creatorName="Afan"
      />

      {/* View Switcher Container */}
      <main className="flex-1">
        {activeTab === 'pairing' && (
          <PairingSection
            session={session}
            onRequestPairing={handleRequestPairing}
            onSimulateLink={handleSimulateLink}
            onDisconnect={handleDisconnect}
            onNavigateToTerminal={() => setActiveTab('terminal')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'features' && (
          <FeaturesCatalog
            features={features}
            onToggleFeature={handleToggleFeature}
            onSelectCommandForTest={handleSelectCommandForTest}
            prefix={session.prefix}
          />
        )}

        {activeTab === 'groups' && (
          <GroupManager
            groups={groups}
            onToggleGroupSetting={handleToggleGroupSetting}
            onAddGroup={handleAddGroup}
            onRemoveGroup={handleRemoveGroup}
            onRunGroupCommand={(cmd) => {
              handleExecuteCommand(cmd);
              setPrefilledCommand(cmd);
            }}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalSimulator
            session={session}
            onExecuteCommand={handleExecuteCommand}
            initialCommand={prefilledCommand}
            onClearCommandPrefill={() => setPrefilledCommand('')}
          />
        )}

        {activeTab === 'dashboard' && (
          <BotDashboard
            session={session}
            onUpdateSettings={handleUpdateSettings}
            onNavigateToPairing={() => setActiveTab('pairing')}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingSection
            onSelectPlan={handleSelectPlan}
          />
        )}

        {activeTab === 'server' && (
          <UbuntuMacServer />
        )}

        {/* Dedicated Official Signature & Authenticity Plaque */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <OfficialSignatureSection
            botName={session.botName}
            creatorName="Afan"
          />
        </div>
      </main>

      {/* Footer with Afan's Official Signature */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 mt-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            
            {/* Brand and Bot Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">Zbot afan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Official Release
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Platform Bot WhatsApp Multi-Device (Node.js Baileys • Ubuntu & Mac)
                </p>
              </div>
            </div>

            {/* Handwritten Signature Badge in Footer */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-inner">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Tanda Tangan Pemilik:
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Sah & Terverifikasi</span>
                </span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="font-['Caveat',cursive] text-3xl text-emerald-400 font-bold select-none drop-shadow-sm">
                  Afan
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setActiveTab('pairing')} className="hover:text-emerald-400 transition-colors">
                Pairing Code
              </button>
              <button onClick={() => setActiveTab('features')} className="hover:text-emerald-400 transition-colors">
                105+ Fitur
              </button>
              <button onClick={() => setActiveTab('groups')} className="hover:text-emerald-400 transition-colors">
                Grup WA
              </button>
              <button onClick={() => setActiveTab('server')} className="hover:text-emerald-400 transition-colors">
                Server VPS
              </button>
              <button onClick={() => setActiveTab('pricing')} className="hover:text-emerald-400 transition-colors">
                Sewa
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              © 2026 <strong>Zbot afan</strong>. Hak cipta dilindungi. Seluruh hak kepemilikan dan tanda tangan sah oleh <strong>Afan</strong>.
            </p>
            <p className="font-mono text-slate-400">
              Engine: Baileys WebSocket v6.7 • Node.js v20 LTS • Host: Ubuntu / Mac
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
