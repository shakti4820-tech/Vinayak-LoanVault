import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Sparkles, Scale, TrendingUp, CheckCircle } from 'lucide-react';

export const LoanCalculator = ({ onNavigate }) => {
  const { metalRates } = useApp();

  const [metalType, setMetalType] = useState('Gold'); // 'Gold' | 'Silver'
  const [grossWeight, setGrossWeight] = useState(25.0);
  const [deductions, setDeductions] = useState(0.0);
  const [purity, setPurity] = useState('22K');
  const [ratePerGram, setRatePerGram] = useState(metalRates.gold22k || 6737);
  const [ltvPct, setLtvPct] = useState(metalRates.goldLtv || 75);

  // Auto rate update when purity changes
  const handlePurityChange = (e) => {
    const p = e.target.value;
    setPurity(p);
    if (metalType === 'Gold') {
      if (p === '24K') setRatePerGram(metalRates.gold24k);
      else if (p === '22K') setRatePerGram(metalRates.gold22k);
      else if (p === '20K') setRatePerGram(metalRates.gold20k || 6125);
      else if (p === '18K') setRatePerGram(metalRates.gold18k);
    } else {
      setRatePerGram(metalRates.silver999);
    }
  };

  const handleMetalChange = (type) => {
    setMetalType(type);
    if (type === 'Gold') {
      setPurity('22K');
      setRatePerGram(metalRates.gold22k);
      setLtvPct(metalRates.goldLtv || 75);
    } else {
      setPurity('925 Silver');
      setRatePerGram(metalRates.silver999 || 94);
      setLtvPct(metalRates.silverLtv || 75);
    }
  };

  // Calculations
  const netWeight = Math.max(0, grossWeight - deductions);
  const marketValuation = Math.round(netWeight * ratePerGram);
  const maxEligibleLoan = Math.round(marketValuation * (ltvPct / 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-cinzel gold-text" style={{ fontSize: '2rem', fontWeight: 800 }}>
          GOLD & SILVER LOAN CALCULATOR
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
          Calculate metal valuation, purity weight, and max eligible loan limit in real-time
        </p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--gold-primary)' }}>
        {/* Metal Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => handleMetalChange('Gold')}
            className={metalType === 'Gold' ? 'btn-gold' : 'btn-secondary'}
            style={{ padding: '0.65rem 2rem', fontSize: '1rem' }}
          >
            <Sparkles size={18} /> Gold Loan
          </button>
          <button
            onClick={() => handleMetalChange('Silver')}
            className={metalType === 'Silver' ? 'btn-gold' : 'btn-secondary'}
            style={{ padding: '0.65rem 2rem', fontSize: '1rem' }}
          >
            <Scale size={18} /> Silver Loan
          </button>
        </div>

        {/* Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Gross Weight (Grams)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={grossWeight}
              onChange={(e) => setGrossWeight(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Deduction / Stone Weight (Grams)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Metal Purity</label>
            {metalType === 'Gold' ? (
              <select className="form-control" value={purity} onChange={handlePurityChange}>
                <option value="24K">24K Fine Gold (99.9%)</option>
                <option value="22K">22K Hallmark (91.6%)</option>
                <option value="20K">20K Gold (83.3%)</option>
                <option value="18K">18K Gold (75.0%)</option>
              </select>
            ) : (
              <select className="form-control" value={purity} onChange={handlePurityChange}>
                <option value="925 Silver">925 Sterling Silver (92.5%)</option>
                <option value="999 Fine Silver">999 Fine Silver (99.9%)</option>
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Current Market Rate (₹/g)</label>
            <input
              type="number"
              className="form-control"
              value={ratePerGram}
              onChange={(e) => setRatePerGram(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>LTV / Lending Ratio (%)</label>
            <input
              type="number"
              className="form-control"
              value={ltvPct}
              onChange={(e) => setLtvPct(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,184,105,0.15) 0%, rgba(10,11,14,0.8) 100%)',
          border: '1px solid var(--gold-primary)',
          borderRadius: '16px',
          padding: '1.8rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Net Pure Weight</span>
            <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>{netWeight.toFixed(2)} g</h2>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Gross Market Valuation</span>
            <h2 style={{ fontSize: '1.8rem', color: '#cbd5e1', fontWeight: 800 }}>₹{marketValuation.toLocaleString('en-IN')}</h2>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: '#e5b869', textTransform: 'uppercase', fontWeight: 700 }}>Maximum Eligible Loan</span>
            <h2 className="gold-text" style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹{maxEligibleLoan.toLocaleString('en-IN')}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.8rem' }}>
          <button onClick={() => onNavigate('new-loan')} className="btn-gold" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            <CheckCircle size={18} /> Apply These Values to New Loan Entry
          </button>
        </div>
      </div>
    </div>
  );
};
