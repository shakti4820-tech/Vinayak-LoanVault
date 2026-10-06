import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RefreshCw, ShieldCheck, Tag } from 'lucide-react';

export const ImageViewerModal = ({ isOpen, onClose, loan }) => {
  const [selectedPhotoKey, setSelectedPhotoKey] = useState('front');
  const [zoomScale, setZoomScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !loan) return null;

  const photoKeys = [
    { id: 'front', label: 'Front View 📸' },
    { id: 'back', label: 'Back View 📷' },
    { id: 'hallmark', label: 'Hallmark Stamp 🔍' },
    { id: 'scale', label: 'Weight Machine ⚖️' }
  ];

  const currentPhotoUrl = loan.photos?.[selectedPhotoKey] || loan.photos?.front;

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.3, 0.8));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoomScale(1);
    setRotation(0);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2200,
      padding: '1rem'
    }}>
      <div className="glass-card stagger-card" style={{
        width: '100%',
        maxWidth: '900px',
        background: '#0d0f17',
        border: '1px solid rgba(225, 29, 72, 0.35)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(30,58,138,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '4px' }}>
              <Tag size={12} /> Vault Asset ID: {loan.id}
            </div>
            <h3 className="gold-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {loan.itemName} ({loan.purity})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Owner: {loan.customerName} • Gross Weight: {loan.grossWeight}g • Sanctioned Loan: ₹{loan.loanAmount?.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={handleZoomIn} className="btn-secondary" title="Zoom In" style={{ padding: '0.45rem' }}>
              <ZoomIn size={16} />
            </button>
            <button onClick={handleZoomOut} className="btn-secondary" title="Zoom Out" style={{ padding: '0.45rem' }}>
              <ZoomOut size={16} />
            </button>
            <button onClick={handleRotate} className="btn-secondary" title="Rotate Image" style={{ padding: '0.45rem' }}>
              <RotateCw size={16} />
            </button>
            <button onClick={handleReset} className="btn-secondary" title="Reset View" style={{ padding: '0.45rem' }}>
              <RefreshCw size={16} />
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '0.45rem', marginLeft: '0.5rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Photo Viewport Container */}
        <div 
          className="pledged-item-frame"
          style={{
            width: '100%',
            height: '420px',
            background: '#05070c',
            borderRadius: '14px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(229,184,105,0.3)',
            position: 'relative'
          }}
        >
          <img 
            src={currentPhotoUrl} 
            alt="Pledged Asset" 
            style={{ 
              maxWidth: '92%', 
              maxHeight: '92%', 
              objectFit: 'contain',
              transform: `scale(${zoomScale}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))'
            }} 
          />

          {/* Verification Badge Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            background: 'rgba(7, 9, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: '#f5d78a',
            border: '1px solid rgba(229, 184, 105, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
          }}>
            <ShieldCheck size={16} color="#10b981" /> Verified Gold Vault Asset
          </div>
        </div>

        {/* Multi-photo Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
          {photoKeys.map(pk => (
            <button
              key={pk.id}
              onClick={() => {
                setSelectedPhotoKey(pk.id);
                handleReset();
              }}
              className={selectedPhotoKey === pk.id ? 'btn-gold' : 'btn-secondary'}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              {pk.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
