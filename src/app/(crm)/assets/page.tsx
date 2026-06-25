'use client';
import { useState, useRef } from 'react';

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
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
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

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: 'var(--emerald)', color: '#fff',
      padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease'
    }}>
      <i className="ti ti-check-circle" style={{ fontSize: 20 }}></i>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>✕</button>
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

type Asset = { name: string; type: string; size: string; folder: string; badge: string; icon: string };

export default function AssetsPage() {
  const kpis = [
    { label: 'Total files', value: '612', delta: 'Across all folders', color: 'purple' },
    { label: 'Storage used', value: '4.8 GB', delta: 'of 10 GB', color: 'blue' },
    { label: 'Images', value: '440', delta: '72% of total', color: 'emerald' },
    { label: 'Videos', value: '38', delta: '6% of total', color: 'amber' },
  ];

  const folders = [
    { name: 'Brand guidelines', count: 24, icon: '📁', color: 'var(--rose-light)' },
    { name: 'Campaign creatives', count: 118, icon: '📁', color: 'var(--purple-light)' },
    { name: 'Product screenshots', count: 76, icon: '📁', color: 'var(--blue-light)' },
    { name: 'Social media templates', count: 92, icon: '📁', color: 'var(--amber-light)' },
    { name: 'Videos & reels', count: 38, icon: '📁', color: 'var(--emerald-light)' },
  ];

  const [assets, setAssets] = useState<Asset[]>([
    { name: 'hero-banner-v3.png', type: 'Image', size: '1.2 MB', folder: 'Campaign creatives', badge: 'rose', icon: '🖼️' },
    { name: 'brand-kit-2025.pdf', type: 'PDF', size: '4.4 MB', folder: 'Brand guidelines', badge: 'purple', icon: '📄' },
    { name: 'product-demo-final.mp4', type: 'Video', size: '84 MB', folder: 'Videos & reels', badge: 'emerald', icon: '🎥' },
  ]);

  const [recentUploads, setRecentUploads] = useState([
    { name: 'hero-banner-v3.png', size: '1.2 MB', date: 'Jun 23', icon: '🖼️', bg: 'var(--rose-dim)', color: 'var(--rose-light)' },
    { name: 'brand-kit-2025.pdf', size: '4.4 MB', date: 'Jun 21', icon: '📄', bg: 'var(--blue-dim)', color: 'var(--blue-light)' },
    { name: 'product-demo-final.mp4', size: '84 MB', date: 'Jun 19', icon: '🎥', bg: 'var(--emerald-dim)', color: 'var(--emerald-light)' },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAsset, setViewAsset] = useState<Asset | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [dragOver, setDragOver] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', folder: 'Campaign creatives', type: 'Image' });
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const typeIconMap: Record<string, string> = { Image: '🖼️', Video: '🎥', PDF: '📄', Document: '📝' };
  const typeBadgeMap: Record<string, string> = { Image: 'rose', Video: 'emerald', PDF: 'purple', Document: 'blue' };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const type = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext) ? 'Image'
      : ['mp4', 'mov', 'avi', 'webm'].includes(ext) ? 'Video'
      : ['pdf'].includes(ext) ? 'PDF' : 'Document';
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    setUploadedFileName(file.name);
    setUploadForm(f => ({ ...f, name: file.name, type }));
  };

  const handleUpload = () => {
    if (!uploadForm.name.trim()) return;
    const icon = typeIconMap[uploadForm.type] || '📄';
    const badge = typeBadgeMap[uploadForm.type] || 'blue';
    const newAsset: Asset = { name: uploadForm.name, type: uploadForm.type, size: '—', folder: uploadForm.folder, badge, icon };
    setAssets(prev => [newAsset, ...prev]);
    setRecentUploads(prev => [{ name: uploadForm.name, size: '—', date: 'Just now', icon, bg: 'var(--purple-dim)', color: 'var(--purple-light)' }, ...prev.slice(0, 2)]);
    setUploadedFileName('');
    setUploadForm({ name: '', folder: 'Campaign creatives', type: 'Image' });
    setShowUploadModal(false);
    showToast('Asset uploaded successfully!');
  };

  const handleDelete = (i: number) => {
    setAssets(prev => prev.filter((_, idx) => idx !== i));
    showToast('Asset deleted.');
  };

  const filtered = assets.filter(a => {
    const matchName = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All types' || a.type === typeFilter;
    return matchName && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 20 }}>Assets</div>
          <div className="section-sub" style={{ fontSize: 13 }}>Images, videos, brand files</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
          <i className="ti ti-upload"></i> Upload
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-header"><span className="kpi-label">{k.label}</span></div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-delta" style={{ color: 'var(--text-muted)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Folders */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Folders</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {folders.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' }} className="hover-bg-card"
                onClick={() => { setTypeFilter('All types'); setSearch(''); showToast(`Browsing: ${f.name}`); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span> {f.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.count} files</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Recent uploads</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentUploads.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < recentUploads.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: u.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{u.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.size} • {u.date}</div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => showToast(`Downloading ${u.name}...`)}>
                  <i className="ti ti-download"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="text" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
          <option>All types</option><option>Image</option><option>Video</option><option>PDF</option><option>Document</option>
        </select>
      </div>

      {/* Table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '36%' }}>File name</th>
              <th style={{ width: '14%' }}>Type</th>
              <th style={{ width: '14%' }}>Size</th>
              <th style={{ width: '18%' }}>Folder</th>
              <th style={{ width: '18%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No assets found.</td></tr>
            ) : filtered.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{a.icon}</span> {a.name}
                </td>
                <td><span className={`badge ${a.badge}`}>{a.type}</span></td>
                <td>{a.size}</td>
                <td>{a.folder}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => { setViewAsset(a); setShowViewModal(true); }}>
                      <i className="ti ti-eye"></i> View
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => showToast(`Downloading ${a.name}...`)}>
                      <i className="ti ti-download"></i>
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--rose)' }} onClick={() => handleDelete(assets.indexOf(a))}>
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal title="Upload Asset" onClose={() => setShowUploadModal(false)}>
          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--purple)' : 'var(--border)'}`,
              borderRadius: 14, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'var(--purple-dim)' : 'var(--bg-secondary)',
              transition: 'all 0.2s', marginBottom: 20
            }}>
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files?.[0])} />
            <i className="ti ti-cloud-upload" style={{ fontSize: 40, color: 'var(--purple)', display: 'block', marginBottom: 10 }}></i>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {uploadedFileName || 'Drag & drop or click to upload'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>PNG, JPG, MP4, PDF supported</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>File Name</label>
              <input style={inputStyle} placeholder="e.g. hero-banner-v4.png" value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={inputStyle} value={uploadForm.type} onChange={e => setUploadForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Image</option><option>Video</option><option>PDF</option><option>Document</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Folder</label>
                <select style={inputStyle} value={uploadForm.folder} onChange={e => setUploadForm(f => ({ ...f, folder: e.target.value }))}>
                  <option>Brand guidelines</option><option>Campaign creatives</option><option>Product screenshots</option>
                  <option>Social media templates</option><option>Videos & reels</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowUploadModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpload}>Upload Asset</button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && viewAsset && (
        <Modal title={viewAsset.name} onClose={() => setShowViewModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: '100%', height: 180, borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
              {viewAsset.icon}
            </div>
            {[['Type', viewAsset.type], ['Size', viewAsset.size], ['Folder', viewAsset.folder]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{k}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowViewModal(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => { showToast(`Downloading ${viewAsset.name}...`); setShowViewModal(false); }}>
              <i className="ti ti-download"></i> Download
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-bg-card:hover { background: var(--bg-card-hover, rgba(255,255,255,0.04)) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
