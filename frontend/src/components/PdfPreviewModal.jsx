import React, { useState } from 'react';
import { Download, Printer, X, Eye, FileText, CheckCircle2, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';

export default function PdfPreviewModal({
  isOpen,
  onClose,
  formData,
  onDownloadPdf,
  onPrintPdf,
  downloading = false
}) {
  const [zoomLevel, setZoomLevel] = useState(0.85); // Default comfortable 85% scale for desktop
  const [activePageTab, setActivePageTab] = useState('all'); // 'all' | '1' | '2' | '3' | '4'

  if (!isOpen) return null;

  return (
    <div className="pdf-preview-backdrop no-print">
      <div className="pdf-preview-window">
        {/* Header Bar */}
        <div className="pdf-preview-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="dev-tag">DEV / TEST MODE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={20} color="#38bdf8" />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Actual Fixed Layout PDF Preview (4 Pages)
              </span>
            </div>
          </div>

          {/* Quick Page Jump & Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="page-switcher-pills">
              <button
                type="button"
                className={`page-pill ${activePageTab === 'all' ? 'active' : ''}`}
                onClick={() => setActivePageTab('all')}
              >
                All 4 Pages
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '1' ? 'active' : ''}`}
                onClick={() => setActivePageTab('1')}
              >
                Page 1
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '2' ? 'active' : ''}`}
                onClick={() => setActivePageTab('2')}
              >
                Page 2 (Annexure-1)
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '3' ? 'active' : ''}`}
                onClick={() => setActivePageTab('3')}
              >
                Page 3 (Annexure-2)
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '4' ? 'active' : ''}`}
                onClick={() => setActivePageTab('4')}
              >
                Page 4 (Site Photo)
              </button>
            </div>

            <div className="zoom-controls">
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '12px', color: '#94a3b8', minWidth: '40px', textAlign: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Actions: Download & Print */}
            <button
              type="button"
              className="btn-modal-download"
              onClick={onDownloadPdf}
              disabled={downloading}
            >
              <Download size={16} />
              <span>{downloading ? 'Generating PDF...' : 'Download Fixed PDF (.pdf)'}</span>
            </button>

            <button
              type="button"
              className="btn-modal-print"
              onClick={onPrintPdf}
              title="Browser Vector Print / Save as PDF"
            >
              <Printer size={16} />
              <span>Print / Vector PDF</span>
            </button>

            <button type="button" className="btn-modal-close" onClick={onClose} title="Close Preview">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="preview-info-banner">
          <span>
            ℹ️ <strong>Test & Development View:</strong> This renders your filled data directly into the exact fixed A4 layout matching <strong>"I & C(1).pdf"</strong> without interactive web controls. Click <strong>"Download Fixed PDF"</strong> to save the generated PDF file directly.
          </span>
        </div>

        {/* Document Scroll Canvas */}
        <div className="pdf-preview-scroll-area">
          <div
            id="pdf-preview-document"
            className="pdf-preview-scaled-wrap"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {(activePageTab === 'all' || activePageTab === '1') && (
              <div className="preview-page-container">
                <Page1 formData={formData} onChange={() => {}} readOnly={true} />
              </div>
            )}

            {(activePageTab === 'all' || activePageTab === '2') && (
              <div className="preview-page-container">
                <Page2 formData={formData} onChange={() => {}} readOnly={true} />
              </div>
            )}

            {(activePageTab === 'all' || activePageTab === '3') && (
              <div className="preview-page-container">
                <Page3 formData={formData} onChange={() => {}} readOnly={true} />
              </div>
            )}

            {(activePageTab === 'all' || activePageTab === '4') && (
              <div className="preview-page-container">
                <Page4 formData={formData} onChange={() => {}} readOnly={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
