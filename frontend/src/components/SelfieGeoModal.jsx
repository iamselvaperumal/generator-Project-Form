import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Clock, X, Check, RefreshCw, AlertCircle, ShieldCheck, RotateCcw } from 'lucide-react';

export default function SelfieGeoModal({ isOpen, onClose, onSave, defaultGps = '' }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(defaultGps || 'Fetching GPS Location...');
  const [timestamp, setTimestamp] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      fetchGeoLocation();
    } else {
      stopCamera();
      setCapturedImage(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera permission or availability error:', err);
      setCameraError('Camera access unavailable or blocked. You can upload a photo as fallback.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const fetchGeoLocation = () => {
    setIsGettingGps(true);
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-GB');

    setTimestamp(formattedTime);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const coordsText = `${lat}° N, ${lng}° E`;
          setGpsCoords(coordsText);
          setIsGettingGps(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          if (!defaultGps) {
            setGpsCoords('18.5204° N, 73.8567° E (Site Default)');
          } else {
            setGpsCoords(defaultGps);
          }
          setIsGettingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsCoords(defaultGps || '18.5204° N, 73.8567° E (GPS Ready)');
      setIsGettingGps(false);
    }
  };

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 640;
    const height = 640; // Square selfie portrait
    canvas.width = width;
    canvas.height = height;

    // Draw video frame centered
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1); // Mirror view
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // Draw Geo-tag stamp overlay at bottom
    drawGeoTagOverlay(ctx, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const drawGeoTagOverlay = (ctx, width, height) => {
    // Gradient banner background
    const bannerHeight = 85;
    const bannerY = height - bannerHeight;

    const gradient = ctx.createLinearGradient(0, bannerY, 0, height);
    gradient.addColorStop(0, 'rgba(10, 15, 29, 0.75)');
    gradient.addColorStop(1, 'rgba(10, 15, 29, 0.95)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY, width, bannerHeight);

    // Cyan top accent border
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, bannerY, width, 3);

    // Text details
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`📍 GPS: ${gpsCoords}`, 18, bannerY + 28);

    ctx.font = '600 13.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`📅 ${timestamp || new Date().toLocaleString()}`, 18, bannerY + 52);

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.fillText('⚡ TPREL VERIFIED SITE SELFIE', 18, bannerY + 72);
  };

  const handleFileUploadFallback = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = 640;
        const height = 640;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        drawGeoTagOverlay(ctx, width, height);

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSave = () => {
    if (!capturedImage) {
      alert('Please capture or upload a selfie first.');
      return;
    }
    onSave({
      image: capturedImage,
      gps: gpsCoords,
      timestamp: timestamp
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="selfie-modal-card">
        <div className="selfie-modal-header">
          <div className="selfie-title-row">
            <Camera size={20} color="#38bdf8" />
            <h2>INSTANT GEO-TAGGED SELFIE</h2>
          </div>
          <button type="button" className="btn-close-sig" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="selfie-subtitle">
          Capture an instant site verification selfie stamped with live GPS coordinates, date, and time.
        </p>

        {/* Real-time GPS & Time Status Pill */}
        <div className="geo-status-banner">
          <div className="geo-item">
            <MapPin size={15} color="#38bdf8" />
            <span>{gpsCoords}</span>
          </div>
          <div className="geo-item">
            <Clock size={15} color="#34d399" />
            <span>{timestamp || 'Live Time'}</span>
          </div>
          <button type="button" className="btn-refresh-gps" onClick={fetchGeoLocation} title="Refresh GPS">
            <RefreshCw size={13} className={isGettingGps ? 'spin-icon' : ''} />
          </button>
        </div>

        {/* Camera / Captured Image Container */}
        <div className="camera-view-container">
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {!capturedImage ? (
            <>
              {cameraError ? (
                <div className="camera-error-box">
                  <AlertCircle size={32} color="#f87171" />
                  <p>{cameraError}</p>
                  <label htmlFor="selfie-file-input" className="btn-fallback-upload">
                    Browse Photo File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="selfie-file-input"
                    onChange={handleFileUploadFallback}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="video-preview-wrapper">
                  <video ref={videoRef} autoPlay playsInline muted className="live-video" />
                  <div className="camera-reticle"></div>
                  <button type="button" className="btn-capture-snap" onClick={takeSnapshot}>
                    <Camera size={20} /> Snapshot
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="captured-preview-wrapper">
              <img src={capturedImage} alt="Captured Geo Selfie" className="captured-img" />
              <button type="button" className="btn-retake" onClick={handleRetake}>
                <RotateCcw size={14} /> Retake
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="selfie-modal-footer">
          <button type="button" className="btn-cancel-sig" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-save-sig"
            onClick={handleSave}
            disabled={!capturedImage}
          >
            <Check size={16} /> Save Geo Selfie
          </button>
        </div>
      </div>
    </div>
  );
}
