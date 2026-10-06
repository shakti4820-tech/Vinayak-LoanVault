import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Search, Plus, Printer, CheckCircle } from 'lucide-react';

export const Payments = () => {
  const { payments, loans, addPayment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedLoanId, setSelectedLoanId] = useState(loans[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState(4657);
  const [paymentType, setPaymentType] = useState('Interest EMI');
  const [paymentMode, setPaymentMode] = useState('Cash / UPI');

  const filteredPayments = payments.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.id?.toLowerCase().includes(term) ||
      p.loanId?.toLowerCase().includes(term) ||
      p.customerName?.toLowerCase().includes(term) ||
      p.receiptNo?.toLowerCase().includes(term)
    );
  });

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const targetLoan = loans.find(l => l.id === selectedLoanId);

    const newPayment = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      loanId: selectedLoanId,
      customerName: targetLoan?.customerName || 'Customer',
      date: new Date().toISOString().slice(0, 10),
      amount: Number(paymentAmount),
      type: paymentType,
      mode: paymentMode,
      receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`
    };

    addPayment(newPayment);
    setModalOpen(false);
    alert(`Receipt Generated: ${newPayment.receiptNo} for ₹${newPayment.amount}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            PAYMENTS & REPAYMENT LOGS
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Record interest collections, EMI payments, and print customer payment receipts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={() => setModalOpen(true)} className="btn-gold">
            <Plus size={16} /> Record New Payment
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Loan ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Payment Type</th>
                <th>Payment Mode</th>
                <th>Amount Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: '#f5d78a' }}>{p.receiptNo}</td>
                  <td>{p.loanId}</td>
                  <td>{p.customerName}</td>
                  <td>{p.date}</td>
                  <td><span className="badge badge-gold">{p.type}</span></td>
                  <td>{p.mode}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>₹{p.amount?.toLocaleString()}</td>
                  <td><span className="badge badge-active">Received</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2400, padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#12141c', border: '1px solid var(--gold-primary)' }}>
            <h3 className="gold-text" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Record Payment Receipt
            </h3>
            <form onSubmit={handleRecordPayment}>
              <div className="form-group">
                <label>Select Active Loan</label>
                <select className="form-control" value={selectedLoanId} onChange={(e) => setSelectedLoanId(e.target.value)}>
                  {loans.map(l => (
                    <option key={l.id} value={l.id}>{l.id} - {l.customerName} (₹{l.loanAmount})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Payment Amount (₹)</label>
                <input type="number" className="form-control" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Payment Type</label>
                <select className="form-control" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="Interest EMI">Interest EMI</option>
                  <option value="Principal Repayment">Principal Repayment</option>
                  <option value="Full Redemption">Full Redemption / Loan Closure</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Mode</label>
                <select className="form-control" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="Cash / UPI">Cash / UPI</option>
                  <option value="Bank NEFT / RTGS">Bank NEFT / RTGS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-gold"><CheckCircle size={16} /> Confirm Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
