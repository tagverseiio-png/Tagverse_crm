'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, X, Plus, AlertCircle, RefreshCw, Layers, Sparkles, TrendingUp
} from 'lucide-react';

// --- PLATFORM BRAND DETAILS ---
const PLATFORM_DETAILS: Record<string, any> = {
  linkedin: {
    name: 'LinkedIn',
    colorText: '#2563eb', // blue-600
    colorBg: 'rgba(37, 99, 235, 0.1)',
    colorBorder: 'rgba(37, 99, 235, 0.3)',
    icon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  instagram: {
    name: 'Instagram',
    colorText: '#ec4899', // pink-500
    colorBg: 'rgba(236, 72, 153, 0.1)',
    colorBorder: 'rgba(236, 72, 153, 0.3)',
    icon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  twitter: {
    name: 'Twitter / X',
    colorText: 'var(--text-primary)', // slate-300
    colorBg: 'rgba(255, 255, 255, 0.1)',
    colorBorder: 'var(--border)',
    icon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
};

const INITIAL_ACCOUNTS = [
  { platform: 'linkedin', connected: true, followers: 14250, engagement: 4.8, postsThisMonth: 12, impressions: 48500, growth: 68 },
  { platform: 'instagram', connected: true, followers: 28400, engagement: 6.2, postsThisMonth: 18, impressions: 124000, growth: 82 },
  { platform: 'twitter', connected: false, followers: 0, engagement: 0, postsThisMonth: 0, impressions: 0, growth: 0 }
];

type Post = {
  id: string;
  platform: string; // The backend uses single platform for now
  content: string;
  mediaUrl?: string | null;
  status: string; // 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published'
  scheduledTime: string;
  createdAt: string;
};

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 6,
};

export default function SocialMediaManager() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<{id: string, message: string, type: string}[]>([]);
  const [postForm, setPostForm] = useState({ platform: 'linkedin', text: '', scheduleDate: '', scheduleTime: '', mode: 'schedule' as 'now' | 'schedule' });

  // Simulation Controls State
  const [simulatedLatency, setSimulatedLatency] = useState(500); 
  const [simulateError, setSimulateError] = useState(false);
  const [isKpiLoading, setIsKpiLoading] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fetch posts from real backend
  const fetchPosts = async () => {
    try {
      const resScheduled = await fetch('/api/social?status=scheduled');
      const resPublished = await fetch('/api/social?status=published');
      
      const jsonScheduled = await resScheduled.json();
      const jsonPublished = await resPublished.json();
      
      const mapPost = (p: any) => ({
        id: p.id,
        platform: p.platform.toLowerCase().replace(' / x', ''), 
        content: p.content,
        mediaUrl: null, // API doesn't support media yet
        status: p.status === 'scheduled' ? 'pending' : 'published', // Map scheduled to pending for approval queue
        scheduledTime: p.scheduledAt || new Date().toISOString(),
        createdAt: p.createdAt || new Date().toISOString()
      });

      const allPosts = [
        ...(jsonScheduled.data || []).map(mapPost),
        ...(jsonPublished.data || []).map(mapPost)
      ];

      // Sort by creation desc
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPosts(allPosts);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch posts from server", "error");
    } finally {
      setIsKpiLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, simulatedLatency);
    return () => clearTimeout(timer);
  }, []);

  const mockApiCall = async (actionFn: () => void, successMsg: string, failMsg: string) => {
    if (simulatedLatency > 0) {
      await new Promise(resolve => setTimeout(resolve, simulatedLatency));
    }
    
    if (simulateError) {
      showToast(failMsg || "API Error: Operation failed on the server.", "error");
      throw new Error("Simulated API failure");
    } else {
      actionFn();
      if (successMsg) showToast(successMsg, "success");
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    const isConnecting = !accounts.find(a => a.platform === platform)?.connected;
    
    // Optimistic Update
    setAccounts(prev => prev.map(acc => {
      if (acc.platform === platform) {
        return {
          ...acc,
          connected: isConnecting,
          followers: isConnecting ? Math.floor(Math.random() * 15000) + 1200 : 0,
          engagement: isConnecting ? parseFloat((Math.random() * 5 + 2).toFixed(1)) : 0,
          postsThisMonth: isConnecting ? Math.floor(Math.random() * 20) + 2 : 0,
          impressions: isConnecting ? Math.floor(Math.random() * 50000) + 5000 : 0,
          growth: isConnecting ? Math.floor(Math.random() * 50) + 30 : 0
        };
      }
      return acc;
    }));

    try {
      await mockApiCall(
        () => {}, 
        `${PLATFORM_DETAILS[platform].name} successfully ${isConnecting ? 'connected' : 'disconnected'}!`,
        `Failed to change connection state for ${PLATFORM_DETAILS[platform].name}.`
      );
    } catch (err) {
      // Rollback
      setAccounts(prev => prev.map(acc => {
        if (acc.platform === platform) {
          return { ...acc, connected: !isConnecting };
        }
        return acc;
      }));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.text.trim()) return;

    let dt = new Date();
    if (postForm.mode === 'schedule' && postForm.scheduleDate && postForm.scheduleTime) {
      dt = new Date(`${postForm.scheduleDate}T${postForm.scheduleTime}`);
    }

    const platformProper = postForm.platform === 'linkedin' ? 'LinkedIn' : postForm.platform === 'instagram' ? 'Instagram' : 'Twitter / X';
    const status = postForm.mode === 'schedule' ? 'scheduled' : 'published';

    try {
      await mockApiCall(
        async () => {
          // Send to real backend
          await fetch('/api/social', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform: platformProper,
              content: postForm.text,
              scheduledAt: dt.toISOString(),
              status: status,
            })
          });
        },
        `Post ${status === 'scheduled' ? 'scheduled for approval' : 'published directly'}!`,
        "Failed to create new post. Rollback performed."
      );
      setIsCreateModalOpen(false);
      setPostForm({ platform: 'linkedin', text: '', scheduleDate: '', scheduleTime: '', mode: 'schedule' });
      fetchPosts();
    } catch (err) {
      // Handled by mockApiCall
    }
  };

  const handleApprovePost = async (id: string) => {
    const originalPosts = [...posts];
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
    showToast("Post status updated: Approved & Published!", "info");

    try {
      await mockApiCall(
        async () => {
          await fetch(`/api/social/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'published' })
          });
        }, 
        "Post successfully queued & scheduled for distribution!",
        "Approval failed on server. Rolling back status."
      );
      fetchPosts();
    } catch (err) {
      setPosts(originalPosts);
    }
  };

  const handleRejectPost = async (id: string) => {
    const originalPosts = [...posts];
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast("Post rejected.", "info");

    try {
      await mockApiCall(
        async () => {
          await fetch(`/api/social/${id}`, { method: 'DELETE' });
        },
        "Post marked as rejected and removed from pending queue.",
        "Rejection failed on server. Rolling back status."
      );
    } catch (err) {
      setPosts(originalPosts);
    }
  };

  const kpiStats = useMemo(() => {
    const connectedAccounts = accounts.filter(a => a.connected);
    const totalFollowers = connectedAccounts.reduce((sum, a) => sum + a.followers, 0);
    const totalPostsThisMonth = connectedAccounts.reduce((sum, a) => sum + a.postsThisMonth, 0);
    const avgEngagement = connectedAccounts.length > 0 
      ? (connectedAccounts.reduce((sum, a) => sum + a.engagement, 0) / connectedAccounts.length).toFixed(1)
      : '0.0';
    const pendingCount = posts.filter(p => p.status === 'pending').length;

    return { totalFollowers, totalPostsThisMonth, avgEngagement: `${avgEngagement}%`, pendingCount };
  }, [accounts, posts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 64 }}>
      
      {/* Toast Alert Container */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2050, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, width: '100%' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: 16, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12, animation: 'slideIn 0.3s ease',
            background: t.type === 'error' ? 'var(--rose-dim)' : t.type === 'info' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${t.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : t.type === 'info' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: t.type === 'error' ? 'var(--rose)' : t.type === 'info' ? 'var(--amber)' : 'var(--emerald)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ marginTop: 2 }}>
              {t.type === 'error' ? <AlertCircle size={20} /> : t.type === 'info' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{t.message}</p>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* HEADER SECTION */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 12, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: 16, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <Sparkles size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>SocialPulse</h1>
                <span style={{ fontSize: 11, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(99, 102, 241, 0.2)' }}>Enterprise Creator Suite</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Manage networks, engage audiences, and monitor brand growth</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Simulation controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>API Testing Tools:</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: simulateError ? 'var(--rose)' : 'var(--text-secondary)', fontWeight: simulateError ? 700 : 500 }}>
                <input type="checkbox" checked={simulateError} onChange={e => setSimulateError(e.target.checked)} style={{ cursor: 'pointer' }} />
                Force Failures
              </label>
              <div style={{ width: 1, height: 16, background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Latency:</span>
                <select value={simulatedLatency} onChange={e => setSimulatedLatency(Number(e.target.value))} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                  <option value={0}>0ms (Instant)</option>
                  <option value={500}>500ms</option>
                  <option value={1500}>1.5s (Slow)</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ gap: 8, padding: '10px 20px', background: 'linear-gradient(to right, #6366f1, #8b5cf6)', border: 'none' }}>
              <Plus size={18} /> Create Post
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {isKpiLoading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="card" style={{ padding: 20, minHeight: 120 }}>
            <div style={{ animation: 'pulse 2s infinite' }}>
              <div style={{ height: 16, width: '50%', background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 12 }}></div>
              <div style={{ height: 32, width: '80%', background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 8 }}></div>
              <div style={{ height: 12, width: '60%', background: 'var(--bg-secondary)', borderRadius: 4 }}></div>
            </div>
          </div>
        )) : (
          <>
            <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Total Followers</span>
                <span style={{ padding: 6, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: 8 }}><Layers size={16}/></span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{kpiStats.totalFollowers.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                ↑ 8.2% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>vs last month</span>
              </div>
            </div>

            <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(236, 72, 153, 0.05)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Posts This Month</span>
                <span style={{ padding: 6, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: 8 }}><TrendingUp size={16}/></span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{kpiStats.totalPostsThisMonth}</div>
              <div style={{ fontSize: 12, color: '#ec4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                Target: 40 <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>posts</span>
              </div>
            </div>

            <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Avg Engagement</span>
                <span style={{ padding: 6, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 8 }}><Sparkles size={16}/></span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{kpiStats.avgEngagement}</div>
              <div style={{ fontSize: 12, color: 'var(--emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                ↑ 0.4% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>industry avg 3.5%</span>
              </div>
            </div>

            <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(245, 158, 11, 0.05)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Pending Approval</span>
                <span style={{ padding: 6, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', borderRadius: 8 }}><AlertCircle size={16}/></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{kpiStats.pendingCount}</div>
                {kpiStats.pendingCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--amber)', padding: '4px 8px', borderRadius: 20, animation: 'pulse 2s infinite' }}>Action Required</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>
                Needs review before publishing
              </div>
            </div>
          </>
        )}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        
        {/* LEFT COLUMN: ACCOUNTS & POSTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Accounts Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Your Social Accounts</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Connect platforms and inspect real-time performance</p>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                {accounts.filter(a => a.connected).length} of {accounts.length} Linked
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {accounts.map(acc => {
                const details = PLATFORM_DETAILS[acc.platform];
                return (
                  <div key={acc.platform} className="card" style={{ padding: 0, overflow: 'hidden', border: acc.connected ? '1px solid var(--border)' : '1px dashed var(--border)', background: acc.connected ? 'var(--bg-card)' : 'transparent' }}>
                    {/* Header */}
                    <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ padding: 10, borderRadius: 12, background: details.colorBg, color: details.colorText }}>
                          {details.icon(20)}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{details.name}</h3>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: acc.connected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)', color: acc.connected ? 'var(--emerald)' : 'var(--text-muted)' }}>
                            {acc.connected ? 'Active' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => handleConnectPlatform(acc.platform)} style={{ fontSize: 11, padding: '6px 12px', background: acc.connected ? 'var(--bg-card)' : 'var(--purple)', color: acc.connected ? 'var(--text-primary)' : '#fff', border: acc.connected ? '1px solid var(--border)' : 'none' }}>
                        {acc.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: 16 }}>
                      {acc.connected ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Followers</span>
                              <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{acc.followers.toLocaleString()}</p>
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Engagement</span>
                              <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{acc.engagement}%</p>
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Impressions</span>
                              <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{acc.impressions.toLocaleString()}</p>
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Posts (Mo)</span>
                              <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{acc.postsThisMonth}</p>
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                              <span>Follower Goal Progress</span>
                              <span style={{ color: 'var(--text-primary)' }}>{acc.growth}%</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <div style={{ height: '100%', width: `${acc.growth}%`, background: 'linear-gradient(to right, #6366f1, #8b5cf6)', borderRadius: 4, transition: 'width 1s ease-out' }}></div>
                            </div>
                          </div>

                          <button className="btn btn-ghost" onClick={() => { setPostForm(prev => ({ ...prev, platform: acc.platform })); setIsCreateModalOpen(true); }} style={{ width: '100%', border: '1px solid var(--border)', background: 'var(--bg-secondary)', fontSize: 12 }}>
                            <Plus size={14} style={{ marginRight: 6 }}/> Post on {details.name}
                          </button>
                        </div>
                      ) : (
                        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                          <div style={{ width: 48, height: 48, margin: '0 auto 16px auto', borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Plus size={24} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Integrate with {details.name}</h4>
                          <p style={{ margin: '6px auto 16px auto', fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, lineHeight: 1.5 }}>Unlock engagement stats, campaign tracking, and auto-publishing schedules.</p>
                          <button className="btn btn-ghost" onClick={() => handleConnectPlatform(acc.platform)} style={{ border: '1px solid var(--border)', fontSize: 12 }}>
                            Link Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Shared Posts Chronology */}
          <div className="card" style={{ padding: 24, background: 'rgba(255, 255, 255, 0.02)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Latest Shared Posts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {posts.filter(p => p.status === 'published').length === 0 ? (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', padding: 8 }}>No successfully approved or active posts listed yet.</p>
              ) : (
                posts.filter(p => p.status === 'published').map(post => (
                  <div key={post.id} style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <div style={{ padding: 6, background: 'var(--bg-card)', borderRadius: 8, color: PLATFORM_DETAILS[post.platform]?.colorText || 'var(--text-primary)' }}>
                        {PLATFORM_DETAILS[post.platform]?.icon(16) || <Layers size={16} />}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.content}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                        <span>Published/Scheduled: {new Date(post.scheduledTime).toLocaleString()}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--emerald)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Queue Confirmed</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PENDING QUEUE */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 90, padding: 20 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', width: 8, height: 8, position: 'relative' }}>
                  <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--amber)', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }}></span>
                </span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Pending Approvals</h3>
              </div>
              <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                {posts.filter(p => p.status === 'pending').length} Actionable
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 8 }}>
              {posts.filter(p => p.status === 'pending').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', background: 'var(--bg-secondary)', border: '1px dashed var(--border)', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, margin: '0 auto 12px auto', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Queue is Clear!</h4>
                  <p style={{ margin: '6px auto 0 auto', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 200 }}>All draft posts have been processed, approved, or scheduled.</p>
                </div>
              ) : (
                posts.filter(p => p.status === 'pending').map((post) => (
                  <div key={post.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.2s' }}>
                    
                    {/* Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ padding: 6, borderRadius: 8, background: PLATFORM_DETAILS[post.platform]?.colorBg || 'var(--bg-card)', color: PLATFORM_DETAILS[post.platform]?.colorText || 'var(--text-primary)' }} title={PLATFORM_DETAILS[post.platform]?.name}>
                          {PLATFORM_DETAILS[post.platform]?.icon(14) || <Layers size={14}/>}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
                        Created {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{post.content}</p>
                    </div>

                    {/* Schedule */}
                    <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Layers size={12} /> Scheduled Time</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {new Date(post.scheduledTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                      <button onClick={() => handleRejectPost(post.id)} className="btn btn-ghost" style={{ padding: '8px', fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        <X size={14} style={{ marginRight: 4 }}/> Reject
                      </button>
                      <button onClick={() => handleApprovePost(post.id)} className="btn btn-primary" style={{ padding: '8px', fontSize: 12, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <CheckCircle2 size={14} style={{ marginRight: 4 }}/> Approve
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <Modal title={<><Layers size={20} style={{ color: '#6366f1' }}/> Create New Post</>} onClose={() => setIsCreateModalOpen(false)}>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Target Platform</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {Object.keys(PLATFORM_DETAILS).map(pl => {
                  const isActive = postForm.platform === pl;
                  return (
                    <button type="button" key={pl} onClick={() => setPostForm(f => ({ ...f, platform: pl }))}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                        border: `2px solid ${isActive ? '#6366f1' : 'var(--border)'}`,
                        background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-secondary)',
                        color: isActive ? '#6366f1' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                      }}>
                      {PLATFORM_DETAILS[pl].icon(16)} {PLATFORM_DETAILS[pl].name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Post Content</label>
              <textarea
                required rows={5}
                style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }}
                placeholder="What do you want to share with your audience?"
                value={postForm.text}
                onChange={e => setPostForm(f => ({ ...f, text: e.target.value.slice(0, 3000) }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Publish Mode</label>
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
                {(['now', 'schedule'] as const).map(mode => (
                  <button type="button" key={mode} onClick={() => setPostForm(f => ({ ...f, mode }))}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none',
                      background: postForm.mode === mode ? 'var(--bg-card)' : 'transparent',
                      color: postForm.mode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: postForm.mode === mode ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
                    }}>
                    {mode === 'now' ? 'Publish Immediately' : 'Queue for Approval'}
                  </button>
                ))}
              </div>
            </div>

            {postForm.mode === 'schedule' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input required type="date" style={inputStyle} value={postForm.scheduleDate} onChange={e => setPostForm(f => ({ ...f, scheduleDate: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input required type="time" style={inputStyle} value={postForm.scheduleTime} onChange={e => setPostForm(f => ({ ...f, scheduleTime: e.target.value }))} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', border: 'none' }} disabled={!postForm.text.trim()}>
                {postForm.mode === 'now' ? 'Publish Now' : 'Schedule Post'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}} />
    </div>
  );
}
