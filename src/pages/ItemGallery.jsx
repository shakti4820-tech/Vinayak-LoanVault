import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Images, Search, Eye, Tag, ShieldCheck, Scale, Sparkles } from 'lucide-react';

export const ItemGallery = ({ onOpenImageViewer, onOpenDocument }) => {
  const { loans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [metalFilter, setMetalFilter] = useState('ALL');

  const filteredLoans = loans.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      l.id?.toLowerCase().includes(term) ||
      l.itemName?.toLowerCase().includes(term) ||
      l.customerName?.toLowerCase().includes(term)
    );
    if (!matchesSearch) return false;
    if (metalFilter === 'Gold') return l.itemType === 'Gold';
    if (metalFilter === 'Silver') return l.itemType === 'Silver';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            PLEDGED ITEM PHOTO VAULT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Visual multi-angle photo gallery of all gold & silver ornaments in security vault
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#12141c', borderRadius: '30px', padding: '0.2rem', border: '1px solid rgba(229,184,105,0.2)' }}>
            {['ALL', 'Gold', 'Silver'].map(m => (
              <button
                key={m}
                onClick={() => setMetalFilter(m)}
                className={metalFilter === m ? 'btn-gold' : 'btn-secondary'}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '20px', border: 'none' }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="#e5b869" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search pledged items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem', background: '#12141c', borderRadius: '30px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Photo Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.4rem' }}>
        {filteredLoans.map(loan => (
          <div key={loan.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative' }}>
            {/* Image Preview Container */}
            <div style={{
              width: '100%',
              height: '220px',
              background: '#0a0b0e',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(229,184,105,0.2)'
            }}>
              <img 
                src={loan.photos?.front || loan.photos?.scale} 
                alt={loan.itemName} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
              <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                <span className={loan.itemType === 'Gold' ? 'badge badge-gold' : 'badge badge-silver'}>
                  {loan.itemType} • {loan.purity}
                </span>
              </div>
              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                  Vault Tag: #{loan.id}
                </span>
              </div>
            </div>

            {/* Item Metadata */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                {loan.itemName}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Owner: <strong>{loan.customerName}</strong>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.8rem', background: 'rgba(10,11,14,0.5)', padding: '0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Gross Weight</span>
                  <div style={{ fontWeight: 700, color: '#cbd5e1' }}>⚖️ {loan.grossWeight} g</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Sanctioned Loan</span>
                  <div style={{ fontWeight: 800, color: '#f5d78a' }}>₹{loan.loanAmount?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button 
                onClick={() => onOpenImageViewer(loan)} 
                className="btn-gold" 
                style={{ flex: 1, fontSize: '0.78rem', padding: '0.45rem', justifyContent: 'center' }}
              >
                <Eye size={14} /> 4-Angle Photos
              </button>
              <button 
                onClick={() => onOpenDocument(loan)} 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
              >
                Slips
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
