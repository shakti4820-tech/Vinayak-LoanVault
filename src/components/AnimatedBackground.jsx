import React, { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles array (subtle gold, silver, red, blue particles)
    const particleCount = window.innerWidth <= 768 ? 15 : 30;
    const particles = [];

    const colors = [
      'rgba(229, 184, 105, 0.4)', // Gold
      'rgba(203, 213, 225, 0.35)', // Silver
      'rgba(225, 29, 72, 0.35)',  // Brand Red
      'rgba(37, 99, 235, 0.35)'   // Deep Blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15, // slight upward drift
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.005
      });
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulse alpha
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.7, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/, `${currentAlpha})`);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="animated-bg-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#07090e'
      }}
    >
      {/* Ambient Red Light Orb (Top Right) */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          maxHeight: '650px',
          maxWidth: '650px',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.14) 0%, rgba(153, 27, 27, 0.05) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orbFloat1 18s ease-in-out infinite alternate'
        }}
      />

      {/* Ambient Deep Blue Light Orb (Bottom Left) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          maxHeight: '700px',
          maxWidth: '700px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(15, 23, 42, 0.1) 50%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'orbFloat2 22s ease-in-out infinite alternate'
        }}
      />

      {/* Center Subtle Gold Warmth */}
      <div 
        style={{
          position: 'absolute',
          top: '35%',
          left: '40%',
          width: '35vw',
          height: '35vw',
          maxHeight: '400px',
          maxWidth: '400px',
          background: 'radial-gradient(circle, rgba(229, 184, 105, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orbFloat1 15s ease-in-out infinite alternate-reverse'
        }}
      />

      {/* Floating Particles Canvas */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};
