import React, { useState, useRef } from 'react';
import officialLogoFull from '../assets/official_logo_full.png';
import officialLogoEmblem from '../assets/official_logo_emblem.jpg';

export const BrandLogo = ({ 
  variant = 'full', // 'full' | 'emblem'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  enableParallax = true,
  enableFloat = true,
  enableSweep = true,
  onClick
}) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [isHovered, setIsHovered] = useState(false);
  const logoRef = useRef(null);

  const logoSrc = variant === 'emblem' ? officialLogoEmblem : officialLogoFull;

  // Size mappings
  const dimensions = {
    sm: { height: '38px', width: 'auto', maxW: '170px' },
    md: { height: '48px', width: 'auto', maxW: '220px' },
    lg: { height: '70px', width: 'auto', maxW: '320px' },
    xl: { height: '110px', width: 'auto', maxW: '450px' }
  }[size] || { height: '48px', width: 'auto', maxW: '220px' };

  // Mouse Parallax effect
  const handleMouseMove = (e) => {
    if (!enableParallax || !logoRef.current) return;
    
    // Disable on mobile/touch screens
    if (window.innerWidth <= 768 || !window.matchMedia('(hover: hover)').matches) return;

    const rect = logoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;  // Max 12 deg tilt

    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      ref={logoRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`brand-logo-wrapper ${enableFloat ? 'floating-logo' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transform: transform,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        userSelect: 'none'
      }}
    >
      {/* Background Dual Ambient Glows (Red & Deep Blue) */}
      <div 
        className="brand-logo-glow-red"
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '70%',
          height: '130%',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, transparent 70%)',
          filter: 'blur(12px)',
          opacity: isHovered ? 0.9 : 0.5,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          borderRadius: '50%'
        }}
      />
      <div 
        className="brand-logo-glow-blue"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '70%',
          height: '130%',
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.45) 0%, transparent 70%)',
          filter: 'blur(14px)',
          opacity: isHovered ? 0.9 : 0.6,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          borderRadius: '50%'
        }}
      />

      {/* Actual Logo Image */}
      <img
        src={logoSrc}
        alt="VINAYAK BENEFIT NIDHI LTD."
        className="official-logo-img"
        style={{
          height: dimensions.height,
          width: dimensions.width,
          maxWidth: dimensions.maxW,
          objectFit: 'contain',
          display: 'block',
          position: 'relative',
          zIndex: 2,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(225,29,72,0.25)) drop-shadow(0 0 12px rgba(30,58,138,0.3))',
          borderRadius: variant === 'emblem' ? '50%' : '4px'
        }}
      />

      {/* Metallic Glossy Diagonal Light Sweep Sheen */}
      {enableSweep && (
        <div 
          className="logo-light-sweep"
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '60%',
            height: '100%',
            background: 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 50%, transparent 80%)',
            transform: 'skewX(-25deg)',
            pointerEvents: 'none',
            zIndex: 3,
            animation: 'logoSweepAnimation 7s cubic-bezier(0.4, 0, 0.2, 1) infinite'
          }}
        />
      )}

      {/* Glass Reflection beneath */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-12px',
          left: '10%',
          width: '80%',
          height: '10px',
          background: 'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.25) 0%, rgba(30, 58, 138, 0.2) 50%, transparent 80%)',
          filter: 'blur(6px)',
          opacity: 0.6,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
