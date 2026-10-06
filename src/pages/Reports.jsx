import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Coins, Sparkles, Scale, Users, TrendingUp } from 'lucide-react';

export const Reports = () => {
  const { loans } = useApp();

  const totalSanctioned = loans.reduce((sum, l) => sum + Number(l.loanAmount || 0), 0);
  const goldCount = loans.filter(l => l.itemType === 'Gold').length;
  const silverCount = loans.filter(l => l.itemType === 'Silver').length;

  const goldValuation = loans.filter(l => l.itemType === 'Gold').reduce((sum, l) => sum + Number(l.marketValue || 0), 0);
  const silverValuation = loans.filter(l => l.itemType === 'Silver').reduce((sum, l) => sum + Number(l.marketValue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          PORTFOLIO REPORTS & ANALYTICS
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Real-time metrics on loan disbursements, asset security ratios, and portfolio growth
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.4rem' }}>
        {/* Asset Ratio Card */}
        <div className="glass-card">
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} /> Gold vs Silver Asset Ratio
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Gold Loans ({goldCount})</span>
                <span style={{ color: '#f5d78a', fontWeight: 700 }}>₹{goldValuation.toLocaleString()} Value</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${(goldCount / (loans.length || 1)) * 100}%`, height: '100%', background: 'var(--gold-gradient)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Silver Loans ({silverCount})</span>
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>₹{silverValuation.toLocaleString()} Value</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${(silverCount / (loans.length || 1)) * 100}%`, height: '100%', background: 'var(--silver-gradient)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Vault Status Card */}
        <div className="glass-card">
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Vault Collateral Coverage
          </h3>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#cbd5e1' }}>
            <div>• <strong>Total Portfolio Sanctioned:</strong> ₹{totalSanctioned.toLocaleString()}</div>
            <div>• <strong>Total Pledged Collateral Market Value:</strong> ₹{(goldValuation + silverValuation).toLocaleString()}</div>
            <div>• <strong>Average Portfolio LTV Ratio:</strong> {(((totalSanctioned) / (goldValuation + silverValuation || 1)) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
