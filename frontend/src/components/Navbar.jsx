import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Printer,
  Upload,
  Send,
  Sparkles,
  RotateCcw,
  FileCheck2,
  Download,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import brandLogo from '../assets/brand-logo.png';

export default function Navbar({
  onFillSample,
  onReset,
  onOpenUploads,
  uploadedFilesCount = 0,
  onSubmit,
  onPrint,
  submitting,
  editingAppId,
  onCancelEdit,
  onOpenDevPdfPreview,
  adminUser,
  onLogout
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const isFormActive = currentPath === '/' || currentPath === '/form';
  const isStatusActive = currentPath.startsWith('/status');
  const isAdminActive = currentPath.startsWith('/admin');

  const handleLogoutClick = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <header className="app-navbar no-print">
      <div className="navbar-inner">
        {/* Left: Brand Identity */}
        <div className="brand-group" onClick={() => navigate('/form')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-mark" title="Tata Power Renewable Energy">
            <img src={brandLogo} alt="Tata Power Renewable Energy Logo" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-title">TATA POWER RENEWABLE ENERGY</span>
              <span className="brand-live-dot" title="System Status: Operational">
                <span className="live-pulse"></span> LIVE
              </span>
            </div>
            <div className="brand-subtitle">
              I&C Certificate System • Client Module
            </div>
          </div>
        </div>

        {/* Center: Main Navigation Tabs with URLs */}
        <div className="nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${isFormActive ? 'active' : ''}`}
            onClick={() => navigate('/form')}
            title="Installation & Commissioning Certificate Form (3 Pages)"
          >
            <FileText size={15} />
            <span>Form</span>
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${isStatusActive ? 'active' : ''}`}
            onClick={() => navigate('/status')}
            title="Check Application Submission Status"
          >
            <Search size={15} />
            <span>Status</span>
          </button>
          <button
            type="button"
            className={`nav-tab-btn nav-tab-admin ${isAdminActive ? 'active' : ''}`}
            onClick={() => navigate(adminUser ? '/admin' : '/admin/login')}
            title="Official Staff Admin Review Portal"
          >
            <ShieldCheck size={15} className="admin-icon-glow" />
            <span className="admin-tab-text">Admin</span>
            <span className="admin-chip-tag">STAFF</span>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="nav-actions">
          {isFormActive && (
            <>
              <button
                type="button"
                className="btn-nav-outline btn-sample"
                onClick={onFillSample}
                title="Populate form with complete real-world sample commissioning data"
              >
                <Sparkles size={15} className="sparkle-icon" />
                <span className="nav-btn-text">Sample</span>
              </button>

              <button
                type="button"
                className="btn-nav-outline btn-files-nav"
                onClick={onOpenUploads}
                title="Attach drawings, reports, single line diagram, etc."
              >
                <Upload size={15} />
                <span className="nav-btn-text">Files</span>
                {uploadedFilesCount > 0 && (
                  <span className="file-count-badge">{uploadedFilesCount}</span>
                )}
              </button>

              <button
                type="button"
                className="btn-nav-outline btn-print-nav"
                onClick={onPrint}
                title="Print or export current certificate as high-resolution PDF"
              >
                <Printer size={15} />
                <span className="nav-btn-text">Print</span>
              </button>

              <button
                type="button"
                className="btn-nav-dev-pdf"
                onClick={onOpenDevPdfPreview}
                title="Download and inspect PDF with filled data"
              >
                <Download size={15} />
                <span className="nav-btn-text">Download PDF</span>
                <span className="dev-pill-nav">TEST/DEV</span>
              </button>

              <button
                type="button"
                className="btn-nav-primary"
                onClick={onSubmit}
                disabled={submitting}
                title={editingAppId ? 'Resubmit application with updated details' : 'Submit application to Admin for verification'}
              >
                <Send size={15} />
                <span>{submitting ? 'Submitting...' : editingAppId ? 'Resubmit' : 'Submit'}</span>
              </button>
            </>
          )}

          {isStatusActive && (
            <button
              type="button"
              className="btn-nav-primary"
              onClick={() => navigate('/form')}
            >
              <FileCheck2 size={15} />
              <span>Open Form</span>
            </button>
          )}

          {isAdminActive && adminUser && (
            <div className="nav-admin-user-group">
              <div className="admin-profile-pill">
                <div className="admin-avatar">
                  {(adminUser?.name || 'Admin').split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <div className="admin-user-info">
                  <span className="user-name">{adminUser?.name || 'Admin Officer'}</span>
                  <span className="user-role">{adminUser?.role || 'Reviewing Engineer'}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-admin-logout"
                onClick={handleLogoutClick}
                title="Logout of Admin Portal"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editing Reassigned Banner */}
      {editingAppId && isFormActive && (
        <div className="reassign-banner-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={16} color="#ffffff" />
            <span>
              <strong>Resubmission Mode:</strong> Currently editing reassigned application{' '}
              <span className="mono-badge">{editingAppId}</span>. Make the required corrections and click <strong>"Resubmit Application"</strong>.
            </span>
          </div>
          <button type="button" className="btn-cancel-edit" onClick={onCancelEdit}>
            Exit Edit Mode
          </button>
        </div>
      )}
    </header>
  );
}
