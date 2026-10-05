import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Layers,
  FileCheck
} from 'lucide-react';
import '../../admin.css';

export default function AdminDashboard({ adminUser, onLogout, onViewApplication }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch applications list
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      } else {
        fallbackLocalStorage();
      }
    } catch (err) {
      console.warn('API unavailable, loading local storage:', err);
      fallbackLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const fallbackLocalStorage = () => {
    try {
      const stored = localStorage.getItem('tpre_all_applications');
      if (stored) {
        setApplications(JSON.parse(stored));
      } else {
        setApplications([]);
      }
    } catch (e) {
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.applicationId || app.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.customerName || app.formData?.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate status counters
  const totalCount = applications.length;
  const reviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const reassignedCount = applications.filter((a) => a.status === 'Reassigned').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="admin-status-badge badge-approved">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case 'Reassigned':
        return (
          <span className="admin-status-badge badge-reassigned">
            <RotateCcw size={14} /> Reassigned
          </span>
        );
      case 'Rejected':
        return (
          <span className="admin-status-badge badge-rejected">
            <XCircle size={14} /> Rejected
          </span>
        );
      case 'Under Review':
      default:
        return (
          <span className="admin-status-badge badge-review">
            <Clock size={14} /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Main Dashboard Content */}
      <main className="admin-main-content">
        {/* KPI Counter Cards */}
        <div className="admin-kpi-grid">
          <div
            className={`kpi-card ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            <div className="kpi-icon icon-total">
              <Layers size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-value">{totalCount}</span>
              <span className="kpi-label">Total Submitted</span>
            </div>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'Under Review' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Under Review')}
          >
            <div className="kpi-icon icon-review">
              <Clock size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-value">{reviewCount}</span>
              <span className="kpi-label">Under Review</span>
            </div>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'Reassigned' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Reassigned')}
          >
            <div className="kpi-icon icon-reassigned">
              <RotateCcw size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-value">{reassignedCount}</span>
              <span className="kpi-label">Reassigned</span>
            </div>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'Approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Approved')}
          >
            <div className="kpi-icon icon-approved">
              <CheckCircle2 size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-value">{approvedCount}</span>
              <span className="kpi-label">Approved</span>
            </div>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'Rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Rejected')}
          >
            <div className="kpi-icon icon-rejected">
              <XCircle size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-value">{rejectedCount}</span>
              <span className="kpi-label">Rejected</span>
            </div>
          </div>
        </div>

        {/* View Applications Section (Step 2) */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <div>
              <h2 className="section-title">View Applications</h2>
              <p className="section-subtitle">
                See all submitted applications in a list with status and review actions.
              </p>
            </div>

            <div className="admin-table-controls">
              {/* Search input */}
              <div className="admin-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by ID or Customer Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter dropdown */}
              <div className="admin-filter-box">
                <Filter size={16} className="filter-icon" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Reassigned">Reassigned</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button type="button" className="btn-icon-refresh" onClick={fetchApplications} title="Refresh Table">
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
              </button>
            </div>
          </div>

          {/* Applications Data Table */}
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => {
                    const appId = app.applicationId || app.id;
                    const custName =
                      app.customerName || app.formData?.customerName || 'N/A';
                    const subDate = app.submissionDate || '12 Mar 2025';

                    return (
                      <tr key={appId}>
                        <td className="cell-id">
                          <span className="app-id-tag">{appId}</span>
                        </td>
                        <td className="cell-customer">
                          <div className="customer-name-text">{custName}</div>
                          {app.formData?.systemCapacityKWp && (
                            <div className="customer-sub-text">
                              Capacity: {app.formData.systemCapacityKWp} KWp
                            </div>
                          )}
                        </td>
                        <td className="cell-date">{subDate}</td>
                        <td className="cell-status">{getStatusBadge(app.status)}</td>
                        <td className="cell-action">
                          <button
                            type="button"
                            className="btn-action-view"
                            onClick={() => onViewApplication(app)}
                          >
                            <Eye size={15} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-table-cell">
                      <FileCheck size={32} color="#94a3b8" />
                      <p>No applications match your search or filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
