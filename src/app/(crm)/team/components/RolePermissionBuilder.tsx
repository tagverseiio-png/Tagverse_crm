'use client';
import React, { useState } from 'react';
import { rolesMatrix } from '../mockData';
import { Shield, Check, X, Save } from 'lucide-react';

export default function RolePermissionBuilder() {
  const [matrix, setMatrix] = useState(rolesMatrix);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePermission = (roleId: string, module: string, action: 'view'|'edit'|'delete') => {
    setMatrix(prev => prev.map(role => {
      if(role.id === roleId) {
        return {
          ...role,
          modules: {
            ...role.modules,
            [module as keyof typeof role.modules]: {
              ...role.modules[module as keyof typeof role.modules],
              [action]: !role.modules[module as keyof typeof role.modules][action]
            }
          }
        };
      }
      return role;
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const modules = ['deals', 'contacts', 'reports', 'settings'];
  const actions = ['view', 'edit', 'delete'] as const;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--brand-accent)]" />
            Role & Permission Builder
          </h2>
          <p className="section-sub">Configure access control across all CRM modules.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`btn ${saved ? 'bg-emerald-500 hover:bg-emerald-600 border-none text-white' : 'btn-primary'}`}
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 
           saved ? <><Check className="w-4 h-4" /> Saved</> : 
           <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
              <th className="p-4 border-r border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider min-w-[150px]">Role</th>
              {modules.map(mod => (
                <th key={mod} colSpan={3} className="p-4 border-r last:border-r-0 border-[var(--border)] text-xs font-bold text-[var(--text-primary)] text-center uppercase tracking-wider">
                  {mod}
                </th>
              ))}
            </tr>
            <tr className="bg-[var(--bg-card)] border-b border-[var(--border)]">
              <th className="border-r border-[var(--border)]"></th>
              {modules.map(mod => (
                <React.Fragment key={`${mod}-actions`}>
                  {actions.map(act => (
                    <th key={`${mod}-${act}`} className="p-2 border-r last:border-r-0 border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">
                      {act}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map(role => (
              <tr key={role.id} className="hover:bg-[var(--bg-card-hover)] transition-colors border-b last:border-b-0 border-[var(--border)]">
                <td className="p-4 border-r border-[var(--border)] font-semibold text-[var(--text-primary)] text-sm">
                  {role.name}
                </td>
                {modules.map(mod => {
                  const m = role.modules[mod as keyof typeof role.modules];
                  return actions.map(act => (
                    <td key={`${role.id}-${mod}-${act}`} className="p-3 border-r last:border-r-0 border-[var(--border)] text-center">
                      <button
                        onClick={() => togglePermission(role.id, mod, act)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${m[act] ? 'bg-[var(--brand-accent)] text-white shadow-md' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--bg-card)] hover:text-[var(--text-secondary)]'}`}
                      >
                        {m[act] ? <Check className="w-4 h-4" /> : <X className="w-3 h-3" />}
                      </button>
                    </td>
                  ))
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
