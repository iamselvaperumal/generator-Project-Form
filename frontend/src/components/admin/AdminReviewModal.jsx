import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Download,
  Printer,
  ShieldCheck,
  AlertCircle,
  Paperclip,
  Send
} from 'lucide-react';
import Page1 from '../Page1';
import Page2 from '../Page2';
import Page3 from '../Page3';
import '../../admin.css';

export default function AdminReviewModal({
  application,
  onClose,
  onStatusUpdated,
  onPrintCertificate
}) {
  const [activeTab, setActiveTab] = useState('formDetails'); // 'formDetails' | 'annexure1' | 'annexure2' | 'uploadedFiles'
  const [selectedStatus, setSelectedStatus] = useState(application?.status || 'Approved');
  const [remarks, setRemarks] = useState(
    application?.remarks ||
      (application?.status === 'Approved'
        ? 'Application verified and approved. Certificate formally commissioned.'
        : application?.status === 'Reassigned'
        ? 'Please correct serial numbers in Annexure-1 and re-verify voltage readings.'
        : 'Application submitted for technical verification.')
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!application) return null;

  const formData = application.formData || {};
  const uploadedFiles = application.uploadedFiles || [];

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Remarks are mandatory when updating status.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/applications/${application.applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          remarks: remarks.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Status successfully updated to "${selectedStatus}"!`);
        setTimeout(() => {
          onStatusUpdated(data.application);
        }, 800);
      } else {
        // Fallback update in local state
        fallbackLocalUpdate();
      }
    } catch (err) {
      console.warn('API error, saving to local applications:', err);
      fallbackLocalUpdate();
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackLocalUpdate = () => {
    const updatedApp = {
      ...application,
      status: selectedStatus,
      remarks: remarks.trim(),
      updatedAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('tpre_all_applications');
      if (stored) {
        const list = JSON.parse(stored);
        const idx = list.findIndex(a => a.applicationId === application.applicationId);
        if (idx !== -1) {
          list[idx] = updatedApp;
          localStorage.setItem('tpre_all_applications', JSON.stringify(list));
        }
      }
    } catch (e) {
      // ignore
    }

    setSuccessMsg(`Status successfully updated to "${selectedStatus}"!`);
    setTimeout(() => {
      onStatusUpdated(updatedApp);
    }, 800);
  };

  return (
    <div className="admin-review-overlay">
      <div className="admin-review-modal">
        {/* Modal Top Bar */}
        <div className="admin-modal-header">
          <div className="header-info">
            <span className="modal-app-id">{application.applicationId}</span>
            <span className="modal-customer-name">
              {formData.customerName || 'Customer Application'}
            </span>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn-print-admin-doc"
              onClick={() => onPrintCertificate(formData)}
            >
              <Printer size={16} />
              <span>Download / View PDF</span>
            </button>
            <button type="button" className="btn-close-modal" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Grid: Left Review Tabs (Step 3) + Right Update Panel (Step 4) */}
        <div className="admin-review-grid">
          {/* Left Column: Review Application (Step 3) */}
          <div className="review-left-column">
            <div className="review-tabs-bar">
              <button
                type="button"
                className={`review-tab ${activeTab === 'formDetails' ? 'active' : ''}`}
                onClick={() => setActiveTab('formDetails')}
              >
                <FileText size={16} />
                <span>Form Details</span>
              </button>
              <button
                type="button"
                className={`review-tab ${activeTab === 'annexure1' ? 'active' : ''}`}
                onClick={() => setActiveTab('annexure1')}
              >
                <FileSpreadsheet size={16} />
                <span>Annexure 1</span>
              </button>
              <button
                type="button"
                className={`review-tab ${activeTab === 'annexure2' ? 'active' : ''}`}
                onClick={() => setActiveTab('annexure2')}
              >
                <FileCheck size={16} />
                <span>Annexure 2</span>
              </button>
              <button
                type="button"
                className={`review-tab ${activeTab === 'uploadedFiles' ? 'active' : ''}`}
                onClick={() => setActiveTab('uploadedFiles')}
              >
                <Paperclip size={16} />
                <span>Uploaded Files ({uploadedFiles.length})</span>
              </button>
            </div>

            {/* Tab Contents View */}
            <div className="review-tab-content">
              {activeTab === 'formDetails' && (
                <div className="document-preview-wrapper">
                  <Page1 formData={formData} onChange={() => {}} readOnly={true} />
                </div>
              )}

              {activeTab === 'annexure1' && (
                <div className="document-preview-wrapper">
                  <Page2 formData={formData} onChange={() => {}} readOnly={true} />
                </div>
              )}

              {activeTab === 'annexure2' && (
                <div className="document-preview-wrapper">
                  <Page3 formData={formData} onChange={() => {}} readOnly={true} />
                </div>
              )}

              {activeTab === 'uploadedFiles' && (
                <div className="uploaded-files-panel">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    Attached Supporting Documents & Drawings
                  </h4>
                  {uploadedFiles.length > 0 ? (
                    <div className="files-grid">
                      {uploadedFiles.map((file, idx) => (
                        <div key={file.id || idx} className="file-item-card">
                          <div className="file-icon-box">
                            <FileText size={24} color="#1b69b3" />
                          </div>
                          <div className="file-meta">
                            <span className="file-name">{file.originalName || file.filename}</span>
                            <span className="file-size">
                              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Attached Document'}
                            </span>
                          </div>
                          <a
                            href={file.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-download-file"
                            title="Download Attachment"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-files-box">
                      <Paperclip size={32} color="#94a3b8" />
                      <p>No supporting drawings or files were attached with this application.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Update Application Status Form (Step 4) */}
          <div className="review-right-column">
            <div className="update-status-card">
              <div className="update-card-header">
                <div className="step-badge">Step 4</div>
                <h3 className="update-title">Update Status</h3>
                <p className="update-subtitle">Approve, Reject or Reassign with remarks</p>
              </div>

              {error && (
                <div className="admin-alert admin-alert-error" style={{ marginBottom: '12px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '12px' }}>
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateStatus} className="update-status-form">
                {/* Status Selection Radio Cards */}
                <div className="status-options-grid">
                  {/* Approve Option */}
                  <label
                    className={`status-option-card option-approve ${
                      selectedStatus === 'Approved' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Approved"
                      checked={selectedStatus === 'Approved'}
                      onChange={() => {
                        setSelectedStatus('Approved');
                        setRemarks('All installation parameters verified and approved. Certificate formally commissioned.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <CheckCircle2 size={18} className="option-icon" />
                        <span className="option-label">Approve</span>
                      </div>
                      <p className="option-desc">
                        Generate PDF with complete data and attachments. End user can download PDF.
                      </p>
                    </div>
                  </label>

                  {/* Reject Option */}
                  <label
                    className={`status-option-card option-reject ${
                      selectedStatus === 'Rejected' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Rejected"
                      checked={selectedStatus === 'Rejected'}
                      onChange={() => {
                        setSelectedStatus('Rejected');
                        setRemarks('Installation parameters fail Tata Power safety standards. Disapproved.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <XCircle size={18} className="option-icon" />
                        <span className="option-label">Reject</span>
                      </div>
                      <p className="option-desc">
                        Add rejection remarks. Application closed.
                      </p>
                    </div>
                  </label>

                  {/* Reassign for Correction Option */}
                  <label
                    className={`status-option-card option-reassign ${
                      selectedStatus === 'Reassigned' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Reassigned"
                      checked={selectedStatus === 'Reassigned'}
                      onChange={() => {
                        setSelectedStatus('Reassigned');
                        setRemarks('Please update the Solar PCU serial numbers in Annexure-1 and re-check Input Voltage readings in Annexure-2.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <RotateCcw size={18} className="option-icon" />
                        <span className="option-label">Reassign for Correction</span>
                      </div>
                      <p className="option-desc">
                        Add remarks and send back to end user for edit & resubmit.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Mandatory Remarks Textarea */}
                <div className="admin-input-group" style={{ marginTop: '16px' }}>
                  <label className="admin-label">
                    Remarks <span>(Mandatory)</span>
                  </label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    placeholder="Enter review remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                {/* Submit Update Button */}
                <button type="submit" className="btn-update-status" disabled={submitting}>
                  <Send size={18} />
                  <span>{submitting ? 'Updating Status...' : 'Update Status'}</span>
                </button>
              </form>

              {/* Status Outcome Banner */}
              <div className="status-outcome-preview">
                {selectedStatus === 'Approved' && (
                  <div className="outcome-banner banner-approve">
                    <ShieldCheck size={20} />
                    <span><strong>Outcome:</strong> Approved PDF unlocked for End User. Admin can view/download PDF.</span>
                  </div>
                )}
                {selectedStatus === 'Rejected' && (
                  <div className="outcome-banner banner-reject">
                    <XCircle size={20} />
                    <span><strong>Outcome:</strong> Application closed with rejection remarks.</span>
                  </div>
                )}
                {selectedStatus === 'Reassigned' && (
                  <div className="outcome-banner banner-reassign">
                    <RotateCcw size={20} />
                    <span><strong>Outcome:</strong> Reassigned back to End User to edit & resubmit.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
