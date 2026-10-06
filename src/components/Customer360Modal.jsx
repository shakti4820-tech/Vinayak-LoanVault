import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lock, 
  CreditCard, 
  X,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  Send
} from 'lucide-react';
import { getCustomer360Profile, formatCurrency } from '../utils/loanUtils';

export const Customer360Modal = ({ 
  isOpen, 
  onClose, 
  customerData, 
  loanData, 
  onOpenPaymentModal, 
  onOpenSendAlert,
  onOpenDocument 
}) => {
  const { customers, loans, payments, closeLoan } = useApp();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'closed' | 'schedule' | 'vault'
  const [selectedLoanForSchedule, setSelectedLoanForSchedule] = useState(null);

  if (!isOpen) return null;

  // Resolve target customer
  let targetCustomer = customerData;

  if (!targetCustomer && loanData) {
    targetCustomer = customers.find(c => 
      c.mobile === loanData.mobile || 
      c.id === loanData.memberNo || 
      c.name?.toLowerCase() === loanData.customerName?.toLowerCase()
    );

    if (!targetCustomer) {
      targetCustomer = {
        id: loanData.memberNo || 'RVNL0000334',
        name: loanData.customerName,
        fatherName: loanData.fatherName || 'BHANWAR LAL',
        mobile: loanData.mobile,
        address: loanData.address || 'Kuchaman City, RJ',
        idProofType: loanData.idProofType || 'Aadhaar Card',
        idProofNo: loanData.idProofNo || 'XXXX-XXXX-4468',
        dateJoined: loanData.loanDate
      };
    }
  }

  if (!targetCustomer && customers.length > 0) {
    targetCustomer = customers[0];
  }

  const profile = getCustomer360Profile(targetCustomer, loans, payments);

  if (!profile) return null;

  const handleCloseLoanAction = (loanId) => {
    if (window.confirm(`Are you sure you want to CLOSE & SETTLE loan ${loanId}? This will release the pledged ornaments back to the member.`)) {
      closeLoan(loanId);
      alert(`Loan ${loanId} successfully closed! Pledged items released.`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#12141c',
        border: '1px solid var(--gold-primary)',
        boxShadow: '0 0 40px rgba(229,184,105,0.25)',
        padding: '0',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,184,105,0.15) 0%, rgba(18,20,28,0.95) 100%)',
          padding: '1.2rem 1.8rem',
          borderBottom: '1px solid rgba(229,184,105,0.3)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(229,184,105,0.4)',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: '#000'
            }}>
              {targetCustomer.name ? targetCustomer.name.charAt(0) : 'M'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  Member No: {targetCustomer.id}
                </span>
                {profile.overdueEmisCount > 0 && (
                  <span className="badge badge-overdue">
                    🚨 {profile.overdueEmisCount} Overdue EMI Alert
                  </span>
                )}
              </div>
              <h2 className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>
                {targetCustomer.name}
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', gap: '1rem', marginTop: '2px' }}>
                <span>S/O {targetCustomer.fatherName || 'BHANWAR LAL'}</span>
                <span>• 📱 {targetCustomer.mobile}</span>
                <span>• 📍 {targetCustomer.address}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Financial Overview Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(229,184,105,0.15)',
          borderBottom: '1px solid rgba(229,184,105,0.2)'
        }}>
          <div style={{ background: '#12141c', padding: '0.9rem 1.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sanctioned Loans</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
              {formatCurrency(profile.totalBorrowed)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#e5b869' }}>
              {profile.activeLoans.length} Active • {profile.closedLoans.length} Closed
            </div>
          </div>

          <div style={{ background: '#12141c', padding: '0.9rem 1.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMIs Paid vs Remaining</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {profile.paidEmisCount} / {profile.totalEmisCount} EMIs Paid
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {profile.totalEmisCount - profile.paidEmisCount} EMIs Pending
            </div>
          </div>

          <div style={{ background: '#12141c', padding: '0.9rem 1.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Interest Paid</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f5d78a', marginTop: '2px' }}>
              {formatCurrency(profile.totalInterestPaid)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981' }}>
              Receipts verified
            </div>
          </div>

          <div style={{ background: '#12141c', padding: '0.9rem 1.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KYC & Status</span>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#60a5fa', marginTop: '4px' }}>
              {targetCustomer.idProofType}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {targetCustomer.idProofNo}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#0d0f17',
          padding: '0 1.2rem'
        }}>
          {[
            { id: 'active', label: `Current Loans (${profile.activeLoans.length})`, icon: Coins },
            { id: 'closed', label: `Closed Loans (${profile.closedLoans.length})`, icon: Lock },
            { id: 'schedule', label: `EMI Schedule & Paid Dates`, icon: Clock },
            { id: 'vault', label: `Pledged Gold Vault`, icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.2rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isTabActive ? '2px solid var(--gold-primary)' : '2px solid transparent',
                  color: isTabActive ? '#f5d78a' : '#94a3b8',
                  fontWeight: isTabActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} color={isTabActive ? '#f5d78a' : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* TAB 1: CURRENT ACTIVE LOANS */}
          {activeTab === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.activeLoans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No active loans currently running for this member.
                </div>
              ) : (
                profile.activeLoans.map(loan => (
                  <div key={loan.id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#f5d78a', fontSize: '1.1rem' }}>{loan.id}</span>
                          <span className={loan.itemType === 'Gold' ? 'badge badge-gold' : 'badge badge-silver'}>
                            {loan.itemName} ({loan.purity})
                          </span>
                          <span className="badge badge-active">Active Loan</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                          Sanction Date: {loan.loanDate} • Due Date: {loan.dueDate} • Interest: {loan.interestRate}% p.a
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sanction Amount</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f5d78a' }}>
                          {formatCurrency(loan.loanAmount)}
                        </div>
                      </div>
                    </div>

                    {/* EMI Statistics Progress Bar */}
                    <div style={{ background: '#0a0b0e', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#cbd5e1' }}>
                          EMIs Track: <strong style={{ color: '#10b981' }}>{loan.paidEmis} Paid</strong> out of <strong>{loan.schedule.length} Total</strong>
                        </span>
                        <span style={{ color: loan.overdueEmis > 0 ? '#ef4444' : '#f5d78a', fontWeight: 700 }}>
                          {loan.overdueEmis > 0 ? `🚨 ${loan.overdueEmis} EMI Overdue` : `${loan.remainingEmis} EMIs Remaining`}
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(loan.paidEmis / loan.schedule.length) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>

                    {/* Pledged Asset Details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        ⚖️ Pledged Weight: <strong style={{ color: '#f8fafc' }}>{loan.netWeight}g Net</strong> (Gross: {loan.grossWeight}g) • Market Val: {formatCurrency(loan.marketValue)}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {onOpenDocument && (
                          <button onClick={() => onOpenDocument(loan)} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}>
                            <Printer size={14} /> Slips
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedLoanForSchedule(loan.id);
                            setActiveTab('schedule');
                          }}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', color: '#f5d78a', borderColor: '#e5b869' }}
                        >
                          <Clock size={14} /> View EMI Dates
                        </button>
                        <button
                          onClick={() => onOpenPaymentModal && onOpenPaymentModal(loan)}
                          className="btn-gold"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.79rem' }}
                        >
                          <CreditCard size={14} /> Pay EMI
                        </button>
                        <button
                          onClick={() => handleCloseLoanAction(loan.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)' }}
                          title="Settle full balance & close loan"
                        >
                          <Lock size={14} /> Settle & Close Loan
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: CLOSED LOANS */}
          {activeTab === 'closed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.closedLoans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No closed/settled loan history found for this member.
                </div>
              ) : (
                profile.closedLoans.map(loan => (
                  <div key={loan.id} className="glass-card" style={{ background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>{loan.id}</span>
                          <span className="badge badge-active" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                            ✓ Fully Settled & Closed
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                          Pledged Item: <strong>{loan.itemName} ({loan.purity}, {loan.netWeight}g)</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                          Sanction Date: {loan.loanDate} • Closed On: {loan.closedDate || loan.dueDate}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Settled Loan Amount</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                          {formatCurrency(loan.loanAmount)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Item Handed Back</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.8rem', paddingTop: '0.6rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                      📝 <strong>Closure Note:</strong> {loan.notes || 'All EMIs fully cleared with zero outstanding balance.'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: COMPLETE EMI REPAYMENT SCHEDULE & DATES */}
          {activeTab === 'schedule' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f5d78a' }}>
                  EMI Payment Tracker & Breakdown
                </h3>
                {profile.allLoans.length > 1 && (
                  <select
                    className="form-control"
                    style={{ width: 'auto', fontSize: '0.82rem', padding: '0.35rem 0.8rem' }}
                    value={selectedLoanForSchedule || ''}
                    onChange={(e) => setSelectedLoanForSchedule(e.target.value)}
                  >
                    <option value="">All Member Loans ({profile.allLoans.length})</option>
                    {profile.allLoans.map(l => (
                      <option key={l.id} value={l.id}>{l.id} - {l.itemName} ({l.status})</option>
                    ))}
                  </select>
                )}
              </div>

              {profile.allLoans
                .filter(l => !selectedLoanForSchedule || l.id === selectedLoanForSchedule)
                .map(loan => (
                  <div key={loan.id} className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
                      <div>
                        <strong style={{ color: '#f5d78a', fontSize: '1rem' }}>{loan.id}</strong> ({loan.itemName})
                        <span className={`badge ${loan.status === 'Active' ? 'badge-active' : 'badge-gold'}`} style={{ marginLeft: '8px' }}>
                          {loan.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                        Monthly EMI: <strong style={{ color: '#f5d78a' }}>{formatCurrency(loan.emiAmount)}</strong>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                        <thead>
                          <tr>
                            <th>EMI No</th>
                            <th>Due Date</th>
                            <th>EMI Amount</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                            <th>Receipt / Ref</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loan.schedule.map(emi => (
                            <tr key={emi.emiNo}>
                              <td style={{ fontWeight: 700 }}>EMI {emi.emiNo} / {emi.totalEmis}</td>
                              <td>{emi.dueDate}</td>
                              <td style={{ fontWeight: 700, color: '#f8fafc' }}>{formatCurrency(emi.amount)}</td>
                              <td>
                                {emi.status === 'Paid' && (
                                  <span className="badge badge-active" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                                    ✓ Paid
                                  </span>
                                )}
                                {emi.status === 'Overdue' && (
                                  <span className="badge badge-overdue">
                                    🚨 Overdue ({emi.daysOverdue} days)
                                  </span>
                                )}
                                {emi.status === 'Due Today' && (
                                  <span className="badge badge-gold" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                                    📅 Due Today
                                  </span>
                                )}
                                {emi.status === 'Upcoming' && (
                                  <span className="badge badge-silver">
                                    ⏳ Upcoming ({emi.daysLeft} days)
                                  </span>
                                )}
                              </td>
                              <td style={{ color: emi.paidDate ? '#34d399' : '#64748b' }}>
                                {emi.paidDate || '-'}
                              </td>
                              <td style={{ fontFamily: 'monospace', color: '#f5d78a' }}>
                                {emi.receiptNo || '-'}
                              </td>
                              <td>
                                {emi.status !== 'Paid' && (
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button
                                      onClick={() => onOpenPaymentModal && onOpenPaymentModal(loan)}
                                      className="btn-gold"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                                    >
                                      Pay Now
                                    </button>
                                    {(emi.status === 'Overdue' || emi.status === 'Due Today') && onOpenSendAlert && (
                                      <button
                                        onClick={() => onOpenSendAlert({
                                          loanId: loan.id,
                                          customerName: targetCustomer.name,
                                          mobile: targetCustomer.mobile,
                                          amount: emi.amount,
                                          dueDate: emi.dueDate,
                                          daysOverdue: emi.daysOverdue,
                                          emiNo: emi.emiNo,
                                          totalEmis: emi.totalEmis,
                                          itemName: loan.itemName
                                        })}
                                        className="btn-secondary"
                                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', color: '#ef4444', borderColor: '#ef4444' }}
                                      >
                                        <Send size={11} /> Alert
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 4: PLEDGED ORNAMENTS VAULT PHOTOS */}
          {activeTab === 'vault' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f5d78a', marginBottom: '1rem' }}>
                Pledged Ornaments Verification Photos
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
                {profile.allLoans.map(loan => (
                  <div key={loan.id} className="glass-card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5d78a', marginBottom: '0.4rem' }}>
                      {loan.itemName} ({loan.netWeight}g)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.8rem' }}>
                      Loan ID: {loan.id} • Status: {loan.status}
                    </div>

                    {loan.photos?.front ? (
                      <img
                        src={loan.photos.front}
                        alt={loan.itemName}
                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(229,184,105,0.3)' }}
                      />
                    ) : (
                      <div style={{ height: '160px', background: '#0a0b0e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        No Photo Available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
