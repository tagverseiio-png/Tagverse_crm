'use client';
import { useState, useEffect, useCallback } from 'react';

type Contact = {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
  assignedTo?: { id: string; name: string } | null;
  tags: string[];
  lastContactAt: string | null;
  createdAt: string;
};

const emptyForm = {
  name: '', company: '', role: '', phone: '', email: '', tags: '',
};
type FormState = typeof emptyForm;

function ContactModal({
  title, form, errors, onChange, onSubmit, onClose, submitLabel,
}: {
  title: string;
  form: FormState;
  errors: Record<string, string>;
  onChange: (k: keyof FormState, v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}) {
  const inputStyle = (key: string) => ({
    background: 'var(--bg-secondary)',
    border: `1px solid ${errors[key] ? 'var(--rose)' : 'var(--border)'}`,
    borderRadius: 8, padding: '8px 12px',
    color: 'var(--text-primary)', fontSize: 13,
    fontFamily: 'Inter, sans-serif', outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
  });
  const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 540, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Fill in contact details below</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>
        {errors.form && (
          <div style={{ padding: '10px 14px', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: 'var(--rose)', fontSize: 12, fontWeight: 500 }}>
            {errors.form}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle('name')} value={form.name} placeholder="e.g. Rahul Verma" onChange={e => onChange('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.name}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Email *</label>
            <input style={inputStyle('email')} value={form.email} type="email" placeholder="name@company.com" onChange={e => onChange('email', e.target.value)} />
            {errors.email && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{errors.email}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle('phone')} value={form.phone} placeholder="+91 98765 11111" onChange={e => onChange('phone', e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle('company')} value={form.company} placeholder="e.g. TechNova" onChange={e => onChange('company', e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Role / Job Title</label>
            <input style={inputStyle('role')} value={form.role} placeholder="e.g. CEO" onChange={e => onChange('role', e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle('tags')} value={form.tags} placeholder="e.g. VIP, Client" onChange={e => onChange('tags', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ contact, onConfirm, onClose }: { contact: Contact; onConfirm: () => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 380, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>🗑️ Delete Contact</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{contact.name}</strong>? This action cannot be undone.</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} style={{ background: 'var(--rose)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 460, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{contact.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{contact.role}{contact.company ? ` at ${contact.company}` : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['📞 Phone', contact.phone ?? '—'],
            ['✉️ Email', contact.email ?? '—'],
            ['👤 Owner', contact.assignedTo?.name ?? '—'],
            ['🏷️ Tags', contact.tags.join(', ') || '—'],
            ['🕐 Added', new Date(contact.createdAt).toLocaleDateString()],
            ['📅 Last Contact', contact.lastContactAt ? new Date(contact.lastContactAt).toLocaleDateString() : '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormState>({ ...emptyForm });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState<FormState>({ ...emptyForm });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'contact', limit: '200' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/contacts?${params}`);
      const json = await res.json();
      setContacts(json.data ?? []);
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const validate = (f: FormState) => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!f.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Invalid email';
    return e;
  };

  const handleAdd = async () => {
    const e = validate(addForm);
    if (Object.keys(e).length > 0) { setAddErrors(e); return; }
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addForm,
        type: 'contact',
        tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      setShowAdd(false);
      fetchContacts();
    } else {
      const json = await res.json().catch(() => ({}));
      setAddErrors({ form: json.error || 'Failed to create contact' });
    }
  };

  const openEdit = (c: Contact) => {
    setEditContact(c);
    setEditForm({ name: c.name, company: c.company ?? '', role: c.role ?? '', phone: c.phone ?? '', email: c.email ?? '', tags: c.tags.join(', ') });
    setEditErrors({});
  };

  const handleEdit = async () => {
    const e = validate(editForm);
    if (Object.keys(e).length > 0) { setEditErrors(e); return; }
    const res = await fetch(`/api/contacts/${editContact!.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      setEditContact(null);
      fetchContacts();
    } else {
      const json = await res.json().catch(() => ({}));
      setEditErrors({ form: json.error || 'Failed to update contact' });
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/contacts/${deleteContact!.id}`, { method: 'DELETE' });
    setDeleteContact(null);
    fetchContacts();
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Contacts', value: contacts.length.toLocaleString(), color: 'blue' },
          { label: 'Recently Added', value: contacts.filter(c => { const d = new Date(c.createdAt); const now = new Date(); return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000; }).length.toString(), color: 'purple' },
          { label: 'Key Accounts', value: contacts.filter(c => c.tags.includes('VIP') || c.tags.includes('Decision Maker')).length.toString(), color: 'amber' },
          { label: 'Engaged', value: contacts.filter(c => c.lastContactAt).length.toString(), color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`kpi-card ${s.color}`}>
            <div className="kpi-label" style={{ marginBottom: 8 }}>{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 240, position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px 8px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => { setAddForm({ ...emptyForm }); setAddErrors({}); setShowAdd(true); }} style={{ whiteSpace: 'nowrap' }}>+ New Contact</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading contacts...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Role</th><th>Company</th><th>Email</th>
                  <th>Phone</th><th>Tags</th><th>Added</th>
                  <th style={{ textAlign: 'right', paddingRight: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{c.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.role}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.company}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.phone}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 10, color: 'var(--brand-accent)', background: 'var(--purple-dim)', padding: '2px 6px', borderRadius: 4 }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewContact(c)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>View</button>
                        <button onClick={() => openEdit(c)} style={{ padding: '4px 10px', fontSize: 11, background: 'var(--blue-dim)', color: 'var(--brand-accent)', border: '1px solid var(--brand-accent)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>✏️ Edit</button>
                        <button onClick={() => setDeleteContact(c)} style={{ padding: '4px 10px', fontSize: 11, background: 'var(--rose-dim)', color: 'var(--rose)', border: '1px solid var(--rose)', borderRadius: 7, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No contacts found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <ContactModal title="+ New Contact" form={addForm} errors={addErrors} onChange={(k, v) => setAddForm(p => ({ ...p, [k]: v }))} onSubmit={handleAdd} onClose={() => setShowAdd(false)} submitLabel="Add Contact" />}
      {editContact && <ContactModal title={`✏️ Edit — ${editContact.name}`} form={editForm} errors={editErrors} onChange={(k, v) => setEditForm(p => ({ ...p, [k]: v }))} onSubmit={handleEdit} onClose={() => setEditContact(null)} submitLabel="Save Changes" />}
      {deleteContact && <DeleteConfirm contact={deleteContact} onConfirm={handleDelete} onClose={() => setDeleteContact(null)} />}
      {viewContact && <ViewModal contact={viewContact} onClose={() => setViewContact(null)} />}
    </div>
  );
}
