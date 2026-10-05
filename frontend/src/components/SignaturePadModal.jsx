import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Type as TypeIcon, Upload as UploadIcon, X, Check, Trash2, RotateCcw } from 'lucide-react';

export default function SignaturePadModal({ isOpen, onClose, onSave, initialSignature = '' }) {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' | 'type' | 'upload'
  const [penColor, setPenColor] = useState('#1b69b3');
  const [penSize, setPenSize] = useState(3);
  const [typedName, setTypedName] = useState('');
  const [typedFont, setTypedFont] = useState('Dancing Script');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef(null);

  // Colors matching screenshot
  const colors = [
    { label: 'Royal Blue', value: '#1b69b3' },
    { label: 'Bright Blue', value: '#2563eb' },
    { label: 'Dark Charcoal', value: '#111827' },
    { label: 'Purple Accent', value: '#9333ea' }
  ];

  const sizes = [
    { label: 'S', value: 2 },
    { label: 'M', value: 4 },
    { label: 'L', value: 6 }
  ];

  const fonts = [
    { name: 'Dancing Script', fontFamily: "'Dancing Script', cursive" },
    { name: 'Great Vibes', fontFamily: "'Great Vibes', cursive" },
    { name: 'Pacifico', fontFamily: "'Pacifico', cursive" },
    { name: 'Sacramento', fontFamily: "'Sacramento', cursive" }
  ];

  useEffect(() => {
    if (isOpen && activeTab === 'draw') {
      setTimeout(initCanvas, 100);
    }
  }, [isOpen, activeTab]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set actual resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / 2;
    const height = canvas.height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw baseline guide
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, height - 35);
    ctx.lineTo(width - 40, height - 35);
    ctx.stroke();

    // Draw "SIGN ABOVE THIS LINE" text
    ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('SIGN ABOVE THIS LINE', width / 2, height - 16);
  };

  // Drawing event handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Generate typed signature image data URL
  const generateTypedSignatureImage = () => {
    if (!typedName.trim()) return null;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 200;
    const ctx = tempCanvas.getContext('2d');

    ctx.clearRect(0, 0, 600, 200);
    ctx.font = `60px ${typedFont}, cursive`;
    ctx.fillStyle = penColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName.trim(), 300, 90);

    // Baseline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 150);
    ctx.lineTo(540, 150);
    ctx.stroke();

    return tempCanvas.toDataURL('image/png');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSignature = () => {
    let signatureDataUrl = null;

    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signatureDataUrl = canvas.toDataURL('image/png');
      }
    } else if (activeTab === 'type') {
      signatureDataUrl = generateTypedSignatureImage();
    } else if (activeTab === 'upload') {
      signatureDataUrl = uploadedImage;
    }

    if (!signatureDataUrl) {
      alert('Please provide a signature before saving.');
      return;
    }

    onSave(signatureDataUrl, activeTab);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="signature-modal-card">
        {/* Header */}
        <div className="sig-modal-header">
          <div className="sig-title-row">
            <span className="sig-accent-bar"></span>
            <h2>DIGITAL SIGNATURE</h2>
          </div>
          <button type="button" className="btn-close-sig" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="sig-subtitle">
          Provide your digital signature to authenticate this application. Choose to draw, type, or upload your signature below.
        </p>

        {/* Navigation Tabs */}
        <div className="sig-tabs">
          <button
            type="button"
            className={`sig-tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            <PenTool size={15} />
            <span>Draw</span>
          </button>
          <button
            type="button"
            className={`sig-tab-btn ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            <TypeIcon size={15} />
            <span>Type</span>
          </button>
          <button
            type="button"
            className={`sig-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <UploadIcon size={15} />
            <span>Upload</span>
          </button>
        </div>

        {/* Tab 1: Draw Canvas View */}
        {activeTab === 'draw' && (
          <div className="sig-body-draw">
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="sig-canvas"
              />
            </div>

            {/* Controls Bar */}
            <div className="canvas-controls-bar">
              <div className="control-group">
                <span className="control-label">Colour:</span>
                <div className="color-options">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`color-dot ${penColor === c.value ? 'selected' : ''}`}
                      style={{ backgroundColor: c.value }}
                      onClick={() => setPenColor(c.value)}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="control-group">
                <span className="control-label">Size:</span>
                <div className="size-options">
                  {sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      className={`size-btn ${penSize === s.value ? 'selected' : ''}`}
                      onClick={() => setPenSize(s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className="btn-clear-canvas" onClick={clearCanvas}>
                <X size={14} /> Clear
              </button>
            </div>

            <div className="sig-footer-hint">
              <span className="blue-dot">●</span> Draw your signature above — pen strokes will be captured cleanly
            </div>
          </div>
        )}

        {/* Tab 2: Type Signature View */}
        {activeTab === 'type' && (
          <div className="sig-body-type">
            <div className="type-input-group">
              <label className="type-label">TYPE YOUR FULL NAME:</label>
              <input
                type="text"
                className="type-text-input"
                placeholder="e.g. Rajesh V. Sharma"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
              />
            </div>

            <div className="font-selector-row">
              <label className="type-label">CHOOSE CURSIVE FONT:</label>
              <div className="font-pills">
                {fonts.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    className={`font-pill ${typedFont === f.name ? 'selected' : ''}`}
                    onClick={() => setTypedFont(f.name)}
                    style={{ fontFamily: f.fontFamily }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Typed Preview */}
            <div className="typed-preview-box">
              <div
                className="typed-preview-text"
                style={{ fontFamily: fonts.find(f => f.name === typedFont)?.fontFamily, color: penColor }}
              >
                {typedName.trim() || 'Your Signature Here'}
              </div>
              <div className="preview-baseline"></div>
              <span className="baseline-text">SIGN ABOVE THIS LINE</span>
            </div>
          </div>
        )}

        {/* Tab 3: Upload Signature View */}
        {activeTab === 'upload' && (
          <div className="sig-body-upload">
            <div className="sig-upload-dropzone">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                id="sig-file-input"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="sig-file-input" className="upload-drop-label">
                <UploadIcon size={36} color="#38bdf8" />
                <span>Click to browse signature image (PNG / JPG)</span>
                <small>High resolution black or blue ink signature on white background works best</small>
              </label>
            </div>

            {uploadedImage && (
              <div className="uploaded-sig-preview">
                <span className="preview-tag">UPLOADED SIGNATURE PREVIEW</span>
                <img src={uploadedImage} alt="Uploaded Signature" />
              </div>
            )}
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="sig-modal-footer">
          <button type="button" className="btn-cancel-sig" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-save-sig" onClick={handleSaveSignature}>
            <Check size={16} /> Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}
