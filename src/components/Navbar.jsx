import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, LogOut, TrendingUp, Sparkles, Building2, Bell } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { getAllEmiItems } from '../utils/loanUtils';

export const Navbar = ({ onOpenCalculator, onNavigate }) => {
  const { currentUser, logout, metalRates, loans, payments } = useApp();

  const allEmis = getAllEmiItems(loans, payments);
  const overdueEmis = allEmis.filter(e => e.status === 'Overdue');
  const overdueCount = overdueEmis.length;

  return (
    <header className="no-print" style={{
      background: 'rgba(7, 9, 14, 0.92)',
      borderBottom: '1px solid rgba(225, 29, 72, 0.25)',
      boxShadow: '0 4px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(30, 58, 138, 0.25)',
      padding: '0.75rem 1.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(16px)'
    }}>
      {/* Brand & Official Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <BrandLogo 
          variant="full" 
          size="md" 
          onClick={() => onNavigate && onNavigate('dashboard')} 
        />

        <div style={{ 
          borderLeft: '1px solid rgba(225, 29, 72, 0.3)', 
          paddingLeft: '1.2rem', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            Registered Nidhi Company • CIN: U65990RJ2022PLN083831
          </span>
          <span style={{ fontSize: '0.82rem', color: '#e5b869', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Building2 size={13} color="#dc2626" /> Kuchaman City Branch (Nagaur, RJ)
          </span>
        </div>
      </div>

      {/* Live Market Rates Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 15, 23, 0.9) 0%, rgba(18, 24, 38, 0.95) 100%)',
        border: '1px solid rgba(229, 184, 105, 0.3)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(229,184,105,0.05)',
        borderRadius: '30px',
        padding: '0.45rem 1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        fontSize: '0.85rem'
      }}>
        {/* 24K Gold Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#f5d78a" />
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>Live 24K Gold:</span>
          <span style={{ color: '#f5d78a', fontWeight: 800, textShadow: '0 0 8px rgba(245,215,138,0.4)' }}>
            ₹{metalRates.gold24k}/g
          </span>
        </div>

        <span style={{ opacity: 0.3, color: '#e5b869' }}>|</span>

        {/* 22K Gold Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>22K Gold:</span>
          <span style={{ color: '#f5d78a', fontWeight: 800 }}>
            ₹{metalRates.gold22k}/g
          </span>
        </div>

        <span style={{ opacity: 0.3, color: '#e5b869' }}>|</span>

        {/* 999 Silver Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>999 Silver:</span>
          <span style={{ color: '#cbd5e1', fontWeight: 800, textShadow: '0 0 8px rgba(203,213,225,0.4)' }}>
            ₹{metalRates.silver999}/g
          </span>
        </div>
        
        <button 
          onClick={onOpenCalculator}
          className="btn-gold" 
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', borderRadius: '20px', marginLeft: '0.4rem' }}
        >
          <TrendingUp size={13} /> Rate Calculator
        </button>
      </div>

      {/* Overdue Alerts & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Overdue Bell Alert Icon */}
        <button
          onClick={() => onNavigate && onNavigate('emi-tracker')}
          title={overdueCount > 0 ? `${overdueCount} Overdue EMIs requiring alert!` : 'EMI Schedule & Alerts'}
          className="btn-secondary"
          style={{
            position: 'relative',
            padding: '0.55rem',
            borderRadius: '50%',
            borderColor: overdueCount > 0 ? 'rgba(239,68,68,0.6)' : 'rgba(229,184,105,0.3)',
            background: overdueCount > 0 ? 'rgba(239,68,68,0.2)' : 'transparent',
            boxShadow: overdueCount > 0 ? '0 0 15px rgba(239,68,68,0.4)' : 'none'
          }}
        >
          <Bell size={18} color={overdueCount > 0 ? '#ef4444' : '#e5b869'} />
          {overdueCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(239,68,68,0.8)'
            }}>
              {overdueCount}
            </span>
          )}
        </button>

        {/* User Profile Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 0 12px rgba(225,29,72,0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            RM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{currentUser.role}</span>
          </div>
        </div>

        <button 
          onClick={logout} 
          title="Sign Out" 
          className="btn-secondary"
          style={{ padding: '0.55rem', borderRadius: '50%' }}
        >
          <LogOut size={16} color="#ef4444" />
        </button>
      </div>
    </header>
  );
};
