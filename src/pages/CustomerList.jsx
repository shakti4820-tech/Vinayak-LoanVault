import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Search, Phone, MapPin, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export const CustomerList = ({ onNavigate, onOpenCustomer360 }) => {
  const { customers, loans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.mobile?.includes(term) ||
      c.id?.toLowerCase().includes(term) ||
      c.address?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            NIDHI CUSTOMER DIRECTORY
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Registered member accounts, KYC details, closed & current loan history
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#e5b869" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search Member Name / ID / Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', background: '#12141c', borderRadius: '30px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {filteredCustomers.map(customer => {
          const customerLoans = loans.filter(l => l.mobile === customer.mobile || l.memberNo === customer.id);
          const activeLoans = customerLoans.filter(l => l.status === 'Active');
          const closedLoans = customerLoans.filter(l => l.status === 'Closed');
          const totalSanctioned = customerLoans.reduce((sum, l) => sum + Number(l.loanAmount || 0), 0);

          return (
            <div key={customer.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      Member No: {customer.id}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#f8fafc' }}>
                      {customer.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      S/O {customer.fatherName || 'BHANWAR LAL'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#e5b869" /> 📱 {customer.mobile}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#e5b869" /> 📍 {customer.address}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="#10b981" /> KYC: {customer.idProofType} ({customer.idProofNo})
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Loans:</span>
                  <div style={{ fontWeight: 700, color: '#f5d78a', fontSize: '0.85rem' }}>
                    {activeLoans.length} Active • {closedLoans.length} Closed
                  </div>
                </div>
                <button 
                  onClick={() => onOpenCustomer360 && onOpenCustomer360({ customer })} 
                  className="btn-gold" 
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
                >
                  View 360° Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
