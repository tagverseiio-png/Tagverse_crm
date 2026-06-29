'use client';
import { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle, Image as ImageIcon, Search, Plus, Filter, MoreHorizontal, User, AlertCircle } from 'lucide-react';
import { deliveriesColumns as columns, deliveriesData as mockDeliveries } from '@/lib/mockData';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [search, setSearch] = useState('');

  const filteredDeliveries = deliveries.filter(d => 
    d.client.toLowerCase().includes(search.toLowerCase()) || 
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 100px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Logistics & Deliveries</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '4px 0 0' }}>Manage product dispatches and track proof of delivery.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text" 
              placeholder="Search deliveries..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                padding: '8px 12px 8px 36px', 
                borderRadius: 8, 
                border: '1px solid var(--border)', 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                fontSize: 13, 
                outline: 'none',
                width: 250
              }} 
            />
          </div>
          <button className="btn btn-ghost">
            <Filter size={16} /> Filters
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> New Delivery
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: 20, flex: 1, overflowX: 'auto', paddingBottom: 10 }}>
        {columns.map(col => {
          const colDeliveries = filteredDeliveries.filter(d => d.status === col.id);
          
          return (
            <div key={col.id} style={{ 
              flex: '0 0 320px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12,
              background: 'var(--bg-card)',
              borderRadius: 12,
              padding: 16,
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${col.color}-light)` }} />
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{col.title}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12 }}>
                    {colDeliveries.length}
                  </span>
                </div>
                <button className="btn btn-ghost" style={{ padding: 4 }}>
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
                {colDeliveries.map(delivery => (
                  <div key={delivery.id} className="card" style={{ padding: 16, cursor: 'grab' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{delivery.id}</span>
                      <span style={{ 
                        fontSize: 10, 
                        padding: '2px 6px', 
                        borderRadius: 4, 
                        background: delivery.priority === 'High' ? 'var(--rose-dim)' : delivery.priority === 'Medium' ? 'var(--amber-dim)' : 'var(--blue-dim)',
                        color: delivery.priority === 'High' ? 'var(--rose-light)' : delivery.priority === 'Medium' ? 'var(--amber-light)' : 'var(--blue-light)',
                      }}>
                        {delivery.priority}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px 0' }}>{delivery.client}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 12 }}>
                      <MapPin size={12} /> {delivery.address}
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 6, marginBottom: 12 }}>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                        {delivery.items.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: 2 }}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Conditional PoD or Issue Note */}
                    {delivery.status === 'delivered' && delivery.podImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--emerald-light)', marginBottom: 12, background: 'var(--emerald-dim)', padding: '6px 10px', borderRadius: 6 }}>
                        <CheckCircle size={14} /> PoD Attached
                        <div style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--emerald-light)' }}>
                          <img src={delivery.podImage} alt="PoD" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    )}
                    
                    {delivery.status === 'issues' && delivery.issueNote && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'var(--rose-light)', marginBottom: 12, background: 'var(--rose-dim)', padding: '6px 10px', borderRadius: 6 }}>
                        <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {delivery.issueNote}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {delivery.agent ? (
                          <>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-light)', fontSize: 10, fontWeight: 600 }}>
                              {delivery.agent.charAt(0)}
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{delivery.agent}</span>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <User size={12} /> Unassigned
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{delivery.date}</span>
                    </div>
                  </div>
                ))}

                {colDeliveries.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 8 }}>
                    No deliveries in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
