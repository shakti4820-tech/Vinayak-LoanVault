import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export const LoadingScreen = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadingOut(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#07090e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fadingOut ? 'none' : 'all'
      }}
    >
      {/* Background Ambient Red & Blue Orbs */}
      <div 
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
          top: '25%',
          right: '25%',
          animation: 'orbFloat1 10s ease-in-out infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '25%',
          left: '25%',
          animation: 'orbFloat2 12s ease-in-out infinite'
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem' }}>
        {/* Animated Brand Logo */}
        <div className="logo-intro-animation">
          <BrandLogo variant="full" size="xl" enableParallax={false} enableFloat={false} />
        </div>

        {/* Company Title & Subtitle */}
        <div style={{ marginTop: '1.8rem' }}>
          <h1 
            className="font-cinzel"
            style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800, 
              letterSpacing: '2px', 
              color: '#f8fafc',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
              textShadow: '0 0 20px rgba(225,29,72,0.3)'
            }}
          >
            VINAYAK BENEFIT NIDHI LTD.
          </h1>
          <p style={{ color: '#e5b869', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 600 }}>
            GOLD & SILVER LOAN MANAGEMENT SYSTEM
          </p>
        </div>

        {/* Premium Progress Bar */}
        <div 
          style={{
            width: '240px',
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            margin: '2rem auto 0 auto',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #dc2626 0%, #e5b869 50%, #2563eb 100%)',
              borderRadius: '10px',
              animation: 'loadingProgress 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          />
        </div>

        <div style={{ marginTop: '0.8rem', fontSize: '0.72rem', color: '#64748b', letterSpacing: '1px' }}>
          Initializing Encrypted Vault & Market Rates...
        </div>
      </div>
    </div>
  );
};
