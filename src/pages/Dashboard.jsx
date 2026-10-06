import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  Sparkles, 
  AlertTriangle, 
  Search, 
  Plus, 
  Eye, 
  Printer, 
  TrendingUp, 
  Users, 
  Scale, 
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';
import { getAllEmiItems } from '../utils/loanUtils';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const Dashboard = ({ onNavigate, onOpenDocument, onOpenImageViewer, onOpenCustomer360 }) => {
  const { loans, customers, payments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics calculation
  const activeLoans = loans.filter(l => l.status === 'Active');
  const totalActiveLoansCount = activeLoans.length;
  
  const totalLoanAmount = activeLoans.reduce((sum, l) => sum + Number(l.loanAmount || 0), 0);
  
  const goldLoans = activeLoans.filter(l => l.itemType === 'Gold');
  const totalGoldAmount = goldLoans.reduce((sum, l) => sum + Number(l.loanAmount || 0), 0);
  const totalGoldWeight = goldLoans.reduce((sum, l) => sum + Number(l.netWeight || 0), 0);

  const silverLoans = activeLoans.filter(l => l.itemType === 'Silver');
  const totalSilverAmount = silverLoans.reduce((sum, l) => sum + Number(l.loanAmount || 0), 0);
  const totalSilverWeight = silverLoans.reduce((sum, l) => sum + Number(l.netWeight || 0), 0);

  const allEmis = getAllEmiItems(loans, payments);
  const overdueEmis = allEmis.filter(e => e.status === 'Overdue');

  // Filtered loans list based on search term
  const filteredLoans = loans.filter(l => {
    const term = searchTerm.toLowerCase();
    return (
      l.id?.toLowerCase().includes(term) ||
      l.loanNo?.toLowerCase().includes(term) ||
      l.customerName?.toLowerCase().includes(term) ||
      l.mobile?.includes(term) ||
      l.itemName?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '1px' }}>
            BUSINESS DASHBOARD
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
            VINAYAK BENEFIT NIDHI LTD. • Gold & Silver Loan Operations
          </p>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} color="#dc2626" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search Customer ID / Loan ID / Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: '2.6rem', 
              background: '#0d0f17', 
              borderRadius: '30px', 
              fontSize: '0.85rem',
              borderColor: 'rgba(225, 29, 72, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Overdue Notice Alert if any */}
      {overdueEmis.length > 0 && (
        <div className="glass-card stagger-card" style={{
          background: 'rgba(239, 68, 68, 0.12)',
          borderColor: 'rgba(239, 68, 68, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fca5a5' }}>
            <AlertTriangle size={24} color="#ef4444" />
            <div>
              <strong style={{ fontSize: '0.98rem' }}>🚨 {overdueEmis.length} Overdue Loan EMIs Pending Payment!</strong>
              <p style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '2px' }}>
                Payment dates have passed without receipt. Immediate alert reminder required.
              </p>
            </div>
          </div>
          <button onClick={() => onNavigate('emi-tracker')} className="btn-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} /> Open EMI Alert Center
          </button>
        </div>
      )}

      {/* Main Metric Cards Grid with Animated Counter & Entrance Stagger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
        
        {/* Card 1: Total Active Portfolio */}
        <div className="glass-card stagger-card" style={{ animationDelay: '0.05s', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Total Active Portfolio
            </span>
            <div style={{ background: 'rgba(225,29,72,0.18)', padding: '0.5rem', borderRadius: '10px' }}>
              <Coins size={20} color="#e11d48" />
            </div>
          </div>
          <h2 className="gold-text" style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            <AnimatedCounter value={totalLoanAmount} prefix="₹" />
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
            <AnimatedCounter value={totalActiveLoansCount} /> Active Sanctioned Loans
          </span>
        </div>

        {/* Card 2: Active Customers */}
        <div 
          className="glass-card stagger-card" 
          style={{ animationDelay: '0.1s', cursor: 'pointer' }} 
          onClick={() => onNavigate('customers')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Active Customers
            </span>
            <div style={{ background: 'rgba(37,99,235,0.18)', padding: '0.5rem', borderRadius: '10px' }}>
              <Users size={20} color="#60a5fa" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.3rem', color: '#f8fafc' }}>
            <AnimatedCounter value={customers.length} />
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Verified Nidhi Members
          </span>
        </div>

        {/* Card 3: Gold Pledged Loans (Gold Atmosphere) */}
        <div className="glass-card gold-atmosphere stagger-card" style={{ animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#f5d78a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Gold Pledged Loans
            </span>
            <div style={{ background: 'rgba(229,184,105,0.25)', padding: '0.5rem', borderRadius: '10px' }}>
              <Sparkles size={20} color="#f5d78a" />
            </div>
          </div>
          <h2 className="gold-text" style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            <AnimatedCounter value={totalGoldAmount} prefix="₹" />
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#e5b869', fontWeight: 600 }}>
            ⚖️ <AnimatedCounter value={totalGoldWeight} decimals={2} suffix=" g Net Gold" />
          </span>
        </div>

        {/* Card 4: Silver Pledged Loans (Silver Atmosphere) */}
        <div className="glass-card silver-atmosphere stagger-card" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Silver Pledged Loans
            </span>
            <div style={{ background: 'rgba(203,213,225,0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <Scale size={20} color="#cbd5e1" />
            </div>
          </div>
          <h2 className="silver-text" style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            <AnimatedCounter value={totalSilverAmount} prefix="₹" />
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            ⚖️ <AnimatedCounter value={totalSilverWeight} decimals={1} suffix=" g Net Silver" />
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => onNavigate('new-loan')} className="btn-gold" style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem' }}>
          <Plus size={18} /> + Create New Loan Entry
        </button>
        <button onClick={() => onNavigate('emi-tracker')} className="btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem', color: '#f5d78a', borderColor: '#e5b869' }}>
          <Clock size={18} /> Open EMI Schedule & Tracker
        </button>
        <button onClick={() => onNavigate('calculator')} className="btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem' }}>
          <TrendingUp size={18} /> Open Metal Calculator
        </button>
        <button onClick={() => onNavigate('item-gallery')} className="btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem' }}>
          <Layers size={18} /> Vault Gallery
        </button>
      </div>

      {/* Active Loans Table */}
      <div className="glass-card stagger-card" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 className="gold-text" style={{ fontSize: '1.18rem', fontWeight: 700 }}>
              Sanctioned Loans (Click Loan/Name for 360° Profile)
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Showing active & historical pledged accounts
            </span>
          </div>
          <button onClick={() => onNavigate('active-loans')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            View All ({loans.length}) <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Loan ID / Member</th>
                <th>Customer Name</th>
                <th>Item & Purity</th>
                <th>Net Weight</th>
                <th>Loan Sanctioned</th>
                <th>Status</th>
                <th>Photo</th>
                <th>Document Slips</th>
                <th>360° Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No loans match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLoans.slice(0, 6).map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <button
                        onClick={() => onOpenCustomer360 && onOpenCustomer360({ loan })}
                        style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                      >
                        <div style={{ fontWeight: 700, color: '#f5d78a', textDecoration: 'underline' }}>{loan.id}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>#{loan.loanNo || '21990000255'}</div>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => onOpenCustomer360 && onOpenCustomer360({ loan })}
                        style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                      >
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{loan.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>📱 {loan.mobile}</div>
                      </button>
                    </td>
                    <td>
                      <span className={loan.itemType === 'Gold' ? 'badge badge-gold' : 'badge badge-silver'}>
                        {loan.itemName} ({loan.purity})
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {loan.netWeight} g
                    </td>
                    <td style={{ fontWeight: 800, color: '#f5d78a' }}>
                      ₹{Number(loan.loanAmount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={loan.status === 'Active' ? 'badge badge-active' : 'badge badge-gold'}>
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => onOpenImageViewer(loan)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        title="View Pledged Photo"
                      >
                        <Eye size={14} color="#e5b869" /> Photo
                      </button>
                    </td>
                    <td>
                      <button 
                        onClick={() => onOpenDocument(loan)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Printer size={13} /> Print Slip
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => onOpenCustomer360 && onOpenCustomer360({ loan })}
                        className="btn-gold"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Profile 360°
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
