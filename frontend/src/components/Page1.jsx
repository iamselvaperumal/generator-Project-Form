import React from 'react';
import { Camera, PenTool, MapPin, CheckCircle } from 'lucide-react';
import CommonHeader from './CommonHeader';

export default function Page1({
  formData,
  onChange,
  readOnly = false,
  onOpenSelfieModal,
  onOpenSignatureModal
}) {
  const handleChange = (field, value) => {
    if (readOnly) return;
    onChange(field, value);
  };

  return (
    <div className="a4-page" id="page-1">
      {/* Top Right Selfie Widget: Only rendered in form filling mode (no-print), NOT in PDF */}
      {!readOnly && (
        <div className="p1-top-right-selfie-container no-print">
          {formData.geoTaggedSelfie ? (
            <div className="topright-selfie-card">
              <div className="topright-selfie-meta">
                <div className="topright-badge-tag">
                  <Camera size={12} />
                  <span>Site Selfie Captured</span>
                </div>
                <div className="topright-gps-text">
                  📍 {formData.latitudeLongitude ? formData.latitudeLongitude.split(',')[0] : 'GPS Logged'}
                </div>
                <button
                  type="button"
                  className="btn-topright-retake"
                  onClick={onOpenSelfieModal}
                  title="Retake Geo Selfie"
                >
                  Retake Photo
                </button>
              </div>
              <img
                src={formData.geoTaggedSelfie}
                alt="Site Commissioning Geo Selfie"
                className="topright-selfie-img"
                onClick={onOpenSelfieModal}
                title="Click to view or retake photo"
              />
            </div>
          ) : (
            <button
              type="button"
              className="btn-topright-capture"
              onClick={onOpenSelfieModal}
              title="Capture Geo-Tagged Site Commissioning Selfie"
            >
              <div className="btn-topright-text">
                <span className="btn-topright-heading">Capture Geo Selfie</span>
                <span className="btn-topright-desc">Rendered 500×500px on Page 4</span>
              </div>
              <Camera size={18} color="#0ea5e9" />
            </button>
          )}
        </div>
      )}

      <div className="page-content">
        <CommonHeader />

        <div className="p1-title">INSTALLATION & COMMISSIONING CERTIFICATE</div>

        <div className="p1-cert-paragraph">
          This is to certify that M/s. TATA POWER RENEWABLE ENERGY LIMITED, MUMBAI has
          designed, supplied, installed, commissioned and handed over the following system to our
          satisfaction.
        </div>

        <div className="table-responsive-container">
          <table className="cert-table">
          <tbody>
            {/* Row 1: Start date of I&C | End date of I&C */}
            <tr>
              <td className="cell-split-50">
                <div className="field-inline-row">
                  <span className="field-label">Start date of I&C</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.startDateOfIC || ''}</span>
                    ) : (
                      <input
                        type="date"
                        className="doc-input doc-input-underline"
                        value={formData.startDateOfIC || ''}
                        onChange={(e) => handleChange('startDateOfIC', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
              <td className="cell-split-50">
                <div className="field-inline-row">
                  <span className="field-label">End date of I&C</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.endDateOfIC || ''}</span>
                    ) : (
                      <input
                        type="date"
                        className="doc-input doc-input-underline"
                        value={formData.endDateOfIC || ''}
                        onChange={(e) => handleChange('endDateOfIC', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 2: SO No. | Project code */}
            <tr>
              <td className="cell-split-50">
                <div className="field-inline-row">
                  <span className="field-label">SO No.</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.soNo || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input doc-input-underline"
                        value={formData.soNo || ''}
                        onChange={(e) => handleChange('soNo', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
              <td className="cell-split-50">
                <div className="field-inline-row">
                  <span className="field-label">Project code</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.projectCode || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input doc-input-underline"
                        value={formData.projectCode || ''}
                        onChange={(e) => handleChange('projectCode', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 3: Latitude Longitude */}
            <tr>
              <td colSpan={2} className="cell-full-width">
                <div className="field-inline-row">
                  <span className="field-label">Latitude Longitude</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.latitudeLongitude || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input doc-input-underline"
                        value={formData.latitudeLongitude || ''}
                        onChange={(e) => handleChange('latitudeLongitude', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 4: System Capacity in KWp */}
            <tr>
              <td colSpan={2} className="cell-full-width">
                <div className="field-inline-row">
                  <span className="field-label">System Capacity in KWp</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value">{formData.systemCapacityKWp || ''}</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="doc-input doc-input-underline"
                        value={formData.systemCapacityKWp || ''}
                        onChange={(e) => handleChange('systemCapacityKWp', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 5: Type of System (Grid connect / Off grid) */}
            <tr>
              <td colSpan={2} className="cell-full-width">
                <div className="field-inline-row">
                  <span className="field-label">Type of System (Grid connect / Off grid)</span>
                  <div className="field-content">
                    {readOnly ? (
                      <span className="doc-static-value" style={{ fontWeight: 'bold' }}>
                        {formData.systemType || 'Grid connect'}
                      </span>
                    ) : (
                      <div className="doc-system-type-wrap">
                        <button
                          type="button"
                          className={`doc-type-btn ${formData.systemType === 'Grid connect' ? 'selected' : ''}`}
                          onClick={() => handleChange('systemType', 'Grid connect')}
                        >
                          Grid connect
                        </button>
                        <button
                          type="button"
                          className={`doc-type-btn ${formData.systemType === 'Off grid' ? 'selected' : ''}`}
                          onClick={() => handleChange('systemType', 'Off grid')}
                        >
                          Off grid
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 6: Major Components */}
            <tr>
              <td className="mc-row-left">
                <div className="mc-title">Major Components</div>
                <div className="mc-sub">
                  Make,<br />
                  Capacity,<br />
                  Quantity
                </div>
              </td>
              <td className="mc-row-right">
                <div>Details are attached as per Annexure-1</div>
                <ol>
                  <li>Solar Modules</li>
                  <li>Solar PCUs</li>
                  <li>ACDB</li>
                  <li>Solar Log</li>
                  <li>Batteries</li>
                </ol>
              </td>
            </tr>

            {/* Row 7: Customer Name with Full Address & Phone No. + Contact Person Details */}
            <tr>
              <td className="cust-col-left">
                <div className="cust-block-top">
                  <div><strong>Customer Name with</strong></div>
                  <div><strong>Full Address & Phone No.</strong></div>
                </div>
                <div className="cust-block-divider"></div>
                <div className="cust-block-bottom">
                  <div><strong>Contact Person Name, Mobile No.</strong></div>
                  <div><strong>& Email ID.</strong></div>
                </div>
              </td>
              <td className="cust-col-right">
                {readOnly ? (
                  <>
                    <div className="cust-block-top">
                      <div style={{ fontWeight: 'bold', fontSize: '10pt', marginBottom: '2px', color: '#000000' }}>
                        {formData.customerName || ''}
                      </div>
                      <div style={{ fontSize: '9pt', lineHeight: '1.35', whiteSpace: 'pre-wrap', color: '#111111' }}>
                        {formData.customerAddress || ''}
                      </div>
                      {formData.customerPhone && (
                        <div style={{ fontSize: '9pt', marginTop: '3px', color: '#000000' }}>
                          <strong>Phone:</strong> {formData.customerPhone}
                        </div>
                      )}
                    </div>
                    <div className="cust-block-divider"></div>
                    <div className="cust-block-bottom">
                      <div style={{ fontWeight: 'bold', fontSize: '9.5pt', marginBottom: '2px', color: '#000000' }}>
                        {formData.contactPersonName || ''}
                      </div>
                      <div style={{ fontSize: '9pt', color: '#111111' }}>
                        {formData.contactPersonMobile && <span><strong>Mobile:</strong> {formData.contactPersonMobile}</span>}
                        {formData.contactPersonMobile && formData.contactPersonEmail && <span> &nbsp;|&nbsp; </span>}
                        {formData.contactPersonEmail && <span><strong>Email:</strong> {formData.contactPersonEmail}</span>}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cust-block-top">
                      <input
                        type="text"
                        placeholder="Customer / Company Name"
                        className="doc-input doc-input-underline"
                        style={{ fontWeight: 'bold', fontSize: '10pt' }}
                        value={formData.customerName || ''}
                        onChange={(e) => handleChange('customerName', e.target.value)}
                      />
                      <textarea
                        rows={2}
                        placeholder="Full Address (Plot, Street, City, State, PIN)"
                        className="doc-textarea"
                        style={{ borderBottom: '1px dotted #888888', marginTop: '4px' }}
                        value={formData.customerAddress || ''}
                        onChange={(e) => handleChange('customerAddress', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Phone No."
                        className="doc-input doc-input-underline"
                        style={{ marginTop: '4px' }}
                        value={formData.customerPhone || ''}
                        onChange={(e) => handleChange('customerPhone', e.target.value)}
                      />
                    </div>
                    <div className="cust-block-divider"></div>
                    <div className="cust-block-bottom">
                      <input
                        type="text"
                        placeholder="Contact Person Name"
                        className="doc-input doc-input-underline"
                        style={{ fontWeight: 'bold' }}
                        value={formData.contactPersonName || ''}
                        onChange={(e) => handleChange('contactPersonName', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="text"
                          placeholder="Mobile No."
                          className="doc-input doc-input-underline"
                          style={{ flex: 1 }}
                          value={formData.contactPersonMobile || ''}
                          onChange={(e) => handleChange('contactPersonMobile', e.target.value)}
                        />
                        <input
                          type="email"
                          placeholder="Email ID"
                          className="doc-input doc-input-underline"
                          style={{ flex: 1 }}
                          value={formData.contactPersonEmail || ''}
                          onChange={(e) => handleChange('contactPersonEmail', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </td>
            </tr>

            {/* Row 8: Trained O&M Person */}
            <tr>
              <td className="tom-row-left">
                <div>Trained the customer authorized O&M Person:</div>
                <div style={{ fontSize: '9pt', color: '#222', marginTop: '1px' }}>
                  Name of the Trained Person & Mobile Number
                </div>
                {readOnly ? (
                  <div className="doc-static-value" style={{ marginTop: '2px' }}>
                    {formData.trainedPersonName || ''} {formData.trainedPersonMobile ? `(${formData.trainedPersonMobile})` : ''}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '1px' }}>
                    <input
                      type="text"
                      placeholder="Name"
                      className="doc-input doc-input-underline"
                      style={{ width: '60%' }}
                      value={formData.trainedPersonName || ''}
                      onChange={(e) => handleChange('trainedPersonName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      className="doc-input doc-input-underline"
                      style={{ width: '40%' }}
                      value={formData.trainedPersonMobile || ''}
                      onChange={(e) => handleChange('trainedPersonMobile', e.target.value)}
                    />
                  </div>
                )}
              </td>
              <td className="tom-row-right">
                {readOnly ? (
                  <div className="doc-yes-no-display">
                    <span className={formData.trainedOMPersonYesNo === 'Yes' ? 'selected' : ''}>Yes</span>
                    <span> / </span>
                    <span className={formData.trainedOMPersonYesNo === 'No' ? 'selected' : ''}>No</span>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      className={`doc-yes-no-btn ${formData.trainedOMPersonYesNo === 'Yes' ? 'selected' : ''}`}
                      onClick={() => handleChange('trainedOMPersonYesNo', 'Yes')}
                    >
                      Yes
                    </button>
                    <span> / </span>
                    <button
                      type="button"
                      className={`doc-yes-no-btn ${formData.trainedOMPersonYesNo === 'No' ? 'selected' : ''}`}
                      onClick={() => handleChange('trainedOMPersonYesNo', 'No')}
                    >
                      No
                    </button>
                  </div>
                )}
              </td>
            </tr>

            {/* Row 9: Handover Confirmation */}
            <tr>
              <td className="ho-row-left">
                <ol>
                  <li>Handed over User manual & Drawing</li>
                  <li>
                    Informed the customer on scope & handed<br />
                    over the Schedule of Preventive Maintenance<br />
                    (PM)
                  </li>
                </ol>
              </td>
              <td className="ho-row-right">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>1.</span>
                  {readOnly ? (
                    <div className="doc-yes-no-display">
                      <span className={formData.userManualDrawingYesNo === 'Yes' ? 'selected' : ''}>Yes</span>
                      <span> / </span>
                      <span className={formData.userManualDrawingYesNo === 'No' ? 'selected' : ''}>No</span>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        className={`doc-yes-no-btn ${formData.userManualDrawingYesNo === 'Yes' ? 'selected' : ''}`}
                        onClick={() => handleChange('userManualDrawingYesNo', 'Yes')}
                      >
                        Yes
                      </button>
                      <span> / </span>
                      <button
                        type="button"
                        className={`doc-yes-no-btn ${formData.userManualDrawingYesNo === 'No' ? 'selected' : ''}`}
                        onClick={() => handleChange('userManualDrawingYesNo', 'No')}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>2.</span>
                  {readOnly ? (
                    <div className="doc-yes-no-display">
                      <span className={formData.preventiveMaintenanceYesNo === 'Yes' ? 'selected' : ''}>Yes</span>
                      <span> / </span>
                      <span className={formData.preventiveMaintenanceYesNo === 'No' ? 'selected' : ''}>No</span>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        className={`doc-yes-no-btn ${formData.preventiveMaintenanceYesNo === 'Yes' ? 'selected' : ''}`}
                        onClick={() => handleChange('preventiveMaintenanceYesNo', 'Yes')}
                      >
                        Yes
                      </button>
                      <span> / </span>
                      <button
                        type="button"
                        className={`doc-yes-no-btn ${formData.preventiveMaintenanceYesNo === 'No' ? 'selected' : ''}`}
                        onClick={() => handleChange('preventiveMaintenanceYesNo', 'No')}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            {/* Row 10: Signatures */}
            <tr>
              <td>
                <div className="sig-row-left">
                  <div>
                    <div>for</div>
                    {/* Digital Signature Image Box (Bottom Left Corner) */}
                    <div className="digital-sig-slot-box">
                      {formData.digitalSignature ? (
                        <div className="sig-img-container">
                          <img src={formData.digitalSignature} alt="Customer Digital Signature" className="customer-digital-sig-img" />
                          {!readOnly && (
                            <button
                              type="button"
                              className="btn-mini-sig-edit no-print"
                              onClick={onOpenSignatureModal}
                              title="Edit Digital Signature"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : (
                        !readOnly && (
                          <button
                            type="button"
                            className="btn-add-digital-sig no-print"
                            onClick={onOpenSignatureModal}
                            title="Draw, type, or upload customer digital signature"
                          >
                            <PenTool size={13} color="#1b69b3" />
                            <span>✍️ Add Digital Signature</span>
                          </button>
                        )
                      )}
                    </div>

                    {readOnly ? (
                      <div className="doc-static-value" style={{ borderBottom: '1px dotted #888', minHeight: '16px' }}>
                        {formData.customerOrgFor || ''}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="…………………………………………………………."
                        className="doc-input doc-input-underline"
                        value={formData.customerOrgFor || ''}
                        onChange={(e) => handleChange('customerOrgFor', e.target.value)}
                      />
                    )}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div className="sig-field-row">
                      <span className="sig-field-label">Seal:</span>
                      <div className="sig-field-content">
                        {readOnly ? (
                          <span className="doc-static-value">{formData.customerSeal || ''}</span>
                        ) : (
                          <input
                            type="text"
                            className="doc-input doc-input-underline"
                            value={formData.customerSeal || ''}
                            onChange={(e) => handleChange('customerSeal', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="sig-field-row">
                      <span className="sig-field-label">Date:</span>
                      <div className="sig-field-content">
                        {readOnly ? (
                          <span className="doc-static-value">{formData.customerDate || ''}</span>
                        ) : (
                          <input
                            type="date"
                            className="doc-input doc-input-underline"
                            value={formData.customerDate || ''}
                            onChange={(e) => handleChange('customerDate', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="sig-row-right">
                  <div>
                    <div>for M/s. Tata Power Renewable Energy Limited</div>
                    <div style={{ height: '36px' }}></div>
                  </div>
                  <div>
                    <div className="sig-field-row">
                      <span className="sig-field-label">Seal:</span>
                      <div className="sig-field-content">
                        {readOnly ? (
                          <span className="doc-static-value">{formData.tataPowerSeal || ''}</span>
                        ) : (
                          <input
                            type="text"
                            className="doc-input doc-input-underline"
                            value={formData.tataPowerSeal || ''}
                            onChange={(e) => handleChange('tataPowerSeal', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="sig-field-row">
                      <span className="sig-field-label">Date:</span>
                      <div className="sig-field-content">
                        {readOnly ? (
                          <span className="doc-static-value">{formData.tataPowerDate || ''}</span>
                        ) : (
                          <input
                            type="date"
                            className="doc-input doc-input-underline"
                            value={formData.tataPowerDate || ''}
                            onChange={(e) => handleChange('tataPowerDate', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="page-doc-footer">
        <div className="page-number">1</div>
        <div className="copyright-text">© Tata Power Renewable Energy Limited</div>
      </div>
    </div>
  );
}
