import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Clock, X, Check, RefreshCw, AlertCircle, Edit2, RotateCcw, Globe, Compass } from 'lucide-react';

export default function SelfieGeoModal({
  isOpen,
  onClose,
  onSave,
  defaultGps = '',
  plantLocation = ''
}) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(defaultGps || 'Detecting real-time location...');
  const [timestamp, setTimestamp] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsSource, setGpsSource] = useState('Detecting...');
  const [isEditingGps, setIsEditingGps] = useState(false);
  const [customGpsInput, setCustomGpsInput] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      fetchGeoLocation();
    } else {
      stopCamera();
      setCapturedImage(null);
      setIsEditingGps(false);
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
      setCameraError('Camera access unavailable or blocked. You can upload a photo file as fallback.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Helper to format latitude/longitude with accurate hemisphere directions
  const formatCoords = (lat, lng, city = '') => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return '';
    const latDir = latNum >= 0 ? 'N' : 'S';
    const lngDir = lngNum >= 0 ? 'E' : 'W';
    const base = `${Math.abs(latNum).toFixed(5)}° ${latDir}, ${Math.abs(lngNum).toFixed(5)}° ${lngDir}`;
    return city ? `${base} • ${city}` : base;
  };

  // Fallback to real IP geolocation if browser GPS fails or times out
  const fetchIpGeolocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const cityInfo = [data.city, data.region_code || data.region].filter(Boolean).join(', ');
          const formatted = formatCoords(data.latitude, data.longitude, cityInfo);
          setGpsCoords(formatted);
          setGpsSource('Network / IP Location');
          setIsGettingGps(false);
          return true;
        }
      }
    } catch (err) {
      console.warn('ipapi.co failed, trying ipwho.is:', err);
    }

    try {
      const res2 = await fetch('https://ipwho.is/');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.latitude && data2.longitude) {
          const cityInfo = [data2.city, data2.region_code || data2.region].filter(Boolean).join(', ');
          const formatted = formatCoords(data2.latitude, data2.longitude, cityInfo);
          setGpsCoords(formatted);
          setGpsSource('Network / IP Location');
          setIsGettingGps(false);
          return true;
        }
      }
    } catch (err2) {
      console.warn('ipwho.is failed:', err2);
    }

    return false;
  };

  const fetchGeoLocation = () => {
    setIsGettingGps(true);
    setGpsSource('Detecting...');

    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-GB');

    setTimestamp(formattedTime);

    if (!navigator.geolocation) {
      // Browser does not support geolocation, try IP fallback
      fetchIpGeolocation().then((success) => {
        if (!success) {
          if (defaultGps) {
            setGpsCoords(defaultGps);
            setGpsSource('Saved Form Location');
          } else {
            setGpsCoords('Location unavailable. Click Edit to enter.');
            setGpsSource('Manual Required');
          }
          setIsGettingGps(false);
        }
      });
      return;
    }

    // Step 1: Try high accuracy first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const formatted = formatCoords(lat, lng);
        setGpsCoords(formatted);
        setGpsSource('Device High-Accuracy GPS');
        setIsGettingGps(false);
      },
      (highAccErr) => {
        console.warn('High accuracy geolocation timed out/failed, trying standard accuracy:', highAccErr);

        // Step 2: Try standard accuracy with longer timeout and cache
        navigator.geolocation.getCurrentPosition(
          (stdPos) => {
            const lat = stdPos.coords.latitude;
            const lng = stdPos.coords.longitude;
            const formatted = formatCoords(lat, lng);
            setGpsCoords(formatted);
            setGpsSource('Device Location (Standard)');
            setIsGettingGps(false);
          },
          async (stdErr) => {
            console.warn('Standard geolocation failed, falling back to IP detection:', stdErr);

            // Step 3: Fallback to real IP geolocation service
            const ipSuccess = await fetchIpGeolocation();
            if (!ipSuccess) {
              if (defaultGps) {
                setGpsCoords(defaultGps);
                setGpsSource('Saved Form Location');
              } else if (plantLocation) {
                setGpsCoords(`Site: ${plantLocation}`);
                setGpsSource('Plant Address');
              } else {
                setGpsCoords('Location unavailable. Click ✏️ to enter.');
                setGpsSource('Manual Required');
              }
              setIsGettingGps(false);
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };

  const handleApplyCustomGps = () => {
    if (!customGpsInput.trim()) {
      alert('Please enter coordinates or site location.');
      return;
    }
    setGpsCoords(customGpsInput.trim());
    setGpsSource('Custom Verified');
    setIsEditingGps(false);
  };

  const handleUsePlantLocation = () => {
    if (!plantLocation && !defaultGps) {
      alert('No plant address or coordinates found in the form.');
      return;
    }
    const loc = defaultGps || plantLocation;
    setGpsCoords(loc);
    setGpsSource('Form Plant Address');
    setIsEditingGps(false);
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
    const bannerHeight = 88;
    const bannerY = height - bannerHeight;

    const gradient = ctx.createLinearGradient(0, bannerY, 0, height);
    gradient.addColorStop(0, 'rgba(10, 15, 29, 0.82)');
    gradient.addColorStop(1, 'rgba(10, 15, 29, 0.98)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY, width, bannerHeight);

    // Cyan top accent border
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, bannerY, width, 3);

    // Clean text details
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`📍 ${gpsCoords}`, 18, bannerY + 28);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`📅 ${timestamp || new Date().toLocaleString()}`, 18, bannerY + 52);

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`⚡ TPREL VERIFIED SITE PHOTO • ${gpsSource.toUpperCase()}`, 18, bannerY + 74);
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
          <div className="geo-item geo-item-coords" title={`Source: ${gpsSource}`}>
            <MapPin size={16} color="#38bdf8" />
            <div className="geo-text-wrap">
              <span className="geo-coords-val">{gpsCoords}</span>
              <span className="geo-source-tag">{gpsSource}</span>
            </div>
          </div>
          <div className="geo-item">
            <Clock size={15} color="#34d399" />
            <span>{timestamp || 'Live Time'}</span>
          </div>

          <div className="geo-actions-row">
            <button
              type="button"
              className="btn-edit-gps-pill"
              onClick={() => {
                setCustomGpsInput(gpsCoords);
                setIsEditingGps(!isEditingGps);
              }}
              title="Edit or adjust coordinates manually"
            >
              <Edit2 size={13} />
              <span>{isEditingGps ? 'Cancel' : 'Edit'}</span>
            </button>
            <button
              type="button"
              className="btn-refresh-gps"
              onClick={fetchGeoLocation}
              disabled={isGettingGps}
              title="Redetect real GPS location"
            >
              <RefreshCw size={14} className={isGettingGps ? 'spin-icon' : ''} />
            </button>
          </div>
        </div>

        {/* Manual Location Edit Drawer */}
        {isEditingGps && (
          <div className="geo-edit-drawer">
            <div className="geo-edit-title">
              <Compass size={14} />
              <span>Enter Exact Site Coordinates / Address:</span>
            </div>
            <div className="geo-edit-input-row">
              <input
                type="text"
                className="geo-custom-input"
                placeholder="e.g. 13.0827° N, 80.2707° E or Chennai Site"
                value={customGpsInput}
                onChange={(e) => setCustomGpsInput(e.target.value)}
              />
              <button
                type="button"
                className="btn-apply-custom-gps"
                onClick={handleApplyCustomGps}
              >
                Apply
              </button>
            </div>
            {(plantLocation || defaultGps) && (
              <div className="geo-quick-presets">
                <span className="preset-label">Quick Set:</span>
                <button
                  type="button"
                  className="btn-preset-chip"
                  onClick={handleUsePlantLocation}
                >
                  📍 Use Form Plant Address: {plantLocation || defaultGps}
                </button>
              </div>
            )}
          </div>
        )}

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
