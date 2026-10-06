import React, { useState } from 'react';
import { AlertTriangle, Send, Copy, MessageSquare, PhoneCall, Check, FileText, X } from 'lucide-react';
import { formatCurrency } from '../utils/loanUtils';

export const SendAlertModal = ({ isOpen, onClose, emiItem }) => {
  const [copied, setCopied] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen || !emiItem) return null;

  const {
    loanId,
    customerName,
    mobile,
    amount,
    dueDate,
    daysOverdue,
    emiNo,
    totalEmis,
    itemName
  } = emiItem;

  const branchName = "Riddhi Vinayak Nidhi Ltd, Kuchaman City";
  const contactNo = "9876500000";

  const messageText = `Dear ${customerName || 'Valued Member'},\n` +
    `Greetings from ${branchName}.\n\n` +
    `This is an automated payment alert regarding your Gold/Silver Loan (${loanId}).\n` +
    `• EMI #${emiNo} of ${totalEmis}: ${formatCurrency(amount)}\n` +
    `• Pledged Asset: ${itemName || 'Gold Ornaments'}\n` +
    `• Due Date: ${dueDate} (${daysOverdue > 0 ? `${daysOverdue} days past due` : 'Due today'})\n\n` +
    `Kindly clear your pending EMI payment at your earliest to maintain clean credit history & avoid overdue penalty.\n` +
    `Branch Address: Station Road, Kuchaman City (Nagaur, RJ).\n` +
    `Contact: ${contactNo}`;

  const handleWhatsAppSend = () => {
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '');
    const mobileWithCode = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;
    const url = `https://wa.me/${mobileWithCode}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
    setAlertSent(true);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '560px',
        background: '#12141c',
        border: '1px solid rgba(239,68,68,0.5)',
        boxShadow: '0 0 30px rgba(239,68,68,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '0.8rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fca5a5' }}>
            <AlertTriangle size={22} color="#ef4444" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Send Overdue EMI Alert Notice
            </h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Customer & EMI Context Box */}
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px',
          padding: '0.9rem 1.1rem',
          marginBottom: '1.2rem',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{customerName}</span>
            <span className="badge badge-overdue">{daysOverdue > 0 ? `${daysOverdue} Days Overdue` : 'Due Today'}</span>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', gap: '1.2rem' }}>
            <span>Loan ID: <strong style={{ color: '#f5d78a' }}>{loanId}</strong></span>
            <span>EMI: <strong style={{ color: '#ef4444' }}>{formatCurrency(amount)}</strong></span>
            <span>Mobile: <strong>{mobile}</strong></span>
          </div>
        </div>

        {/* Message Preview */}
        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Formatted Reminder Notice Text:</label>
          <textarea
            className="form-control"
            value={messageText}
            readOnly
            rows={8}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: '1.5',
              background: '#0a0b0e',
              color: '#e2e8f0',
              resize: 'none'
            }}
          />
        </div>

        {alertSent && (
          <div style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ Overdue alert initiated via WhatsApp! Reminder logged in system.
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <button onClick={handleCopyMessage} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Text'}
          </button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              Close
            </button>

            <button
              onClick={handleWhatsAppSend}
              className="btn-gold"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            >
              <MessageSquare size={16} /> Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
