import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Printer,
  Edit3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function StatusTracker({
  currentAppId = '',
  onEditAndResubmit,
  onPrintCertificate,
  onClose
}) {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  
  const [searchId, setSearchId] = useState(currentAppId || queryId || '');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [recentIds, setRecentIds] = useState([]);

  // Load recent IDs
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tpre_recent_ids');
      if (stored) {
        setRecentIds(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch application if currentAppId or queryId passed
  useEffect(() => {
    const targetId = currentAppId || queryId || '';
    if (targetId) {
      setSearchId(targetId);
      fetchStatus(targetId);
    }
  }, [currentAppId, queryId]);

  const fetchStatus = async (idToSearch) => {
    const targetId = (idToSearch || searchId).trim();
    if (!targetId) {
      setError('Please enter a valid Application ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try API first
      const res = await fetch(`/api/applications/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
        saveRecentId(data.application.applicationId);
      } else {
        // Fallback to localStorage if API unavailable
        const stored = localStorage.getItem('tpre_all_applications');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find(
            (a) => a.id.toLowerCase() === targetId.toLowerCase() ||
                   a.applicationId.toLowerCase() === targetId.toLowerCase()
          );
          if (found) {
            setApplication(found);
            saveRecentId(found.applicationId);
            setLoading(false);
            return;
          }
        }
        setError(`No application found with ID "${targetId}". Please verify the ID.`);
        setApplication(null);
      }
    } catch (err) {
      console.warn('API error, checking localStorage:', err);
      const stored = localStorage.getItem('tpre_all_applications');
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find(
          (a) => a.id.toLowerCase() === targetId.toLowerCase() ||
                 a.applicationId.toLowerCase() === targetId.toLowerCase()
        );
        if (found) {
          setApplication(found);
          saveRecentId(found.applicationId);
          setLoading(false);
          return;
        }
      }
      setError(`Unable to find Application ID "${targetId}".`);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentId = (id) => {
    try {
      const stored = localStorage.getItem('tpre_recent_ids');
      let list = stored ? JSON.parse(stored) : [];
      if (!list.includes(id)) {
        list = [id, ...list.slice(0, 4)];
        localStorage.setItem('tpre_recent_ids', JSON.stringify(list));
        setRecentIds(list);
      }
    } catch (e) {
      // ignore
    }
  };

  // Test Simulation helper to change status (Under Review, Reassigned, Approved, Rejected)
  const handleSimulateStatus = async (newStatus, customRemarks) => {
    if (!application) return;
    try {
      const res = await fetch(`/api/applications/${application.applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          remarks: customRemarks
        })
      });

      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
      } else {
        // Fallback update
        const updated = {
          ...application,
          status: newStatus,
          remarks: customRemarks,
          updatedAt: new Date().toISOString()
        };
        setApplication(updated);

        // Update localStorage
        const stored = localStorage.getItem('tpre_all_applications');
        if (stored) {
          const list = JSON.parse(stored);
          const idx = list.findIndex(a => a.applicationId === application.applicationId);
          if (idx !== -1) {
            list[idx] = updated;
            localStorage.setItem('tpre_all_applications', JSON.stringify(list));
          }
        }
      }
    } catch (e) {
      const updated = {
        ...application,
        status: newStatus,
        remarks: customRemarks,
        updatedAt: new Date().toISOString()
      };
      setApplication(updated);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="status-badge status-approved">
            <CheckCircle2 size={16} /> Approved
          </span>
        );
      case 'Reassigned':
        return (
          <span className="status-badge status-reassigned">
            <RotateCcw size={16} /> Reassigned for Correction
          </span>
        );
      case 'Rejected':
        return (
          <span className="status-badge status-rejected">
            <XCircle size={16} /> Rejected
          </span>
        );
      case 'Under Review':
      default:
        return (
          <span className="status-badge status-review">
            <Clock size={16} /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="status-tracker-container no-print">
      <div className="status-tracker-card">
        {/* Header */}
        <div className="tracker-card-header">
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Check Application Status
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              Enter your Application ID to track the verification and approval progress.
            </p>
          </div>
          {onClose && (
            <button type="button" className="btn-close" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        {/* Search input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchStatus();
          }}
          className="search-form"
        >
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="e.g. TPRE20250001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        </form>

        {/* Recent IDs Quick Access */}
        {recentIds.length > 0 && (
          <div className="recent-ids-row">
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Recently Submitted:</span>
            {recentIds.map((id) => (
              <button
                key={id}
                type="button"
                className="chip-id"
                onClick={() => {
                  setSearchId(id);
                  fetchStatus(id);
                }}
              >
                {id}
              </button>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert-message error" style={{ marginTop: '16px' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Status Details Result (Step 4 & 5) */}
        {application && (
          <div className="application-status-panel">
            <div className="status-panel-header">
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Application ID
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1b69b3', letterSpacing: '0.5px' }}>
                  {application.applicationId}
                </div>
              </div>
              <div>{getStatusBadge(application.status)}</div>
            </div>

            <div className="status-meta-grid">
              <div className="meta-box">
                <span className="meta-label">Customer Name</span>
                <span className="meta-value">{application.formData?.customerName || 'N/A'}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Submission Date</span>
                <span className="meta-value">{application.submissionDate || '12 Mar 2025'}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">System Capacity</span>
                <span className="meta-value">
                  {application.formData?.systemCapacityKWp
                    ? `${application.formData.systemCapacityKWp} KWp`
                    : 'N/A'}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-label">System Type</span>
                <span className="meta-value">{application.formData?.systemType || 'Grid connect'}</span>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="remarks-display-box">
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#4b5563', marginBottom: '4px' }}>
                Officer / Admin Remarks:
              </div>
              <div style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.4' }}>
                {application.remarks || 'No remarks provided.'}
              </div>
            </div>

            {/* If Reassigned by Admin: Edit & Resubmit Flow! */}
            {application.status === 'Reassigned' && (
              <div className="reassigned-action-banner">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <RotateCcw size={22} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#92400e', fontWeight: 700 }}>
                      Action Required: Corrections Needed
                    </h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#78350f' }}>
                      The reviewing engineer has reassigned your application for correction. You can now edit your previously submitted details, update the information, and resubmit.
                    </p>
                    <button
                      type="button"
                      className="btn-reassign-edit"
                      onClick={() => onEditAndResubmit(application)}
                    >
                      <Edit3 size={16} />
                      <span>Edit & Resubmit Application</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* If Approved: Download PDF Button (Step 5) */}
            {application.status === 'Approved' && (
              <div className="approved-action-banner">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={28} color="#16a34a" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#166534', fontWeight: 700 }}>
                        Official Certificate Approved & Commissioned
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#15803d' }}>
                        Your certificate has been verified and approved by Tata Power Renewable Energy Limited.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-download-pdf-approved"
                    onClick={() => onPrintCertificate(application.formData)}
                  >
                    <Printer size={18} />
                    <span>Download / Print Approved PDF</span>
                  </button>
                </div>
              </div>
            )}

            {/* General Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-outline-action"
                style={{ flex: 1 }}
                onClick={() => onPrintCertificate(application.formData)}
              >
                <Printer size={16} />
                <span>View / Print Certificate Document</span>
              </button>

              {application.status !== 'Reassigned' && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onEditAndResubmit(application)}
                >
                  <Edit3 size={16} />
                  <span>Review / Edit Data</span>
                </button>
              )}
            </div>

            {/* Interactive Admin Status Simulator (Convenient preview of workflow states) */}
            <div className="status-simulation-box">
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>
                Interactive Workflow Simulator (Test all 4 lifecycle states):
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-sim-pill sim-review"
                  onClick={() => handleSimulateStatus('Under Review', 'Application is under technical review by Tata Power engineers.')}
                >
                  Set Under Review
                </button>
                <button
                  type="button"
                  className="btn-sim-pill sim-reassign"
                  onClick={() => handleSimulateStatus('Reassigned', 'Please update the Solar PCU serial numbers in Annexure-1 and re-check Input Voltage readings in Annexure-2.')}
                >
                  Set Reassigned (Needs Edit)
                </button>
                <button
                  type="button"
                  className="btn-sim-pill sim-approve"
                  onClick={() => handleSimulateStatus('Approved', 'All installation parameters verified and approved. Certificate formally commissioned.')}
                >
                  Set Approved
                </button>
                <button
                  type="button"
                  className="btn-sim-pill sim-reject"
                  onClick={() => handleSimulateStatus('Rejected', 'Grid parameters fail safety standards. Disapproved by Project Manager.')}
                >
                  Set Rejected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
