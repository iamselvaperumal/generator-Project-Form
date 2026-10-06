import React, { useState, useEffect, useCallback } from 'react';
import { Download, Printer, X, FileText, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState(0.85); // Default 85% scale for desktop
  const [activePageTab, setActivePageTab] = useState('all'); // 'all' | '1' | '2' | '3' | '4'

  // Standard A4 dimensions in pixels @ 96 DPI (210mm x 297mm)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  // Calculate fit-to-screen scale for mobile screens
  const calculateFitZoom = useCallback(() => {
    if (typeof window === 'undefined') return 0.85;
    const windowWidth = window.innerWidth;
    if (windowWidth <= 768) {
      // 16px total padding (8px on left, 8px on right)
      const availableWidth = Math.max(280, windowWidth - 16);
      const fitScale = Math.min(0.85, Math.max(0.2, availableWidth / A4_WIDTH_PX));
      return Number(fitScale.toFixed(3));
    }
    return 0.85;
  }, []);

  // Auto-set initial zoom on open or window resize
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(calculateFitZoom());

      const handleResize = () => {
        setZoomLevel(calculateFitZoom());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isOpen, calculateFitZoom]);

  if (!isOpen) return null;

  const handleResetFit = () => {
    setZoomLevel(calculateFitZoom());
  };

  const scaledWidth = Math.round(A4_WIDTH_PX * zoomLevel);
  const scaledHeight = Math.round(A4_HEIGHT_PX * zoomLevel);

  const renderScaledPage = (PageComponent, pageId) => (
    <div
      key={pageId}
      className="preview-page-container"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      <div
        style={{
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <PageComponent formData={formData} onChange={() => {}} readOnly={true} />
      </div>
    </div>
  );

  return (
    <div className="pdf-preview-backdrop no-print">
      <div className="pdf-preview-window">
        {/* Header Bar */}
        <div className="pdf-preview-topbar">
          <div className="pdf-topbar-brand">
            <div className="dev-tag">DEV / TEST MODE</div>
            <div className="pdf-title-group">
              <FileText size={16} color="#38bdf8" />
              <span className="pdf-title-text">
                Actual Fixed Layout PDF Preview (4 Pages)
              </span>
            </div>
          </div>

          {/* Controls (Page switcher & Zoom) */}
          <div className="pdf-topbar-controls">
            <div className="page-switcher-pills">
              <button
                type="button"
                className={`page-pill ${activePageTab === 'all' ? 'active' : ''}`}
                onClick={() => setActivePageTab('all')}
              >
                <span className="pill-full">All 4 Pages</span>
                <span className="pill-short">All</span>
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '1' ? 'active' : ''}`}
                onClick={() => setActivePageTab('1')}
              >
                <span className="pill-full">Page 1</span>
                <span className="pill-short">P1</span>
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '2' ? 'active' : ''}`}
                onClick={() => setActivePageTab('2')}
              >
                <span className="pill-full">Page 2 (Annexure-1)</span>
                <span className="pill-short">P2</span>
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '3' ? 'active' : ''}`}
                onClick={() => setActivePageTab('3')}
              >
                <span className="pill-full">Page 3 (Annexure-2)</span>
                <span className="pill-short">P3</span>
              </button>
              <button
                type="button"
                className={`page-pill ${activePageTab === '4' ? 'active' : ''}`}
                onClick={() => setActivePageTab('4')}
              >
                <span className="pill-full">Page 4 (Site Photo)</span>
                <span className="pill-short">P4</span>
              </button>
            </div>

            <div className="zoom-controls">
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.max(0.2, Number((z - 0.05).toFixed(3))))}
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="zoom-val-text">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.05).toFixed(3))))}
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                className="btn-zoom btn-zoom-fit"
                onClick={handleResetFit}
                title="Fit to Screen"
              >
                <Maximize2 size={12} style={{ marginRight: '2px' }} /> Fit
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="pdf-topbar-actions-desktop">
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
            </div>
          </div>

          {/* Close Button */}
          <button type="button" className="btn-modal-close" onClick={onClose} title="Close Preview">
            <X size={20} />
          </button>
        </div>

        {/* Info banner */}
        <div className="preview-info-banner">
          <span>
            ℹ️ <strong>Test & Development View:</strong> Fixed A4 layout matching <strong>"I & C(1).pdf"</strong>. Click <strong>"Download Fixed PDF"</strong> to save.
          </span>
        </div>

        {/* Document Scroll Canvas */}
        <div className="pdf-preview-scroll-area">
          <div id="pdf-preview-document" className="pdf-preview-scaled-wrap">
            {(activePageTab === 'all' || activePageTab === '1') && renderScaledPage(Page1, 'p1')}
            {(activePageTab === 'all' || activePageTab === '2') && renderScaledPage(Page2, 'p2')}
            {(activePageTab === 'all' || activePageTab === '3') && renderScaledPage(Page3, 'p3')}
            {(activePageTab === 'all' || activePageTab === '4') && renderScaledPage(Page4, 'p4')}
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="pdf-preview-mobile-actions">
          <button
            type="button"
            className="btn-modal-download btn-mobile-download"
            onClick={onDownloadPdf}
            disabled={downloading}
          >
            <Download size={18} />
            <span>{downloading ? 'Generating PDF...' : 'Download Fixed PDF (.pdf)'}</span>
          </button>

          <button
            type="button"
            className="btn-modal-print btn-mobile-print"
            onClick={onPrintPdf}
            title="Browser Vector Print / Save as PDF"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

