import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Sparkles, 
  Database, 
  Upload, 
  Download, 
  Building2, 
  PlusCircle, 
  CheckCircle, 
  Zap, 
  MessageSquare, 
  Globe, 
  Shield,
  RotateCcw
} from 'lucide-react';

export const Settings = () => {
  const { metalRates, updateMetalRates, exportDataBackup, importDataBackup, resetCustomerDataToDemo } = useApp();

  const [ratesForm, setRatesForm] = useState(metalRates);
  const [importStatus, setImportStatus] = useState('');

  const handleRatesSubmit = (e) => {
    e.preventDefault();
    updateMetalRates(ratesForm);
    alert('✅ Today Metal Rates & LTV parameters updated successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const ok = importDataBackup(event.target.result);
        if (ok) {
          setImportStatus('🎉 Backup imported successfully! All records restored.');
        } else {
          setImportStatus('❌ Failed to restore backup. Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          SETTINGS & EXTENSIBILITY PORTAL
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Configure live metal rates, manage local backups, and view ready future extension slots
        </p>
      </div>

      {/* SECTION 1: LIVE METAL RATES & LTV CONFIGURATION */}
      <div className="glass-card">
        <h3 className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> 1. Daily Metal Market Rates & LTV Limits
        </h3>

        <form onSubmit={handleRatesSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
            <div className="form-group">
              <label>24K Gold Rate (₹/g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.gold24k} 
                onChange={(e) => setRatesForm({ ...ratesForm, gold24k: Number(e.target.value) })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>22K Gold Rate (₹/g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.gold22k} 
                onChange={(e) => setRatesForm({ ...ratesForm, gold22k: Number(e.target.value) })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>20K Gold Rate (₹/g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.gold20k || 6125} 
                onChange={(e) => setRatesForm({ ...ratesForm, gold20k: Number(e.target.value) })} 
              />
            </div>

            <div className="form-group">
              <label>18K Gold Rate (₹/g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.gold18k} 
                onChange={(e) => setRatesForm({ ...ratesForm, gold18k: Number(e.target.value) })} 
              />
            </div>

            <div className="form-group">
              <label>999 Silver Rate (₹/g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.silver999} 
                onChange={(e) => setRatesForm({ ...ratesForm, silver999: Number(e.target.value) })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Standard Gold LTV (%)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.goldLtv} 
                onChange={(e) => setRatesForm({ ...ratesForm, goldLtv: Number(e.target.value) })} 
              />
            </div>

            <div className="form-group">
              <label>Standard Silver LTV (%)</label>
              <input 
                type="number" 
                className="form-control" 
                value={ratesForm.silverLtv} 
                onChange={(e) => setRatesForm({ ...ratesForm, silverLtv: Number(e.target.value) })} 
              />
            </div>

            <div className="form-group">
              <label>Default Interest Rate (% p.a)</label>
              <input 
                type="number" 
                step="0.1" 
                className="form-control" 
                value={ratesForm.defaultInterestRate || 22.0} 
                onChange={(e) => setRatesForm({ ...ratesForm, defaultInterestRate: Number(e.target.value) })} 
              />
            </div>
          </div>

          <button type="submit" className="btn-gold">
            <CheckCircle size={16} /> Save Metal Rates
          </button>
        </form>
      </div>

      {/* SECTION 2: COMPANY INFORMATION */}
      <div className="glass-card">
        <h3 className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} /> 2. Registered Company Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', lineHeight: '1.8', color: '#cbd5e1' }}>
          <div>
            <div><strong>Company Name:</strong> Riddhi Vinayak Benifit Nidhi Ltd</div>
            <div><strong>Branch:</strong> Kuchaman City (Nagaur, RJ)</div>
            <div><strong>Address:</strong> J.K. PLAZA, KUMAWAT COMPLEX KE PASS, KUCHAMAN NAGAUR RJ 341509 IN</div>
          </div>
          <div>
            <div><strong>Corporate Identification No (CIN):</strong> U65990RJ2022PLN083831</div>
            <div><strong>Registration Type:</strong> Nidhi Company under Companies Act</div>
            <div><strong>System Status:</strong> Private Local Encryption Vault</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DATA BACKUP & RESTORE */}
      <div className="glass-card">
        <h3 className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} /> 3. Data Backup & Restore (JSON Storage)
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.2rem' }}>
          Export all active loans, customer details, payment logs, and photos to a single offline backup JSON file, or restore existing backups onto a new computer.
        </p>

        {importStatus && (
          <div style={{ padding: '0.8rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {importStatus}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={exportDataBackup} className="btn-gold">
            <Download size={16} /> Export Complete System Backup (.JSON)
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Restore Backup File
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset customer records, loans, and payments to clean synthetic dummy demo data? Admin settings will remain unchanged.")) {
                resetCustomerDataToDemo();
                setImportStatus("✅ Customer data reset to clean synthetic dummy records!");
              }
            }} 
            className="btn-secondary"
            style={{ color: '#fca5a5', borderColor: 'rgba(239,68,68,0.4)' }}
          >
            <RotateCcw size={16} /> Reset Customer Data to Dummy Data
          </button>
        </div>
      </div>

      {/* SECTION 4: FUTURE EXPANSION MODULE SLOTS (Modular Architecture) */}
      <div className="glass-card" style={{ border: '1px stroke var(--gold-dark)' }}>
        <h3 className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} /> 4. Modular Feature Slots (Ready for Future Expansion 🚀)
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.2rem' }}>
          This system is engineered with an extensible state and component architecture. Additional modules can be activated anytime:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(10,11,14,0.6)', padding: '1rem', borderRadius: '10px', border: '1px dashed rgba(229,184,105,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5d78a', fontWeight: 700, fontSize: '0.9rem' }}>
              <MessageSquare size={16} /> Automatic WhatsApp & SMS Slips
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Directly dispatch sanction letter PDF & installment reminders to customer WhatsApp.
            </p>
          </div>

          <div style={{ background: 'rgba(10,11,14,0.6)', padding: '1rem', borderRadius: '10px', border: '1px dashed rgba(229,184,105,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5d78a', fontWeight: 700, fontSize: '0.9rem' }}>
              <Globe size={16} /> Multi-Branch Sync
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Connect multiple Nidhi branches to a central cloud server backend.
            </p>
          </div>

          <div style={{ background: 'rgba(10,11,14,0.6)', padding: '1rem', borderRadius: '10px', border: '1px dashed rgba(229,184,105,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5d78a', fontWeight: 700, fontSize: '0.9rem' }}>
              <Shield size={16} /> Auction & Foreclosure Module
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Track legal notices, public auction bidding, and pledge forfeiture logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
