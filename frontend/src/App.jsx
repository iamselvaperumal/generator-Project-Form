import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './certificate.css';
import './portal.css';
import './admin.css';

import { initialFormData, sampleFormData } from './data/initialData';
import HomeDashboard from './components/HomeDashboard';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import SubmissionSuccessModal from './components/SubmissionSuccessModal';
import StatusTracker from './components/StatusTracker';
import PdfPreviewModal from './components/PdfPreviewModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminReviewModal from './components/admin/AdminReviewModal';
import SignaturePadModal from './components/SignaturePadModal';
import SelfieGeoModal from './components/SelfieGeoModal';
import { downloadFixedPdf } from './utils/pdfExport';
import { getApiUrl } from './utils/apiConfig';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('tpre_form_draft');
      return saved ? JSON.parse(saved) : initialFormData;
    } catch (e) {
      return initialFormData;
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('tpre_uploaded_files');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusSearchId, setStatusSearchId] = useState('');
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportData, setExportData] = useState(null);

  // Instant Geo Selfie & Digital Signature Modal States
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);

  const handleSaveSignature = (signatureDataUrl, type) => {
    setFormData((prev) => ({
      ...prev,
      digitalSignature: signatureDataUrl,
      digitalSignatureType: type,
      customerSignatureName: prev.customerSignatureName || (prev.contactPersonName ? `${prev.contactPersonName} (Digitally Signed)` : 'Digitally Signed Customer')
    }));
  };

  const handleSaveSelfie = ({ image, gps, timestamp }) => {
    setFormData((prev) => ({
      ...prev,
      geoTaggedSelfie: image,
      selfieGpsCoords: gps,
      selfieTimestamp: timestamp,
      latitudeLongitude: gps || prev.latitudeLongitude
    }));
  };

  // Admin Auth & Review State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tpre_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [selectedAppToReview, setSelectedAppToReview] = useState(null);

  const handleAdminLogin = (userRecord, token) => {
    setAdminUser(userRecord);
    try {
      localStorage.setItem('tpre_admin_user', JSON.stringify(userRecord));
      localStorage.setItem('tpre_admin_token', token);
    } catch (e) {
      // ignore
    }
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setSelectedAppToReview(null);
    localStorage.removeItem('tpre_admin_user');
    localStorage.removeItem('tpre_admin_token');
    navigate('/admin/login');
  };

  const handleDownloadFixedPdf = async (customData) => {
    setGeneratingPdf(true);
    const targetData = customData || formData;
    setExportData(targetData);

    try {
      // Allow brief moment for React to mount/update targetData in off-screen container
      await new Promise((resolve) => setTimeout(resolve, 250));

      const safeCustomer = (targetData.customerName || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `TPRE_Certificate_${safeCustomer}_Fixed.pdf`;
      await downloadFixedPdf(['export-page-1', 'export-page-2', 'export-page-3', 'export-page-4'], filename);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Generating direct PDF encountered an issue: ' + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Auto-save form draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tpre_form_draft', JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  // Auto-save uploaded files
  useEffect(() => {
    try {
      localStorage.setItem('tpre_uploaded_files', JSON.stringify(uploadedFiles));
    } catch (e) {
      // ignore
    }
  }, [uploadedFiles]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFillSample = () => {
    if (window.confirm('Populate the 3-page certificate with complete real-world commissioning sample data?')) {
      setFormData(sampleFormData);
      if (uploadedFiles.length === 0) {
        setUploadedFiles([
          {
            id: 'sample-dwg-1',
            originalName: 'TPRE-Chakan-SLD-Drawing-Rev3.pdf',
            filename: 'TPRE-Chakan-SLD-Drawing-Rev3.pdf',
            size: 2450000,
            uploadedAt: new Date().toISOString()
          },
          {
            id: 'sample-report-2',
            originalName: 'SolarLog-2-Days-Generation-Report.xlsx',
            filename: 'SolarLog-2-Days-Generation-Report.xlsx',
            size: 890000,
            uploadedAt: new Date().toISOString()
          }
        ]);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered details will be cleared.')) {
      setFormData(initialFormData);
      setUploadedFiles([]);
      setEditingAppId(null);
      localStorage.removeItem('tpre_form_draft');
      localStorage.removeItem('tpre_uploaded_files');
    }
  };

  const handlePrint = (customData) => {
    if (customData) {
      setFormData(customData);
    }
    if (location.pathname !== '/form' && location.pathname !== '/') {
      navigate('/form');
    }
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Submit Application (Step 2 -> Step 3)
  const handleSubmitApplication = async () => {
    const userEmail = (formData.contactPersonEmail || '').trim().toLowerCase();

    if (!userEmail) {
      alert('Please enter a valid Contact Person Email ID in Page 1 before submitting the application.');
      return;
    }

    if (!formData.customerName && !formData.soNo && !formData.systemCapacityKWp) {
      alert('Please fill in at least the Customer Name or SO No. before submitting.');
      return;
    }

    // Pre-submission check against local applications
    const localStored = localStorage.getItem('tpre_all_applications');
    const localList = localStored ? JSON.parse(localStored) : [];
    const localDuplicate = localList.find(a => {
      const aId = a.id || a.applicationId;
      if (editingAppId && aId.toLowerCase() === editingAppId.toLowerCase()) {
        return false;
      }
      const existingEmail = (
        a.formData?.contactPersonEmail ||
        a.contactPersonEmail ||
        a.email ||
        ''
      ).trim().toLowerCase();
      return existingEmail && existingEmail === userEmail;
    });

    if (localDuplicate) {
      alert('Already you submitted the application using the same email ID and same details so try to enter new one');
      return;
    }

    setSubmitting(true);

    try {
      if (editingAppId) {
        // Resubmission of reassigned application (Step 2 Edit & Resubmit flow)
        const res = await fetch(getApiUrl(`/api/applications/${editingAppId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, uploadedFiles })
        });

        if (res.ok) {
          const data = await res.json();
          alert(`Application ${editingAppId} has been successfully updated and resubmitted for verification!`);
          setStatusSearchId(editingAppId);
          setEditingAppId(null);
          navigate(`/status?id=${editingAppId}`);
        } else {
          const errData = await res.json().catch(() => ({}));
          if (errData.error) {
            alert(errData.error);
          } else {
            fallbackLocalResubmit(editingAppId);
          }
        }
      } else {
        // New application submission
        const res = await fetch(getApiUrl('/api/applications'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, uploadedFiles })
        });

        if (res.ok) {
          const data = await res.json();
          setSubmittedAppId(data.applicationId);
          setShowSuccessModal(true);
          saveToLocalApplications(data.application);
        } else {
          const errData = await res.json().catch(() => ({}));
          if (errData.error) {
            alert(errData.error);
          } else {
            fallbackLocalSubmit();
          }
        }
      }
    } catch (err) {
      console.warn('API server unreachable, checking local submission:', err);
      if (editingAppId) {
        fallbackLocalResubmit(editingAppId);
      } else {
        fallbackLocalSubmit();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackLocalSubmit = () => {
    const year = new Date().getFullYear();
    const stored = localStorage.getItem('tpre_all_applications');
    const list = stored ? JSON.parse(stored) : [];

    const userEmail = (formData.contactPersonEmail || '').trim().toLowerCase();
    if (userEmail) {
      const existing = list.find(a => {
        const email = (a.formData?.contactPersonEmail || a.contactPersonEmail || '').trim().toLowerCase();
        return email && email === userEmail;
      });
      if (existing) {
        alert('Already you submitted the application using the same email ID and same details so try to enter new one');
        return;
      }
    }

    const seq = list.length + 1;
    const newId = `TPRE${year}${String(seq).padStart(4, '0')}`;

    const newApp = {
      id: newId,
      applicationId: newId,
      customerName: formData.customerName || 'Customer',
      contactPersonEmail: formData.contactPersonEmail || '',
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Under Review',
      remarks: 'Application submitted successfully. It is currently under review by Tata Power Renewable Energy engineers.',
      formData,
      uploadedFiles
    };

    list.unshift(newApp);
    localStorage.setItem('tpre_all_applications', JSON.stringify(list));
    setSubmittedAppId(newId);
    setShowSuccessModal(true);
  };

  const fallbackLocalResubmit = (appId) => {
    const stored = localStorage.getItem('tpre_all_applications');
    let list = stored ? JSON.parse(stored) : [];
    const idx = list.findIndex(a => a.applicationId === appId);
    if (idx !== -1) {
      if (list[idx].status === 'Approved') {
        alert('This application has already been Approved and is permanently locked. It cannot be edited or resubmitted.');
        return;
      }
      list[idx] = {
        ...list[idx],
        formData,
        uploadedFiles,
        status: 'Under Review',
        remarks: 'Application corrected and resubmitted by user. Ready for review.',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('tpre_all_applications', JSON.stringify(list));
    }
    alert(`Application ${appId} has been successfully updated and resubmitted for verification!`);
    setStatusSearchId(appId);
    setEditingAppId(null);
    navigate(`/status?id=${appId}`);
  };

  const saveToLocalApplications = (appRecord) => {
    try {
      const stored = localStorage.getItem('tpre_all_applications');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.find(a => a.applicationId === appRecord.applicationId)) {
        list.unshift(appRecord);
        localStorage.setItem('tpre_all_applications', JSON.stringify(list));
      }
    } catch (e) {
      // ignore
    }
  };

  // Callback from Status Tracker: "Edit & Resubmit Application"
  const handleEditAndResubmit = (app) => {
    if (app.status === 'Approved') {
      alert('This application has already been Approved and is permanently locked. It cannot be edited or resubmitted.');
      return;
    }
    if (app.formData) {
      setFormData(app.formData);
    }
    if (app.uploadedFiles) {
      setUploadedFiles(app.uploadedFiles);
    }
    setEditingAppId(app.applicationId);
    navigate('/form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Universal Top Navigation & Actions Bar */}
      <Navbar
        onFillSample={handleFillSample}
        onReset={handleReset}
        onOpenUploads={() => setIsUploadModalOpen(true)}
        uploadedFilesCount={uploadedFiles.length}
        onSubmit={handleSubmitApplication}
        onPrint={() => handlePrint()}
        submitting={submitting}
        editingAppId={editingAppId}
        onCancelEdit={() => setEditingAppId(null)}
        onOpenDevPdfPreview={() => setIsPdfPreviewOpen(true)}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
      />

      {/* React Router Separate Page Views */}
      <Routes>
        {/* Route 0: Welcome Home Dashboard (/) */}
        <Route path="/" element={<HomeDashboard onFillSample={handleFillSample} />} />

        {/* Route 1: Form Page (/form) */}
        <Route
          path="/form"
          element={
            <main className="form-pages-container">
              {/* Desktop Quick Page Jump Bar */}
              <div className="form-desktop-header-bar no-print">
                <div className="form-bar-title">
                  <span className="page-count-chip">4-Page Certificate Editor</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    {formData.customerName ? `Client: ${formData.customerName}` : 'Fill installation details below'}
                  </span>
                </div>
                <div className="form-bar-nav-buttons">
                  <button
                    type="button"
                    className="btn-form-nav-chip"
                    onClick={() => document.getElementById('page-1')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Page 1: Customer Details
                  </button>
                  <button
                    type="button"
                    className="btn-form-nav-chip"
                    onClick={() => document.getElementById('page-2')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Page 2: Equipment Specs
                  </button>
                  <button
                    type="button"
                    className="btn-form-nav-chip"
                    onClick={() => document.getElementById('page-3')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Page 3: Sign-Off
                  </button>
                  <button
                    type="button"
                    className="btn-form-nav-chip"
                    onClick={() => document.getElementById('page-4')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Page 4: Geo Selfie
                  </button>
                </div>
              </div>

              <Page1
                formData={formData}
                onChange={handleFieldChange}
                onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
                onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
              />
              <Page2 formData={formData} onChange={handleFieldChange} />
              <Page3 formData={formData} onChange={handleFieldChange} />
              <Page4 formData={formData} onChange={handleFieldChange} />
            </main>
          }
        />

        {/* Route 2: Status Tracker Page (/status) */}
        <Route
          path="/status"
          element={
            <main>
              <StatusTracker
                currentAppId={statusSearchId}
                onEditAndResubmit={handleEditAndResubmit}
                onDownloadPdf={handleDownloadFixedPdf}
                onPrintCertificate={handlePrint}
              />
            </main>
          }
        />

        {/* Route 3: Admin Login Page (/admin/login) */}
        <Route
          path="/admin/login"
          element={
            <main>
              {adminUser ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLogin onLoginSuccess={handleAdminLogin} />
              )}
            </main>
          }
        />

        {/* Route 4: Admin Dashboard Page (/admin) */}
        <Route
          path="/admin"
          element={
            <main>
              {!adminUser ? (
                <Navigate to="/admin/login" replace />
              ) : (
                <AdminDashboard
                  adminUser={adminUser}
                  onLogout={handleAdminLogout}
                  onViewApplication={(app) => setSelectedAppToReview(app)}
                />
              )}
            </main>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/form" replace />} />
      </Routes>

      {/* Digital Signature Pad Modal */}
      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSaveSignature}
        initialSignature={formData.digitalSignature}
      />

      {/* Instant Geo-Tagged Selfie Camera Modal */}
      <SelfieGeoModal
        isOpen={isSelfieModalOpen}
        onClose={() => setIsSelfieModalOpen(false)}
        onSave={handleSaveSelfie}
        defaultGps={formData.latitudeLongitude}
        plantLocation={formData.locationOfPlant || formData.customerAddress}
      />

      {/* Admin Review & Update Status Modal (Step 3 & 4) */}
      {selectedAppToReview && (
        <AdminReviewModal
          application={selectedAppToReview}
          onClose={() => setSelectedAppToReview(null)}
          onStatusUpdated={(updatedApp) => {
            setSelectedAppToReview(null);
          }}
          onDownloadPdf={handleDownloadFixedPdf}
          onPrintCertificate={handlePrint}
        />
      )}

      {/* Upload Supporting Documents Modal (Step 2) */}
      <UploadSection
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        uploadedFiles={uploadedFiles}
        onFilesChange={setUploadedFiles}
      />

      {/* Submission Success Modal with Application ID (Step 3) */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        applicationId={submittedAppId}
        onTrackStatus={(id) => {
          setStatusSearchId(id);
          const email = formData.contactPersonEmail || '';
          navigate(`/status?id=${id}&email=${encodeURIComponent(email)}`);
        }}
        onPrintCertificate={() => handlePrint()}
      />

      {/* Fixed Layout PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        formData={formData}
        onDownloadPdf={() => handleDownloadFixedPdf()}
        onPrintPdf={() => handlePrint()}
        downloading={generatingPdf}
      />

      {/* Generating PDF Toast Indicator */}
      {generatingPdf && (
        <div className="pdf-toast-indicator">
          <div className="toast-spinner"></div>
          <span>Generating 4-Page Fixed Layout PDF... Please wait a few seconds.</span>
        </div>
      )}

      {/* Off-screen Isolated Container for Generating Real Fixed A4 PDF Anywhere (Admin, Status Tracker, Form) */}
      <div
        id="offscreen-pdf-export-root"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: '210mm',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <div id="export-page-1">
          <Page1 formData={exportData || formData} readOnly={true} />
        </div>
        <div id="export-page-2">
          <Page2 formData={exportData || formData} readOnly={true} />
        </div>
        <div id="export-page-3">
          <Page3 formData={exportData || formData} readOnly={true} />
        </div>
        <div id="export-page-4">
          <Page4 formData={exportData || formData} readOnly={true} />
        </div>
      </div>
    </div>
  );
}
