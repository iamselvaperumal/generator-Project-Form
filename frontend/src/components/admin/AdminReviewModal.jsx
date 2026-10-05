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
  Send,
  Lock,
  Camera
} from 'lucide-react';
import Page1 from '../Page1';
import Page2 from '../Page2';
import Page3 from '../Page3';
import Page4 from '../Page4';
import '../../admin.css';

export default function AdminReviewModal({
  application,
  onClose,
  onStatusUpdated,
  onDownloadPdf,
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

  const isApproved = application?.status === 'Approved';

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (isApproved) {
      setError('This application has already been Approved and is permanently locked. It cannot be rejected or reassigned.');
      return;
    }

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
        const errJson = await res.json().catch(() => ({}));
        if (errJson.error) {
          setError(errJson.error);
        } else {
          fallbackLocalUpdate();
        }
      }
    } catch (err) {
      console.warn('API error, saving to local applications:', err);
      fallbackLocalUpdate();
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackLocalUpdate = () => {
    if (isApproved) {
      setError('This application has already been Approved and is permanently locked. It cannot be rejected or reassigned.');
      return;
    }

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
              className="btn-print-admin-doc btn-download-actual-pdf"
              onClick={() => (onDownloadPdf ? onDownloadPdf(formData) : onPrintCertificate(formData))}
              title="Generate and Download Actual 4-Page PDF File"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="btn-print-admin-doc btn-print-secondary"
              onClick={() => onPrintCertificate(formData)}
              title="Browser Vector Print"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
            <button type="button" className="btn-close-modal" onClick={onClose} title="Close Review">
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
                className={`review-tab ${activeTab === 'sitePhoto' ? 'active' : ''}`}
                onClick={() => setActiveTab('sitePhoto')}
              >
                <Camera size={16} />
                <span>Site Photo (Page 4)</span>
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

              {activeTab === 'sitePhoto' && (
                <div className="document-preview-wrapper">
                  <Page4 formData={formData} onChange={() => {}} readOnly={true} />
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
                <p className="update-subtitle">
                  {isApproved
                    ? 'Status is permanently locked after approval'
                    : 'Approve, Reject or Reassign with remarks'}
                </p>
              </div>

              {isApproved && (
                <div className="status-locked-permanent-banner">
                  <div className="locked-banner-icon">
                    <Lock size={20} />
                  </div>
                  <div className="locked-banner-text">
                    <h4>Status Permanently Locked</h4>
                    <p>
                      This application has already been <strong>Approved</strong>. Under Tata Power regulatory policy, an approved application cannot be rejected or reassigned.
                    </p>
                  </div>
                </div>
              )}

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
                    } ${isApproved ? 'already-approved' : ''}`}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Approved"
                      checked={selectedStatus === 'Approved'}
                      disabled={isApproved}
                      onChange={() => {
                        if (isApproved) return;
                        setSelectedStatus('Approved');
                        setRemarks('All installation parameters verified and approved. Certificate formally commissioned.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <CheckCircle2 size={18} className="option-icon" />
                        <span className="option-label">Approve</span>
                        {isApproved && <span className="locked-tag"><Lock size={12} /> Approved & Locked</span>}
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
                    } ${isApproved ? 'disabled-locked' : ''}`}
                    title={isApproved ? 'Cannot reject an already approved application' : ''}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Rejected"
                      checked={selectedStatus === 'Rejected'}
                      disabled={isApproved}
                      onChange={() => {
                        if (isApproved) return;
                        setSelectedStatus('Rejected');
                        setRemarks('Installation parameters fail Tata Power safety standards. Disapproved.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <XCircle size={18} className="option-icon" />
                        <span className="option-label">Reject</span>
                        {isApproved && <span className="locked-pill-danger"><Lock size={12} /> Locked</span>}
                      </div>
                      <p className="option-desc">
                        {isApproved
                          ? 'Disabled: Once approved, an application cannot be rejected.'
                          : 'Add rejection remarks. Application closed.'}
                      </p>
                    </div>
                  </label>

                  {/* Reassign for Correction Option */}
                  <label
                    className={`status-option-card option-reassign ${
                      selectedStatus === 'Reassigned' ? 'selected' : ''
                    } ${isApproved ? 'disabled-locked' : ''}`}
                    title={isApproved ? 'Cannot reassign an already approved application' : ''}
                  >
                    <input
                      type="radio"
                      name="applicationStatus"
                      value="Reassigned"
                      checked={selectedStatus === 'Reassigned'}
                      disabled={isApproved}
                      onChange={() => {
                        if (isApproved) return;
                        setSelectedStatus('Reassigned');
                        setRemarks('Please update the Solar PCU serial numbers in Annexure-1 and re-check Input Voltage readings in Annexure-2.');
                      }}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <RotateCcw size={18} className="option-icon" />
                        <span className="option-label">Reassign for Correction</span>
                        {isApproved && <span className="locked-pill-warning"><Lock size={12} /> Locked</span>}
                      </div>
                      <p className="option-desc">
                        {isApproved
                          ? 'Disabled: Once approved, an application cannot be reassigned.'
                          : 'Add remarks and send back to end user for edit & resubmit.'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Mandatory Remarks Textarea */}
                <div className="admin-input-group" style={{ marginTop: '16px' }}>
                  <label className="admin-label">
                    Remarks <span>{isApproved ? '(Finalized)' : '(Mandatory)'}</span>
                  </label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    placeholder="Enter review remarks..."
                    value={remarks}
                    disabled={isApproved}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                {/* Submit Update Button or Locked State Button */}
                {isApproved ? (
                  <button type="button" className="btn-update-status btn-locked" disabled>
                    <Lock size={18} />
                    <span>Status Locked (Permanently Approved)</span>
                  </button>
                ) : (
                  <button type="submit" className="btn-update-status" disabled={submitting}>
                    <Send size={18} />
                    <span>{submitting ? 'Updating Status...' : 'Update Status'}</span>
                  </button>
                )}
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
