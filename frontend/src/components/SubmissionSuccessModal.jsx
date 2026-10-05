import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Search, Printer, ArrowRight } from 'lucide-react';

export default function SubmissionSuccessModal({
  applicationId,
  isOpen,
  onClose,
  onTrackStatus,
  onPrintCertificate
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop no-print">
      <div className="modal-card success-card" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', padding: '10px 0 16px 0' }}>
          <div className="success-icon-wrap">
            <CheckCircle2 size={54} color="#16a34a" />
          </div>
          <h2 style={{ margin: '12px 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#111827' }}>
            Application Submitted Successfully
          </h2>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4b5563' }}>
            Your Installation & Commissioning Certificate has been recorded.
          </p>

          <div className="app-id-banner">
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#1b69b3', fontWeight: 600 }}>
              Application ID
            </div>
            <div className="app-id-text">{applicationId}</div>
            <button
              type="button"
              className="btn-copy-id"
              onClick={handleCopy}
              title="Copy Application ID"
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          <p style={{ margin: '14px 0 20px 0', fontSize: '13px', color: '#b45309', background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', fontWeight: 500 }}>
            📌 <strong>Please save this Application ID</strong> for future reference and to check your application approval status.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => {
                onClose();
                onTrackStatus(applicationId);
              }}
            >
              <Search size={18} />
              <span>Track Application Status</span>
              <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
            </button>

            <button
              type="button"
              className="btn-outline-action"
              onClick={() => {
                onClose();
                onPrintCertificate();
              }}
            >
              <Printer size={18} />
              <span>Print / Download Certificate PDF</span>
            </button>

            <button
              type="button"
              className="btn-text-action"
              onClick={onClose}
              style={{ marginTop: '4px' }}
            >
              Close and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
