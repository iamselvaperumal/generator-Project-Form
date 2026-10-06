import React, { useState } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

export default function UploadSection({ uploadedFiles = [], onFilesChange, isOpen, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Try uploading to backend API
      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onFilesChange([...uploadedFiles, ...data.files]);
      } else {
        // Fallback: Store locally as object URLs / mock records
        const fallbackRecords = files.map((file) => ({
          id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          originalName: file.name,
          filename: file.name,
          size: file.size,
          mimetype: file.type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        }));
        onFilesChange([...uploadedFiles, ...fallbackRecords]);
      }
    } catch (err) {
      console.warn('Backend upload unavailable, using client storage:', err);
      const fallbackRecords = files.map((file) => ({
        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        originalName: file.name,
        filename: file.name,
        size: file.size,
        mimetype: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      }));
      onFilesChange([...uploadedFiles, ...fallbackRecords]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    const nextFiles = [...uploadedFiles];
    nextFiles.splice(index, 1);
    onFilesChange(nextFiles);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="modal-backdrop no-print">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck className="text-blue" size={24} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1b69b3' }}>
              Upload Supporting Documents
            </h3>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#555' }}>
            As required in Step 2 of the workflow, attach necessary project files such as <strong>Drawings, Single Line Diagrams (SLD), Solar Log Reports, Inspection Checklists</strong>, or <strong>Site Photos</strong>.
          </p>

          <label className="dropzone-area">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.dwg"
            />
            <UploadCloud size={36} color="#1b69b3" />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#222' }}>
              {uploading ? 'Uploading files...' : 'Click to browse or drag and drop supporting files'}
            </span>
            <span style={{ fontSize: '11px', color: '#777' }}>
              PDF, PNG, JPG, DWG, DOCX, XLSX (Up to 25MB each)
            </span>
          </label>

          {uploadError && (
            <div className="alert-message error" style={{ marginTop: '10px' }}>
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              Attached Documents ({uploadedFiles.length}):
            </div>

            {uploadedFiles.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', padding: '10px 0' }}>
                No documents uploaded yet. Supporting documents are optional but recommended.
              </div>
            ) : (
              <div className="file-list">
                {uploadedFiles.map((file, idx) => (
                  <div key={file.id || idx} className="file-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <FileText size={18} color="#1b69b3" />
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.originalName || file.filename}
                        </div>
                        <div style={{ fontSize: '11px', color: '#777' }}>
                          {formatFileSize(file.size)} • {file.uploadedAt ? new Date(file.uploadedAt).toLocaleTimeString() : 'Ready'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-icon-danger"
                      onClick={() => handleRemoveFile(idx)}
                      title="Remove file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Done ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} attached)
          </button>
        </div>
      </div>
    </div>
  );
}
