import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Camera,
  PenTool,
  Download,
  FileCheck2,
  Clock,
  Zap,
  BarChart3,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  UserCheck,
  RotateCcw,
  Layers,
  Lock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import brandLogo from '../assets/brand-logo.png';

export default function HomeDashboard({ onFillSample }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalApps: 0,
    totalCapacity: 0,
    underReview: 0,
    approved: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [searchTrackId, setSearchTrackId] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [savedDraft, setSavedDraft] = useState(null);

  // Load stats, recent apps, and draft from localStorage
  useEffect(() => {
    try {
      const storedApps = localStorage.getItem('tpre_all_applications');
      const list = storedApps ? JSON.parse(storedApps) : [];

      if (list.length > 0) {
        const totalCapacity = list.reduce((sum, app) => {
          const kw = parseFloat(app.formData?.systemCapacityKWp || app.systemCapacityKWp) || 0;
          return sum + kw;
        }, 0);

        const underReview = list.filter((a) => a.status === 'Under Review' || a.status === 'Reassigned').length;
        const approved = list.filter((a) => a.status === 'Approved').length;

        setStats({
          totalApps: list.length,
          totalCapacity: Math.round(totalCapacity * 100) / 100,
          underReview,
          approved
        });
        setRecentApps(list.slice(0, 4));
      } else {
        // Sample baseline metrics for visual demonstration
        setStats({
          totalApps: 24,
          totalCapacity: 1480,
          underReview: 3,
          approved: 21
        });
        setRecentApps([
          {
            applicationId: 'TPRE20260012',
            customerName: 'Chakan Industrial Solar Plant',
            systemCapacityKWp: '450',
            submissionDate: '05 Oct 2026',
            status: 'Approved'
          },
          {
            applicationId: 'TPRE20260011',
            customerName: 'Tata Motors Commercial Roof',
            systemCapacityKWp: '320',
            submissionDate: '04 Oct 2026',
            status: 'Under Review'
          },
          {
            applicationId: 'TPRE20260010',
            customerName: 'GreenTech Logistics Hub',
            systemCapacityKWp: '180',
            submissionDate: '02 Oct 2026',
            status: 'Approved'
          }
        ]);
      }

      // Check for saved draft in current session
      const storedDraft = sessionStorage.getItem('tpre_form_draft');
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        if (parsed && (parsed.customerName || parsed.soNo || parsed.startDateOfIC)) {
          setSavedDraft(parsed);
        }
      }
    } catch (e) {
      console.warn('Error loading dashboard stats:', e);
    }
  }, []);

  const handleStartForm = () => {
    navigate('/form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWithSample = () => {
    onFillSample();
    navigate('/form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (!searchTrackId.trim()) {
      alert('Please enter an Application ID or Email ID to track.');
      return;
    }
    const val = searchTrackId.trim();
    if (val.includes('@')) {
      navigate(`/status?email=${encodeURIComponent(val)}`);
    } else {
      navigate(`/status?id=${encodeURIComponent(val)}`);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'What details are required to complete the 4-page I&C Certificate?',
      a: 'The form requires Customer Name & Address, Sales Order (SO) No, Project Code, System Capacity (KWp), Start/End Commissioning Dates, Technical Spec checklist (Annexure-1), Site Geo-Tagged Selfie with GPS, and Customer Digital Signature.'
    },
    {
      q: 'How does the Live GPS Geo-Tagging camera work?',
      a: 'Clicking "Capture Geo Selfie" opens your device camera and accesses browser Geolocation API to instantly log latitude, longitude, and timestamp on Page 4 of the official certificate.'
    },
    {
      q: 'Can customer digital signature be signed directly on phone or tablet touchscreens?',
      a: 'Yes! The Digital Signature Pad supports touchscreen finger drawing, mouse drawing, typed signatures with official script styling, or uploading an existing signature PNG image.'
    },
    {
      q: 'How do Tata Power engineers review and approve submitted certificates?',
      a: 'Engineers access the Staff Admin Portal (Engineer Login) using secure credentials to review submitted applications, verify technical data, add engineer remarks/stamp, approve, or reassign applications for correction.'
    },
    {
      q: 'What happens if a user submits an application with an existing email ID?',
      a: 'The system enforces duplicate email prevention to prevent accidental multiple submissions. Users can use Application Tracker to check existing submissions or resubmit reassigned forms.'
    }
  ];

  return (
    <div className="home-dashboard-container">
      {/* Draft Resume Alert Banner */}
      {savedDraft && (
        <div className="draft-resume-banner">
          <div className="draft-banner-left">
            <AlertCircle size={18} className="draft-icon-pulse" />
            <span>
              <strong>Active Form Draft Found:</strong> You have an unsaved draft for{' '}
              <strong>{savedDraft.customerName || savedDraft.soNo || 'In-Progress Certificate'}</strong>.
            </span>
          </div>
          <button type="button" className="btn-resume-draft" onClick={handleStartForm}>
            <span>Continue Saved Draft</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <section className="dashboard-hero-card">
        <div className="hero-brand-badge">
          <img src={brandLogo} alt="Tata Power Renewable Energy Logo" className="hero-brand-logo" />
          <span className="hero-live-pill">
            <span className="pulse-dot"></span> Official I&C Enterprise Portal
          </span>
        </div>

        <h1 className="hero-title">
          Tata Power Renewable Energy <br />
          <span className="hero-highlight">Installation & Commissioning Certificate System</span>
        </h1>

        <p className="hero-subtitle">
          Generate, verify, sign, and download official 4-page fixed layout commissioning certificates with instant GPS geo-tagging, digital customer signatures, and automated staff audit workflows.
        </p>

        {/* Hero Actions Group */}
        <div className="hero-actions-group">
          <button
            type="button"
            className="btn-hero-primary-cta"
            onClick={handleStartForm}
          >
            <span>Click to Start Form Filling</span>
            <ArrowRight size={20} className="cta-arrow-icon" />
          </button>

          <button
            type="button"
            className="btn-hero-secondary-cta"
            onClick={handleStartWithSample}
          >
            <Sparkles size={16} color="#fbbf24" />
            <span>Fill Sample Data & Start</span>
          </button>
        </div>

        {/* Quick Search Track Widget directly in Hero */}
        <form className="hero-quick-search-box" onSubmit={handleQuickTrackSubmit}>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Enter Application ID (e.g. TPRE20260001) or Contact Email..."
              value={searchTrackId}
              onChange={(e) => setSearchTrackId(e.target.value)}
              className="quick-search-input"
            />
          </div>
          <button type="submit" className="btn-quick-search-submit">
            <span>Track Status</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </section>

      {/* Real-time System Analytics Metrics Cards */}
      <section className="dashboard-stats-grid">
        <div className="stat-card card-cyan">
          <div className="stat-header">
            <span className="stat-title">Total Applications</span>
            <div className="stat-icon"><FileText size={20} /></div>
          </div>
          <div className="stat-value">{stats.totalApps}</div>
          <div className="stat-footer">
            <span className="stat-trend positive">✓ Synchronized</span>
            <span className="stat-desc">Certificates registered</span>
          </div>
        </div>

        <div className="stat-card card-amber">
          <div className="stat-header">
            <span className="stat-title">Total Capacity</span>
            <div className="stat-icon"><Zap size={20} /></div>
          </div>
          <div className="stat-value">{stats.totalCapacity} <span className="stat-unit">kWp</span></div>
          <div className="stat-footer">
            <span className="stat-trend">Solar Generation</span>
            <span className="stat-desc">Commissioned capacity</span>
          </div>
        </div>

        <div className="stat-card card-blue">
          <div className="stat-header">
            <span className="stat-title">Under Verification</span>
            <div className="stat-icon"><Clock size={20} /></div>
          </div>
          <div className="stat-value">{stats.underReview}</div>
          <div className="stat-footer">
            <span className="stat-trend warning">Pending Staff Review</span>
            <span className="stat-desc">Engineers inspecting</span>
          </div>
        </div>

        <div className="stat-card card-emerald">
          <div className="stat-header">
            <span className="stat-title">Approved & Sealed</span>
            <div className="stat-icon"><CheckCircle2 size={20} /></div>
          </div>
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-footer">
            <span className="stat-trend success">Official TPRE Seal</span>
            <span className="stat-desc">Ready for download</span>
          </div>
        </div>
      </section>

      {/* Quick Access Core Portals Grid */}
      <section className="dashboard-modules-grid">
        {/* Module 1: Form Filling */}
        <div className="module-card module-card-primary" onClick={handleStartForm}>
          <div className="module-icon-wrap icon-cyan">
            <FileText size={26} />
          </div>
          <div className="module-content">
            <div className="module-badge">STEP 1 & 2 • CLIENT FORM</div>
            <h3 className="module-title">Start Form Filling</h3>
            <p className="module-desc">
              Fill out the complete 4-page commissioning certificate details, attach site photos, geo selfie & customer digital signature.
            </p>

            <button type="button" className="btn-module-action">
              <span>Start Filling Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Module 2: Track Status */}
        <div className="module-card" onClick={() => navigate('/status')}>
          <div className="module-icon-wrap icon-blue">
            <Search size={26} />
          </div>
          <div className="module-content">
            <div className="module-badge badge-gray">APPLICATION TRACKER</div>
            <h3 className="module-title">Track Submission Status</h3>
            <p className="module-desc">
              Check real-time verification status of submitted applications using Application ID or Contact Email ID.
            </p>

            <button type="button" className="btn-module-action btn-module-outline">
              <span>Track Status</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Module 3: Admin Review */}
        <div className="module-card" onClick={() => navigate('/admin')}>
          <div className="module-icon-wrap icon-amber">
            <ShieldCheck size={26} />
          </div>
          <div className="module-content">
            <div className="module-badge badge-amber">STAFF REVIEW PORTAL</div>
            <h3 className="module-title">Engineer Admin Portal</h3>
            <p className="module-desc">
              Official verification portal for Tata Power engineers to inspect, reassign, approve, and sign certificates.
            </p>

            <button type="button" className="btn-module-action btn-module-outline">
              <span>Engineer Login</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Submissions / Activity Showcase */}
      {recentApps.length > 0 && (
        <section className="dashboard-recent-section">
          <div className="section-header-between">
            <div>
              <h2 className="section-heading">Recent Commissioning Applications</h2>
              <p className="section-subheading">Latest certificates submitted for Tata Power Renewable Energy audit</p>
            </div>
            <button
              type="button"
              className="btn-view-all-link"
              onClick={() => navigate('/status')}
            >
              <span>View All Applications</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-apps-grid">
            {recentApps.map((app, index) => {
              const appId = app.applicationId || app.id || `TPRE2026${String(index + 1).padStart(4, '0')}`;
              const custName = app.customerName || app.formData?.customerName || 'Customer Solar Project';
              const capacity = app.systemCapacityKWp || app.formData?.systemCapacityKWp || '100';
              const date = app.submissionDate || app.submittedAt ? new Date(app.submittedAt || Date.now()).toLocaleDateString('en-GB') : 'Today';
              const status = app.status || 'Under Review';

              return (
                <div
                  key={appId}
                  className="recent-app-card"
                  onClick={() => navigate(`/status?id=${appId}`)}
                >
                  <div className="recent-card-top">
                    <span className="app-id-tag">{appId}</span>
                    <span className={`status-badge-chip status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {status}
                    </span>
                  </div>
                  <h4 className="recent-cust-name">{custName}</h4>
                  <div className="recent-card-meta">
                    <span className="meta-item"><Zap size={13} /> {capacity} kWp</span>
                    <span className="meta-item"><Clock size={13} /> {date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4-Page Certificate Structure Breakdown */}
      <section className="dashboard-structure-section">
        <div className="section-header-center">
          <h2 className="section-heading">4-Page Standard Fixed Layout Certificate Structure</h2>
          <p className="section-subheading">100% compliant with Tata Power Renewable Energy official I&C(1).pdf template</p>
        </div>

        <div className="structure-cards-grid">
          <div className="page-spec-card">
            <div className="page-num-badge">PAGE 01</div>
            <h4>System & Customer Details</h4>
            <ul>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Start & End Dates of I&C</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> SO No & Project Code</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> System Capacity (KWp)</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Customer Address & Contacts</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Digital Customer Signature Slot</li>
            </ul>
          </div>

          <div className="page-spec-card">
            <div className="page-num-badge">PAGE 02</div>
            <h4>Technical Specs & Annexure-1</h4>
            <ul>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Solar Modules Make & Rating</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Solar PCU / Inverter Details</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> ACDB & Solar Log Specs</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Battery Bank Bank Specs</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Technical Inspection Checklist</li>
            </ul>
          </div>

          <div className="page-spec-card">
            <div className="page-num-badge">PAGE 03</div>
            <h4>Battery Serials & Contractor Sign-Off</h4>
            <ul>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Individual Battery Sr. Numbers</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Preventive Maintenance Scope</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Handover Confirmation</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Electrical Contractor Details</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Contractor License & Signature</li>
            </ul>
          </div>

          <div className="page-spec-card">
            <div className="page-num-badge">PAGE 04</div>
            <h4>Geo Selfie & Official Engineer Seal</h4>
            <ul>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> 500×500px Live Geo Selfie Photo</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> GPS Latitude / Longitude Log</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Auto Camera Timestamp</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> TPRE Reviewing Engineer Notes</li>
              <li><CheckCircle2 size={14} color="#0ea5e9" /> Official TPRE Seal & Sign-Off</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow Process Steps */}
      <section className="dashboard-workflow-section">
        <div className="section-header-center">
          <h2 className="section-heading">How the Commissioning Workflow Works</h2>
          <p className="section-subheading">Simple 4-step process to generate & verify legal commissioning certificates</p>
        </div>

        <div className="workflow-steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">
              <FileText size={20} />
            </div>
            <h4>Fill Certificate Details</h4>
            <p>Enter Customer Details, Start/End Dates, SO No, Project Code & System Capacity (KWp).</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">
              <Camera size={20} />
            </div>
            <h4>Geo Selfie & Digital Signature</h4>
            <p>Capture site commissioning selfie with live GPS coordinates & draw/upload customer digital signature.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">
              <FileCheck2 size={20} />
            </div>
            <h4>Submit for Verification</h4>
            <p>Submit application to receive unique Tracking ID (e.g. TPRE20260001) for instant status tracking.</p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon">
              <Download size={20} />
            </div>
            <h4>Direct Fixed PDF Download</h4>
            <p>Download standard 4-page fixed layout vector PDF matching official I&C(1).pdf template.</p>
          </div>
        </div>
      </section>

      {/* Key Highlights Banner */}
      <section className="dashboard-features-strip">
        <div className="feature-item">
          <CheckCircle2 size={18} color="#10b981" />
          <span>100% Fixed A4 Layout Standard</span>
        </div>
        <div className="feature-item">
          <CheckCircle2 size={18} color="#10b981" />
          <span>Instant GPS Coordinate Tagging</span>
        </div>
        <div className="feature-item">
          <CheckCircle2 size={18} color="#10b981" />
          <span>Digital Canvas Signature Pad</span>
        </div>
        <div className="feature-item">
          <CheckCircle2 size={18} color="#10b981" />
          <span>Automated Email Duplicate Prevention</span>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="dashboard-faq-section">
        <div className="section-header-center">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subheading">Everything you need to know about the Tata Power Renewable Energy I&C System</p>
        </div>

        <div className="faq-accordion-list">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-q-left">
                    <HelpCircle size={18} className="faq-icon" />
                    <span>{item.q}</span>
                  </div>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Branding Banner */}
      <footer className="dashboard-footer-banner">
        <div className="footer-brand-row">
          <div className="footer-logo-group">
            <img src={brandLogo} alt="Tata Power Logo" className="footer-brand-logo" />
            <div>
              <div className="footer-company-name">TATA POWER RENEWABLE ENERGY LIMITED</div>
              <div className="footer-sub-text">Corporate Center B, 34, Sant Tukaram Road, Carnac Bunder, Mumbai 400009</div>
            </div>
          </div>
          <div className="footer-system-version">
            <span className="ver-tag">v2.4 Enterprise</span>
            <span className="status-live">● System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

