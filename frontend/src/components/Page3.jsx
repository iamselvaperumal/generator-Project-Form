import React from 'react';
import { PenTool } from 'lucide-react';
import CommonHeader from './CommonHeader';

export default function Page3({ formData, onChange, readOnly = false, onOpenSignatureModal }) {
  const annexure2 = formData.annexure2 || {};

  const handleFieldChange = (field, value) => {
    if (readOnly) return;
    onChange('annexure2', {
      ...annexure2,
      [field]: value
    });
  };

  const handleNestedChange = (parentKey, field, value) => {
    if (readOnly) return;
    onChange('annexure2', {
      ...annexure2,
      [parentKey]: {
        ...(annexure2[parentKey] || {}),
        [field]: value
      }
    });
  };

  const handleReadingChange = (index, field, value) => {
    if (readOnly) return;
    const readings = [...(annexure2.solarLogReadings || [])];
    readings[index] = {
      ...readings[index],
      [field]: value
    };
    onChange('annexure2', {
      ...annexure2,
      solarLogReadings: readings
    });
  };

  const handleAddReadingRow = () => {
    if (readOnly) return;
    const readings = [...(annexure2.solarLogReadings || [])];
    readings.push({
      solarLogNos: '',
      date: '',
      timeFrom: '',
      timeTo: '',
      guaranteedKwh: '',
      actualKwh: '',
      percentage: ''
    });
    onChange('annexure2', {
      ...annexure2,
      solarLogReadings: readings
    });
  };

  return (
    <div className="a4-page" id="page-3">
      <div className="page-content">
        <CommonHeader />

        <div className="p3-title-top">Annexure – 2</div>

        <div className="p3-handover-bar">
          <div className="p3-main-heading">ASC - Project Handover Report</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '6px' }}>Date:</span>
            {readOnly ? (
              <span className="doc-static-value" style={{ width: '110px' }}>{annexure2.date || ''}</span>
            ) : (
              <input
                type="date"
                className="doc-input doc-input-underline"
                style={{ width: '130px' }}
                value={annexure2.date || ''}
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Customer & Plant Capacity Subheader */}
        <div className="p2-intro-row">
          <div style={{ width: '55%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '130px', flexShrink: 0 }}>Customer Name</span>
              {readOnly ? (
                <span className="doc-static-value" style={{ fontWeight: 'bold' }}>{annexure2.customerName || ''}</span>
              ) : (
                <input
                  type="text"
                  className="doc-input doc-input-underline"
                  value={annexure2.customerName || ''}
                  onChange={(e) => handleFieldChange('customerName', e.target.value)}
                />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '130px', flexShrink: 0 }}>& Location:</span>
              {readOnly ? (
                <span className="doc-static-value">{annexure2.location || ''}</span>
              ) : (
                <input
                  type="text"
                  className="doc-input doc-input-underline"
                  value={annexure2.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              )}
            </div>
          </div>
          <div style={{ width: '43%', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, marginRight: '6px' }}>Plant Capacity in Kwp:</span>
            {readOnly ? (
              <span className="doc-static-value" style={{ fontWeight: 'bold' }}>{annexure2.plantCapacityKwp || ''}</span>
            ) : (
              <input
                type="text"
                className="doc-input doc-input-underline"
                value={annexure2.plantCapacityKwp || ''}
                onChange={(e) => handleFieldChange('plantCapacityKwp', e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Orientation of the solar Modules */}
        <div style={{ fontSize: '9pt', margin: '3px 0 5px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <span>Orientation of the solar Modules 1.</span>
          {readOnly ? (
            <span className="doc-static-value" style={{ width: '220px', borderBottom: '1px dotted #888' }}>
              {annexure2.moduleOrientation || ''}
            </span>
          ) : (
            <input
              type="text"
              className="doc-input doc-input-underline"
              style={{ width: '220px' }}
              value={annexure2.moduleOrientation || ''}
              onChange={(e) => handleFieldChange('moduleOrientation', e.target.value)}
            />
          )}
          <span>2. Installed as per drawing –</span>
          {readOnly ? (
            <div className="doc-yes-no-display">
              <span className={annexure2.installedAsPerDrawing === 'Yes' ? 'selected' : ''}>Yes</span>
              <span> / </span>
              <span className={annexure2.installedAsPerDrawing === 'No' ? 'selected' : ''}>No</span>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className={`doc-yes-no-btn ${annexure2.installedAsPerDrawing === 'Yes' ? 'selected' : ''}`}
                onClick={() => handleFieldChange('installedAsPerDrawing', 'Yes')}
              >
                Yes
              </button>
              <span> / </span>
              <button
                type="button"
                className={`doc-yes-no-btn ${annexure2.installedAsPerDrawing === 'No' ? 'selected' : ''}`}
                onClick={() => handleFieldChange('installedAsPerDrawing', 'No')}
              >
                No
              </button>
            </div>
          )}
        </div>

        {/* Section 1.1: Grid Parameters */}
        <div className="p3-subheading">1.1 Grid Parameters:</div>
        <table className="annexure-table" style={{ marginBottom: '4px' }}>
          <thead>
            <tr>
              <th style={{ width: '38%', textAlign: 'left', paddingLeft: '6px' }}>Description</th>
              <th style={{ width: '20%' }}>R N</th>
              <th style={{ width: '21%' }}>Y N</th>
              <th style={{ width: '21%' }}>B N</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ paddingLeft: '6px' }}>Input Voltage (V)</td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.gridParameters && annexure2.gridParameters.inputVoltageRN) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.gridParameters && annexure2.gridParameters.inputVoltageRN) || ''}
                    onChange={(e) => handleNestedChange('gridParameters', 'inputVoltageRN', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.gridParameters && annexure2.gridParameters.inputVoltageYN) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.gridParameters && annexure2.gridParameters.inputVoltageYN) || ''}
                    onChange={(e) => handleNestedChange('gridParameters', 'inputVoltageYN', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.gridParameters && annexure2.gridParameters.inputVoltageBN) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.gridParameters && annexure2.gridParameters.inputVoltageBN) || ''}
                    onChange={(e) => handleNestedChange('gridParameters', 'inputVoltageBN', e.target.value)}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section 1.2: Generation data */}
        <div className="p3-subheading">1.2 Generation data - ACDB / LT Panel</div>
        <table className="annexure-table" style={{ marginBottom: '2px' }}>
          <thead>
            <tr>
              <th style={{ width: '38%', textAlign: 'left', paddingLeft: '6px' }}>Description</th>
              <th style={{ width: '20%' }}>R – Phase</th>
              <th style={{ width: '21%' }}>Y - Phase</th>
              <th style={{ width: '21%' }}>B – Phase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ paddingLeft: '6px' }}>Output Voltage (V)</td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputVoltageRPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputVoltageRPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputVoltageRPhase', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputVoltageYPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputVoltageYPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputVoltageYPhase', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputVoltageBPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputVoltageBPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputVoltageBPhase', e.target.value)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '6px' }}>Output Current (I)</td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputCurrentRPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputCurrentRPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputCurrentRPhase', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputCurrentYPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputCurrentYPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputCurrentYPhase', e.target.value)}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ textAlign: 'center' }}>
                    {(annexure2.generationData && annexure2.generationData.outputCurrentBPhase) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    style={{ textAlign: 'center' }}
                    value={(annexure2.generationData && annexure2.generationData.outputCurrentBPhase) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputCurrentBPhase', e.target.value)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '6px' }}>Output in kW</td>
              <td colSpan={3}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ paddingLeft: '4px' }}>
                    {(annexure2.generationData && annexure2.generationData.outputInKW) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    value={(annexure2.generationData && annexure2.generationData.outputInKW) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'outputInKW', e.target.value)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '6px' }}>Monitoring Duration*</td>
              <td colSpan={3}>
                {readOnly ? (
                  <span className="doc-static-value" style={{ paddingLeft: '4px' }}>
                    {(annexure2.generationData && annexure2.generationData.monitoringDuration) || ''}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="doc-input"
                    value={(annexure2.generationData && annexure2.generationData.monitoringDuration) || ''}
                    onChange={(e) => handleNestedChange('generationData', 'monitoringDuration', e.target.value)}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: '8pt', marginBottom: '4px' }}>*Note: Minimum 3 hours & Above</div>

        {/* Section: Based on (Solar log) */}
        <div className="p3-subheading">Based on (Solar log)</div>
        <div style={{ fontSize: '8.5pt', marginBottom: '3px' }}>
          - Solar log report to be attached and reading for minimum 2 days to be recorded as below
        </div>

        <div style={{ position: 'relative' }}>
          <table className="annexure-table" style={{ marginBottom: '4px' }}>
            <thead>
              <tr>
                <th style={{ width: '13%', lineHeight: '1.15' }}>Solar Log<br />Nos</th>
                <th style={{ width: '15%' }}>Date</th>
                <th style={{ width: '14%' }}>Time from</th>
                <th style={{ width: '14%' }}>Time To</th>
                <th style={{ width: '15%', lineHeight: '1.15' }}>Guaranteed<br />Kwh</th>
                <th style={{ width: '15%' }}>Actual Kwh</th>
                <th style={{ width: '14%' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {(annexure2.solarLogReadings || [{}, {}, {}, {}]).map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.solarLogNos || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.solarLogNos || ''}
                        onChange={(e) => handleReadingChange(idx, 'solarLogNos', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.date || ''}</span>
                    ) : (
                      <input
                        type="date"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.date || ''}
                        onChange={(e) => handleReadingChange(idx, 'date', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.timeFrom || ''}</span>
                    ) : (
                      <input
                        type="time"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.timeFrom || ''}
                        onChange={(e) => handleReadingChange(idx, 'timeFrom', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.timeTo || ''}</span>
                    ) : (
                      <input
                        type="time"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.timeTo || ''}
                        onChange={(e) => handleReadingChange(idx, 'timeTo', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.guaranteedKwh || ''}</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.guaranteedKwh || ''}
                        onChange={(e) => handleReadingChange(idx, 'guaranteedKwh', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.actualKwh || ''}</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.actualKwh || ''}
                        onChange={(e) => handleReadingChange(idx, 'actualKwh', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.percentage || ''}</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.percentage || ''}
                        onChange={(e) => handleReadingChange(idx, 'percentage', e.target.value)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!readOnly && (
            <div className="table-action-bar no-print">
              <button
                type="button"
                className="btn-mini-action"
                onClick={handleAddReadingRow}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Section: Remarks */}
        <div className="remarks-box">
          <div>
            <strong><u>Remarks:</u></strong> Does any work is pending at the time of handover? if any please mention below,
          </div>
          {readOnly ? (
            <div className="doc-static-value" style={{ marginTop: '2px', minHeight: '32px' }}>
              {annexure2.remarks || ''}
            </div>
          ) : (
            <textarea
              rows={2}
              className="doc-textarea"
              style={{ marginTop: '2px' }}
              value={annexure2.remarks || ''}
              onChange={(e) => handleFieldChange('remarks', e.target.value)}
            />
          )}
        </div>

        {/* Section: Contractor Information & Signatures */}
        <table className="contractor-table">
          <tbody>
            <tr>
              <td style={{ width: '50%', height: '52px' }}>
                <div><strong>I&C Contractor Name, Address,</strong></div>
                <div><strong>Contact Person Name &</strong></div>
                <div><strong>Contact No.</strong></div>
              </td>
              <td style={{ width: '50%' }}>
                {readOnly ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <div className="doc-static-value" style={{ fontWeight: 'bold' }}>{annexure2.contractorName || ''}</div>
                    <div className="doc-static-value">{annexure2.contractorAddress || ''}</div>
                    <div className="doc-static-value">
                      {annexure2.contractorContactPerson ? `${annexure2.contractorContactPerson} ` : ''}
                      {annexure2.contractorContactNo ? `(${annexure2.contractorContactNo})` : ''}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <input
                      type="text"
                      placeholder="Contractor Name"
                      className="doc-input doc-input-underline"
                      value={annexure2.contractorName || ''}
                      onChange={(e) => handleFieldChange('contractorName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="doc-input doc-input-underline"
                      value={annexure2.contractorAddress || ''}
                      onChange={(e) => handleFieldChange('contractorAddress', e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Contact Person"
                        className="doc-input doc-input-underline"
                        style={{ width: '50%' }}
                        value={annexure2.contractorContactPerson || ''}
                        onChange={(e) => handleFieldChange('contractorContactPerson', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Contact No."
                        className="doc-input doc-input-underline"
                        style={{ width: '50%' }}
                        value={annexure2.contractorContactNo || ''}
                        onChange={(e) => handleFieldChange('contractorContactNo', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ height: '62px', verticalAlign: 'bottom' }}>
                <div style={{ marginBottom: '2px' }}>
                  <strong>I&C Contractor Sign, Seal & Date</strong>
                </div>
                {readOnly ? (
                  <div className="doc-static-value">{annexure2.contractorSignSealDate || ''}</div>
                ) : (
                  <input
                    type="text"
                    className="doc-input doc-input-underline"
                    value={annexure2.contractorSignSealDate || ''}
                    onChange={(e) => handleFieldChange('contractorSignSealDate', e.target.value)}
                  />
                )}
              </td>
              <td style={{ height: '72px', verticalAlign: 'bottom', position: 'relative' }}>
                <div style={{ marginBottom: '2px' }}>
                  <strong>Project Manager Sign & Date:</strong>
                </div>
                {/* Digital Signature Slot (Page 3 Right Bottom Corner) */}
                <div className="p3-digital-sig-slot" style={{ margin: '2px 0' }}>
                  {formData.digitalSignature ? (
                    <div className="sig-img-container">
                      <img src={formData.digitalSignature} alt="Digital Signature" className="customer-digital-sig-img" />
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
                        title="Draw, type, or upload digital signature"
                      >
                        <PenTool size={12} color="#1b69b3" />
                        <span>✍️ Add Signature</span>
                      </button>
                    )
                  )}
                </div>
                {readOnly ? (
                  <div className="doc-static-value">{annexure2.projectManagerSignDate || ''}</div>
                ) : (
                  <input
                    type="text"
                    className="doc-input doc-input-underline"
                    value={annexure2.projectManagerSignDate || ''}
                    onChange={(e) => handleFieldChange('projectManagerSignDate', e.target.value)}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="page-doc-footer">
        <div className="page-number">3</div>
        <div className="copyright-text">© Tata Power Renewable Energy Limited</div>
      </div>
    </div>
  );
}
