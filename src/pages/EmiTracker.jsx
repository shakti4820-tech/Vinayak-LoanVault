import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  getAllEmiItems, 
  formatCurrency, 
  getDaysDiff 
} from '../utils/loanUtils';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle2, 
  Send, 
  CreditCard, 
  MessageSquare, 
  Coins,
  Filter,
  Users
} from 'lucide-react';

export const EmiTracker = ({ onOpenPaymentModal, onOpenSendAlert, onOpenCustomer360 }) => {
  const { loans, payments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('OVERDUE'); // 'OVERDUE' | 'TODAY' | 'NEXT7' | 'NEXT30' | 'PAID' | 'ALL'

  const allEmis = getAllEmiItems(loans, payments);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Group metrics
  const overdueEmis = allEmis.filter(e => e.status === 'Overdue');
  const dueTodayEmis = allEmis.filter(e => e.status === 'Due Today');
  const next7DaysEmis = allEmis.filter(e => {
    if (e.status === 'Paid') return false;
    const diff = getDaysDiff(todayStr, e.dueDate);
    return diff >= 0 && diff <= 7;
  });
  const next30DaysEmis = allEmis.filter(e => {
    if (e.status === 'Paid') return false;
    const diff = getDaysDiff(todayStr, e.dueDate);
    return diff >= 0 && diff <= 30;
  });
  const paidEmis = allEmis.filter(e => e.status === 'Paid');

  const totalOverdueAmount = overdueEmis.reduce((sum, e) => sum + e.amount, 0);
  const totalDueTodayAmount = dueTodayEmis.reduce((sum, e) => sum + e.amount, 0);
  const totalNext7Amount = next7DaysEmis.reduce((sum, e) => sum + e.amount, 0);
  const totalNext30Amount = next30DaysEmis.reduce((sum, e) => sum + e.amount, 0);

  // Filter list
  const filteredEmis = allEmis.filter(e => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      e.loanId?.toLowerCase().includes(term) ||
      e.customerName?.toLowerCase().includes(term) ||
      e.mobile?.includes(term) ||
      e.itemName?.toLowerCase().includes(term)
    );

    if (!matchesSearch) return false;

    if (filterTab === 'OVERDUE') return e.status === 'Overdue';
    if (filterTab === 'TODAY') return e.status === 'Due Today';
    if (filterTab === 'NEXT7') {
      if (e.status === 'Paid') return false;
      const diff = getDaysDiff(todayStr, e.dueDate);
      return diff >= 0 && diff <= 7;
    }
    if (filterTab === 'NEXT30') {
      if (e.status === 'Paid') return false;
      const diff = getDaysDiff(todayStr, e.dueDate);
      return diff >= 0 && diff <= 30;
    }
    if (filterTab === 'PAID') return e.status === 'Paid';

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            EMI SCHEDULE & DUE TRACKER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Monitor loan EMIs, due dates, upcoming collections, and send overdue alert reminders
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="#e5b869" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search Name / Loan ID / Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', background: '#12141c', borderRadius: '30px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
        {/* Metric 1: Overdue */}
        <div 
          onClick={() => setFilterTab('OVERDUE')}
          className="glass-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: filterTab === 'OVERDUE' ? '#ef4444' : 'rgba(239,68,68,0.3)',
            background: filterTab === 'OVERDUE' ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: 700 }}>
              🚨 Overdue EMIs
            </span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.2rem' }}>
            {overdueEmis.length} EMIs
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            {formatCurrency(totalOverdueAmount)} Total Due
          </span>
        </div>

        {/* Metric 2: Due Today */}
        <div 
          onClick={() => setFilterTab('TODAY')}
          className="glass-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: filterTab === 'TODAY' ? '#f59e0b' : 'rgba(245,158,11,0.3)',
            background: filterTab === 'TODAY' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#fde68a', textTransform: 'uppercase', fontWeight: 700 }}>
              📅 Due Today
            </span>
            <Calendar size={18} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem' }}>
            {dueTodayEmis.length} EMIs
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            {formatCurrency(totalDueTodayAmount)} Collection
          </span>
        </div>

        {/* Metric 3: Next 7 Days */}
        <div 
          onClick={() => setFilterTab('NEXT7')}
          className="glass-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: filterTab === 'NEXT7' ? '#3b82f6' : 'rgba(59,130,246,0.3)',
            background: filterTab === 'NEXT7' ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
              ⏳ Next 7 Days
            </span>
            <Clock size={18} color="#60a5fa" />
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.2rem' }}>
            {next7DaysEmis.length} EMIs
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            {formatCurrency(totalNext7Amount)} Upcoming
          </span>
        </div>

        {/* Metric 4: Next 30 Days */}
        <div 
          onClick={() => setFilterTab('NEXT30')}
          className="glass-card" 
          style={{ 
            cursor: 'pointer',
            borderColor: filterTab === 'NEXT30' ? '#e5b869' : 'rgba(229,184,105,0.3)',
            background: filterTab === 'NEXT30' ? 'rgba(229,184,105,0.12)' : 'rgba(229,184,105,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#f5d78a', textTransform: 'uppercase', fontWeight: 700 }}>
              🗓️ Next 30 Days
            </span>
            <Coins size={18} color="#f5d78a" />
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f5d78a', marginBottom: '0.2rem' }}>
            {next30DaysEmis.length} EMIs
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            {formatCurrency(totalNext30Amount)} Projected
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        background: '#12141c',
        padding: '0.4rem 0.8rem',
        borderRadius: '30px',
        border: '1px solid rgba(229,184,105,0.2)'
      }}>
        {[
          { id: 'OVERDUE', label: `🚨 Overdue (${overdueEmis.length})` },
          { id: 'TODAY', label: `📅 Due Today (${dueTodayEmis.length})` },
          { id: 'NEXT7', label: `⏳ Next 7 Days (${next7DaysEmis.length})` },
          { id: 'NEXT30', label: `🗓️ Next 30 Days (${next30DaysEmis.length})` },
          { id: 'PAID', label: `✅ Paid EMIs (${paidEmis.length})` },
          { id: 'ALL', label: `📋 All EMIs (${allEmis.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={filterTab === tab.id ? 'btn-gold' : 'btn-secondary'}
            style={{ padding: '0.35rem 0.95rem', fontSize: '0.78rem', borderRadius: '20px', border: 'none' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main EMIs Table */}
      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Loan & Customer</th>
                <th>Contact</th>
                <th>Pledged Asset</th>
                <th>EMI No</th>
                <th>Due Date</th>
                <th>Amount (₹)</th>
                <th>Due Status</th>
                <th>Actions & Alerts</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmis.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No EMIs match the current filter and search criteria.
                  </td>
                </tr>
              ) : (
                filteredEmis.map((emi, index) => (
                  <tr key={`${emi.loanId}-${emi.emiNo}-${index}`}>
                    <td>
                      <button
                        onClick={() => onOpenCustomer360 && onOpenCustomer360(emi)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: '#f5d78a', fontSize: '0.95rem' }}>
                          {emi.customerName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Loan ID: <span style={{ textDecoration: 'underline' }}>{emi.loanId}</span>
                        </div>
                      </button>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                        <span>📱 {emi.mobile}</span>
                      </div>
                    </td>

                    <td>
                      <span className={emi.itemType === 'Gold' ? 'badge badge-gold' : 'badge badge-silver'}>
                        {emi.itemName}
                      </span>
                    </td>

                    <td style={{ fontWeight: 700 }}>
                      EMI {emi.emiNo} / {emi.totalEmis}
                    </td>

                    <td style={{ fontWeight: emi.status === 'Overdue' ? 700 : 400, color: emi.status === 'Overdue' ? '#ef4444' : '#cbd5e1' }}>
                      {emi.dueDate}
                    </td>

                    <td style={{ fontWeight: 800, color: '#f5d78a', fontSize: '0.95rem' }}>
                      {formatCurrency(emi.amount)}
                    </td>

                    <td>
                      {emi.status === 'Paid' && (
                        <span className="badge badge-active" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                          ✓ Paid on {emi.paidDate || 'Date'}
                        </span>
                      )}
                      {emi.status === 'Overdue' && (
                        <span className="badge badge-overdue">
                          🚨 Overdue ({emi.daysOverdue} Days)
                        </span>
                      )}
                      {emi.status === 'Due Today' && (
                        <span className="badge badge-gold" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                          📅 Due Today
                        </span>
                      )}
                      {emi.status === 'Upcoming' && (
                        <span className="badge badge-silver">
                          ⏳ In {emi.daysLeft} Days
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {emi.status !== 'Paid' ? (
                          <>
                            <button
                              onClick={() => {
                                const targetLoan = loans.find(l => l.id === emi.loanId);
                                if (onOpenPaymentModal && targetLoan) {
                                  onOpenPaymentModal(targetLoan);
                                }
                              }}
                              className="btn-gold"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <CreditCard size={13} /> Collect EMI
                            </button>

                            {(emi.status === 'Overdue' || emi.status === 'Due Today') && (
                              <button
                                onClick={() => onOpenSendAlert && onOpenSendAlert(emi)}
                                className="btn-secondary"
                                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
                                title="Send WhatsApp / SMS Overdue Reminder"
                              >
                                <Send size={13} /> Alert
                              </button>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                            Receipt: {emi.receiptNo}
                          </span>
                        )}
                      </div>
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
