import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Users, 
  Images, 
  Calculator, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Database,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllEmiItems } from '../utils/loanUtils';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { loans, payments } = useApp();
  const activeCount = loans.filter(l => l.status === 'Active').length;
  
  const allEmis = getAllEmiItems(loans, payments);
  const overdueCount = allEmis.filter(e => e.status === 'Overdue').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-loan', label: 'New Loan Entry', icon: PlusCircle, highlight: true },
    { id: 'active-loans', label: 'Active & Due Loans', icon: FileText, badge: activeCount },
    { id: 'emi-tracker', label: 'EMI Schedule & Alerts', icon: Clock, badge: overdueCount > 0 ? `🚨 ${overdueCount}` : null, isAlert: overdueCount > 0 },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'item-gallery', label: 'Item Gallery', icon: Images },
    { id: 'calculator', label: 'Loan Calculator', icon: Calculator },
    { id: 'payments', label: 'Payments & Interest', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Backup', icon: Settings },
  ];

  return (
    <aside className="no-print" style={{
      width: '260px',
      background: '#0d0f17',
      borderRight: '1px solid rgba(229, 184, 105, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.2rem 0.8rem',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ padding: '0 0.8rem 0.8rem 0.8rem', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
          Navigation Menu
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(229, 184, 105, 0.4)' : '1px solid transparent',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(229, 184, 105, 0.15) 0%, rgba(229, 184, 105, 0.03) 100%)' 
                  : item.highlight ? 'rgba(229, 184, 105, 0.06)' : 'transparent',
                color: isActive ? '#f5d78a' : item.highlight ? '#e5b869' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#f5d78a' : item.highlight ? '#e5b869' : '#64748b'} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge !== null && (
                <span className={item.isAlert ? "badge badge-overdue" : "badge badge-gold"} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}

              {isActive && <ChevronRight size={14} color="#f5d78a" />}
            </button>
          );
        })}
      </div>

      {/* Vault Status Box */}
      <div className="glass-card" style={{ padding: '1rem', marginTop: '1.5rem', background: 'rgba(15, 23, 42, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          <ShieldCheck size={16} /> Vault Security Active
        </div>
        <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: '1.3' }}>
          Local encrypted storage. Pledged items photos & documents secured.
        </p>
      </div>
    </aside>
  );
};
