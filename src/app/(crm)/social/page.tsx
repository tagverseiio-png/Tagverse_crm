'use client';
import { useState } from 'react';

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 540,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ message, color = 'var(--emerald)', onClose }: { message: string; color?: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: color, color: '#ffffff',
      padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease'
    }}>
      <i className="ti ti-check-circle" style={{ fontSize: 20 }}></i>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: 8 }}>✕</button>
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

type PendingPost = { platform: string; colorText: string; text: string };

export default function SocialMediaPage() {
  const kpis = [
    { label: 'Total followers', value: '24.6K', delta: '+480 this month', trend: 'up', color: 'purple' },
    { label: 'Posts this month', value: '38', delta: 'Across 3 channels', trend: 'up', color: 'blue' },
    { label: 'Avg. engagement', value: '5.8%', delta: '+1.2% vs last mo.', trend: 'up', color: 'emerald' },
    { label: 'Pending approval', value: '5', delta: 'Needs review', trend: 'down', color: 'rose' },
  ];

  const platforms = [
    { name: 'LinkedIn', handle: '@YourBrand', followers: '11.2K', icon: 'in', colorBg: 'var(--blue-dim)', colorText: 'var(--blue-light)', growth: '68%', barColor: 'var(--blue)', metrics: [{ v: '6.1%', l: 'Eng. rate' }, { v: '18', l: 'Posts' }, { v: '4.2K', l: 'Impressions' }] },
    { name: 'Instagram', handle: '@YourBrand', followers: '9.4K', icon: 'ig', colorBg: 'var(--rose-dim)', colorText: 'var(--rose-light)', growth: '52%', barColor: 'var(--rose)', metrics: [{ v: '7.3%', l: 'Eng. rate' }, { v: '14', l: 'Posts' }, { v: '3.8K', l: 'Impressions' }] },
    { name: 'Twitter / X', handle: '@YourBrand', followers: '4.0K', icon: '𝕏', colorBg: 'var(--emerald-dim)', colorText: 'var(--emerald-light)', growth: '28%', barColor: 'var(--emerald)', metrics: [{ v: '3.2%', l: 'Eng. rate' }, { v: '6', l: 'Posts' }, { v: '1.1K', l: 'Impressions' }] },
  ];

  const [pending, setPending] = useState<PendingPost[]>([
    { platform: 'LinkedIn', colorText: 'var(--blue-light)', text: 'Excited to share our latest case study on how Arka Systems improved retention by 42% using our platform...' },
    { platform: 'Instagram', colorText: 'var(--rose-light)', text: "🚀 Big things are coming this July. Stay tuned for our Q3 product launch — you won't want to miss it." },
  ]);

  const [showNewPost, setShowNewPost] = useState(false);
  const [toast, setToast] = useState('');
  const [toastColor, setToastColor] = useState('var(--emerald)');
  const [postForm, setPostForm] = useState({ platform: 'LinkedIn', text: '', scheduleDate: '', scheduleTime: '', mode: 'now' as 'now' | 'schedule' });
  const charLimit = 280;

  const showToast = (msg: string, color = 'var(--emerald)') => {
    setToast(msg); setToastColor(color); setTimeout(() => setToast(''), 3000);
  };

  const platformColorMap: Record<string, string> = {
    LinkedIn: 'var(--blue-light)', Instagram: 'var(--rose-light)', 'Twitter / X': 'var(--emerald-light)'
  };

  const handlePost = () => {
    if (!postForm.text.trim()) return;
    if (postForm.mode === 'schedule') {
      setPending(prev => [...prev, { platform: postForm.platform, colorText: platformColorMap[postForm.platform] || 'var(--blue-light)', text: postForm.text }]);
      showToast(`Post scheduled for ${postForm.platform}!`);
    } else {
      showToast(`Post published to ${postForm.platform}!`);
    }
    setPostForm({ platform: 'LinkedIn', text: '', scheduleDate: '', scheduleTime: '', mode: 'now' });
    setShowNewPost(false);
  };

  const handleApprove = (i: number) => {
    const p = pending[i];
    setPending(prev => prev.filter((_, idx) => idx !== i));
    showToast(`Post approved & published on ${p.platform}!`);
  };

  const handleReject = (i: number) => {
    const p = pending[i];
    setPending(prev => prev.filter((_, idx) => idx !== i));
    showToast(`Post rejected on ${p.platform}.`, 'var(--rose)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Social Media Manager</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Posts, engagement, and channel performance</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewPost(true)}>
          <i className="ti ti-plus"></i> New post
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-header"><span className="kpi-label">{k.label}</span></div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.trend}`}>{k.trend === 'up' ? '↑' : '↓'} {k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Platforms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {platforms.map((p, i) => (
            <div key={i} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: p.colorBg, color: p.colorText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.handle} • {p.followers} followers</div>
                </div>
                <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 12, padding: '4px 10px' }}
                  onClick={() => { setPostForm(f => ({ ...f, platform: p.name })); setShowNewPost(true); }}>
                  <i className="ti ti-edit"></i> Post
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Follower growth</div>
              <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ height: '100%', width: p.growth, background: p.barColor, borderRadius: 4 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
                {p.metrics.map((m, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{m.v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Approval */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="section-title">Pending approval</div>
            {pending.length > 0 && (
              <span className="badge amber" style={{ fontSize: 12 }}>{pending.length}</span>
            )}
          </div>
          {pending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 12 }}>
              <i className="ti ti-check-circle" style={{ fontSize: 36, display: 'block', marginBottom: 12, color: 'var(--emerald)' }}></i>
              <div style={{ fontWeight: 600, fontSize: 14 }}>All caught up!</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>No posts pending review.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map((p, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: p.colorText }}>●</span> {p.platform}
                    </span>
                    <span className="badge amber">Pending</span>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                    {p.text}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ color: 'var(--rose-light)', fontSize: 13 }} onClick={() => handleReject(i)}>
                      <i className="ti ti-x"></i> Reject
                    </button>
                    <button className="btn btn-ghost" style={{ color: 'var(--emerald-light)', borderColor: 'var(--emerald-dim)', fontSize: 13 }} onClick={() => handleApprove(i)}>
                      <i className="ti ti-check"></i> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <Modal title="Create New Post" onClose={() => setShowNewPost(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Platform */}
            <div>
              <label style={labelStyle}>Platform</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['LinkedIn', 'Instagram', 'Twitter / X'].map(pl => (
                  <button key={pl} onClick={() => setPostForm(f => ({ ...f, platform: pl }))}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: `2px solid ${postForm.platform === pl ? 'var(--purple)' : 'var(--border)'}`,
                      background: postForm.platform === pl ? 'var(--purple-dim)' : 'var(--bg-secondary)',
                      color: postForm.platform === pl ? 'var(--purple-light)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>{pl}</button>
                ))}
              </div>
            </div>

            {/* Post Text */}
            <div>
              <label style={labelStyle}>Post Content</label>
              <textarea
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }}
                placeholder="What do you want to share?"
                value={postForm.text}
                onChange={e => setPostForm(f => ({ ...f, text: e.target.value.slice(0, charLimit) }))}
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: postForm.text.length > charLimit * 0.9 ? 'var(--rose)' : 'var(--text-muted)', marginTop: 4 }}>
                {postForm.text.length} / {charLimit}
              </div>
            </div>

            {/* Mode Toggle */}
            <div>
              <label style={labelStyle}>Publish Mode</label>
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
                {(['now', 'schedule'] as const).map(mode => (
                  <button key={mode} onClick={() => setPostForm(f => ({ ...f, mode }))}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none',
                      background: postForm.mode === mode ? 'var(--bg-card)' : 'transparent',
                      color: postForm.mode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: postForm.mode === mode ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
                    }}>
                    <i className={`ti ${mode === 'now' ? 'ti-send' : 'ti-calendar'}`} style={{ marginRight: 6 }}></i>
                    {mode === 'now' ? 'Publish Now' : 'Schedule'}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Fields */}
            {postForm.mode === 'schedule' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" style={inputStyle} value={postForm.scheduleDate} onChange={e => setPostForm(f => ({ ...f, scheduleDate: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input type="time" style={inputStyle} value={postForm.scheduleTime} onChange={e => setPostForm(f => ({ ...f, scheduleTime: e.target.value }))} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowNewPost(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePost} disabled={!postForm.text.trim()}>
              <i className={`ti ${postForm.mode === 'now' ? 'ti-send' : 'ti-calendar'}`}></i>
              {postForm.mode === 'now' ? 'Publish Now' : 'Schedule Post'}
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} color={toastColor} onClose={() => setToast('')} />}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
    </div>
  );
}
