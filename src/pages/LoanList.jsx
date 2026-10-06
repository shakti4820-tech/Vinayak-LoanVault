import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Eye, 
  Printer, 
  CreditCard, 
  Filter, 
  AlertTriangle, 
  Coins,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export const LoanList = ({ onOpenDocument, onOpenImageViewer, onOpenPaymentModal, onOpenCustomer360 }) => {
  const { loans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Gold' | 'Silver' | 'Active' | 'Closed' | 'Due'

  const filteredLoans = loans.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      l.id?.toLowerCase().includes(term) ||
      l.loanNo?.toLowerCase().includes(term) ||
      l.customerName?.toLowerCase().includes(term) ||
      l.mobile?.includes(term) ||
      l.itemName?.toLowerCase().includes(term)
    );

    if (!matchesSearch) return false;

    if (filterType === 'Gold') return l.itemType === 'Gold';
    if (filterType === 'Silver') return l.itemType === 'Silver';
    if (filterType === 'Active') return l.status === 'Active';
    if (filterType === 'Closed') return l.status === 'Closed';
    if (filterType === 'Due') {
      if (!l.dueDate || l.status === 'Closed') return false;
      return new Date(l.dueDate) <= new Date();
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            LOANS DIRECTORY & DUE TRACKER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Comprehensive list of active, overdue, and closed gold & silver loans
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#12141c', borderRadius: '30px', padding: '0.2rem', border: '1px solid rgba(229,184,105,0.2)' }}>
            {['ALL', 'Gold', 'Silver', 'Active', 'Closed', 'Due'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={filterType === f ? 'btn-gold' : 'btn-secondary'}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '20px', border: 'none' }}
              >
                {f === 'Due' ? '⚠️ Due Loans' : f}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#e5b869" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Filter loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem', background: '#12141c', borderRadius: '30px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Loan Account</th>
                <th>Customer Name</th>
                <th>Item Pledged</th>
                <th>Net Weight</th>
                <th>Market Value</th>
                <th>Loan Sanctioned</th>
                <th>Interest & EMI</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No loans match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const isOverdue = loan.status === 'Active' && loan.dueDate && new Date(loan.dueDate) < new Date();

                  return (
                    <tr key={loan.id}>
                      <td>
                        <button
                          onClick={() => onOpenCustomer360 && onOpenCustomer360({ loan })}
                          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                        >
                          <div style={{ fontWeight: 700, color: '#f5d78a', textDecoration: 'underline' }}>{loan.id}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>No. {loan.loanNo || '21990000255'}</div>
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
                      <td style={{ fontWeight: 600 }}>{loan.netWeight} g</td>
                      <td style={{ color: '#cbd5e1' }}>₹{Number(loan.marketValue || 0).toLocaleString('en-IN')}</td>
                      <td style={{ fontWeight: 800, color: '#f5d78a' }}>₹{Number(loan.loanAmount || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <div>{loan.interestRate}% p.a</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981' }}>EMI: ₹{loan.emiAmount}</div>
                      </td>
                      <td>
                        <div style={{ color: isOverdue ? '#ef4444' : '#cbd5e1', fontWeight: isOverdue ? 700 : 400 }}>
                          {loan.dueDate}
                        </div>
                      </td>
                      <td>
                        <span className={isOverdue ? 'badge badge-overdue' : (loan.status === 'Closed' ? 'badge badge-gold' : 'badge badge-active')}>
                          {isOverdue ? 'Overdue' : loan.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => onOpenCustomer360 && onOpenCustomer360({ loan })}
                            className="btn-gold"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                            title="View 360 Customer Profile & EMI Dates"
                          >
                            360° Data
                          </button>
                          <button
                            onClick={() => onOpenImageViewer(loan)}
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                            title="View Photos"
                          >
                            <Eye size={13} color="#e5b869" />
                          </button>
                          <button
                            onClick={() => onOpenDocument(loan)}
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                            title="Print Sanction Slips"
                          >
                            <Printer size={13} />
                          </button>
                          {loan.status === 'Active' && (
                            <button
                              onClick={() => onOpenPaymentModal(loan)}
                              className="btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#10b981', borderColor: '#10b981' }}
                              title="Record Payment"
                            >
                              <CreditCard size={13} /> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
