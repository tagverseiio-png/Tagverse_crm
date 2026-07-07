'use client';
import React from 'react';
import { QUOTE_TEMPLATES } from '@/config/quoteTemplates';
import { TEMPLATE_RENDERERS } from '@/components/quotes/templates';
import './QuoteBuilder.css'; // Ensure we have the CSS for the templates

interface Props {
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

const mockProps = {
  quoteId: '#INV-000000',
  docType: 'Invoice' as const,
  issued: '2050-01-31',
  expires: '2050-02-28',
  company: 'John Smith',
  contact: '',
  email: 'info@gmail.com',
  phone: '',
  scope: 'Project Scope',
  items: [
    { id: 1, desc: 'Lorem Ipsum is simply dummy text.', qty: 2, price: 20 },
    { id: 2, desc: 'The printing and typesetting industry.', qty: 8, price: 10 },
    { id: 3, desc: 'Lorem Ipsum is simply dummy text.', qty: 10, price: 30 }
  ],
  currency: '$',
  subtotal: 420,
  discountRate: 0,
  discountAmt: 0,
  cgstRate: 0,
  cgstAmt: 0,
  sgstRate: 0,
  sgstAmt: 0,
  total: 420,
  notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  terms: 'Due on receipt',
  delivery: '',
  fmtDate: (d: string) => {
    if (d === '2050-01-31') return '31/01/2050';
    return d;
  },
};

export default function TemplateSelectorModal({ onSelect, onClose }: Props) {
  // Prevent closing when clicking inside modal content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="quote-builder-wrapper" style={{ zIndex: 10000 }}>
      <div className="overlay" onClick={handleOverlayClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="editor" style={{ maxWidth: 900, height: 'auto', maxHeight: '90vh', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Choose a Template</h2>
              <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>Select a starting design for your new quotation. You can change this later.</p>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--text-muted)' }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, overflowY: 'auto', paddingBottom: 16 }}>
            {QUOTE_TEMPLATES.map(t => {
              const Renderer = TEMPLATE_RENDERERS[t.id] || TEMPLATE_RENDERERS['modern'];
              return (
                <div key={t.id} style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: 12, 
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ height: 200, background: '#f5f5f5', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                    {/* Render actual component scaled down for a perfect preview */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: '50%',
                      width: 794,
                      transform: 'translateX(-50%) scale(0.31)', 
                      transformOrigin: 'top center',
                      pointerEvents: 'none'
                    }}>
                      <Renderer {...mockProps} />
                    </div>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t.category}</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>{t.name}</div>
                    <button 
                      onClick={() => onSelect(t.id)} 
                      style={{ 
                        marginTop: 'auto', 
                        width: '100%', 
                        padding: '12px 0', 
                        borderRadius: '8px', 
                        background: 'var(--brand)', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#3730BC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--brand)'}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
