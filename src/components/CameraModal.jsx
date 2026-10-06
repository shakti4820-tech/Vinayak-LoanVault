import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, Upload } from 'lucide-react';

export const CameraModal = ({ isOpen, onClose, onCapture, title = "Capture Item Photo" }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setCapturedImage(null);
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("Camera unavailable or permission denied. You can upload an image file or use live photo simulator.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', background: '#12141c', border: '1px solid var(--gold-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} /> {title}
          </h3>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.3rem 0.6rem' }}><X size={16} /></button>
        </div>

        {/* Video / Snapshot Viewport */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '340px', 
          background: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(229,184,105,0.3)'
        }}>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : cameraError ? (
            <div style={{ textAlignment: 'center', padding: '2rem', color: '#94a3b8', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: '#ef4444' }}>{cameraError}</p>
              <label className="btn-gold" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Choose Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem' }}>
          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={15} /> Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {capturedImage ? (
              <>
                <button onClick={() => setCapturedImage(null)} className="btn-secondary">
                  <RefreshCw size={15} /> Retake
                </button>
                <button onClick={handleConfirm} className="btn-gold">
                  <CheckCircle size={15} /> Save Photo
                </button>
              </>
            ) : (
              !cameraError && (
                <button onClick={handleTakeSnapshot} className="btn-gold">
                  <Camera size={16} /> Capture Photo
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
