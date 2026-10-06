import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import { Lock, User, KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid Username or Password/PIN. (Default demo PIN is 1234)');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#07090e',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem'
    }}>
      {/* Background Ambient Red & Blue Glowing Orbs */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.22) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'orbFloat1 14s ease-in-out infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orbFloat2 18s ease-in-out infinite'
        }}
      />

      <div className="glass-card stagger-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.8rem 2.2rem',
        background: 'rgba(13, 15, 23, 0.88)',
        border: '1px solid rgba(225, 29, 72, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(30, 58, 138, 0.3), 0 0 20px rgba(225, 29, 72, 0.25)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        borderRadius: '20px'
      }}>
        {/* Company Official Logo with 3D Parallax & Sheen */}
        <div style={{ marginBottom: '1.8rem' }}>
          <BrandLogo variant="full" size="lg" enableParallax={true} enableFloat={true} />
        </div>

        <h2 className="font-cinzel gold-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '1px' }}>
          SECURE LOAN PORTAL
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>
          VINAYAK BENEFIT NIDHI LTD. • Gold & Silver Operations
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'left'
          }}>
            <ShieldAlert size={18} color="#ef4444" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Username / Mobile</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#e5b869" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username or Mobile"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password / Security PIN</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="#e5b869" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                className="form-control"
                placeholder="Enter PIN (Demo: 1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-gold" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              marginTop: '1.2rem', 
              padding: '0.9rem',
              fontSize: '0.9rem' 
            }}
          >
            <Lock size={16} /> Authenticate & Access Portal
          </button>
        </form>

        <div style={{ 
          marginTop: '2.2rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          fontSize: '0.75rem', 
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={14} color="#10b981" /> 256-Bit Encrypted Vault • Kuchaman Branch
        </div>
      </div>
    </div>
  );
};
