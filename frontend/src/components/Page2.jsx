import React from 'react';
import CommonHeader from './CommonHeader';

export default function Page2({ formData, onChange, readOnly = false }) {
  const annexure1 = formData.annexure1 || {};

  const handleFieldChange = (field, value) => {
    if (readOnly) return;
    onChange('annexure1', {
      ...annexure1,
      [field]: value
    });
  };

  const handleArrayChange = (tableKey, index, key, value) => {
    if (readOnly) return;
    const list = [...(annexure1[tableKey] || [])];
    list[index] = {
      ...list[index],
      [key]: value
    };
    onChange('annexure1', {
      ...annexure1,
      [tableKey]: list
    });
  };

  const handleAddRow = (tableKey, emptyItem) => {
    if (readOnly) return;
    const list = [...(annexure1[tableKey] || []), emptyItem];
    onChange('annexure1', {
      ...annexure1,
      [tableKey]: list
    });
  };

  const handleBatterySerialChange = (index, value) => {
    if (readOnly) return;
    const serials = [...(annexure1.batterySerialNumbers || Array(20).fill(''))];
    serials[index] = value;
    onChange('annexure1', {
      ...annexure1,
      batterySerialNumbers: serials
    });
  };

  return (
    <div className="a4-page" id="page-2">
      <div className="page-content">
        <CommonHeader />

        <div className="p2-title">Annexure - 1</div>

        {/* Intro Row */}
        <div className="p2-intro-row">
          <div style={{ width: '55%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '130px', flexShrink: 0 }}>Customer Name &</span>
              {readOnly ? (
                <span className="doc-static-value" style={{ fontWeight: 'bold' }}>{annexure1.customerName || ''}</span>
              ) : (
                <input
                  type="text"
                  className="doc-input doc-input-underline"
                  value={annexure1.customerName || ''}
                  onChange={(e) => handleFieldChange('customerName', e.target.value)}
                />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '130px', flexShrink: 0 }}>Location:</span>
              {readOnly ? (
                <span className="doc-static-value">{annexure1.location || ''}</span>
              ) : (
                <input
                  type="text"
                  className="doc-input doc-input-underline"
                  value={annexure1.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              )}
            </div>
          </div>
          <div style={{ width: '43%', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, marginRight: '6px' }}>Project Capacity in KWp:</span>
            {readOnly ? (
              <span className="doc-static-value" style={{ fontWeight: 'bold' }}>{annexure1.projectCapacityKWp || ''}</span>
            ) : (
              <input
                type="text"
                className="doc-input doc-input-underline"
                value={annexure1.projectCapacityKWp || ''}
                onChange={(e) => handleFieldChange('projectCapacityKWp', e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Table 1: Solar Module Make */}
        <div style={{ position: 'relative' }}>
          <table className="annexure-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Solar Module Make</th>
                <th style={{ width: '30%' }}>Capacity in Wp</th>
                <th style={{ width: '30%' }}>Quantity in Nos.</th>
              </tr>
            </thead>
            <tbody>
              {(annexure1.solarModules || [{ make: '', capacityWp: '', quantity: '' }]).map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.make || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.make || ''}
                        onChange={(e) => handleArrayChange('solarModules', idx, 'make', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.capacityWp || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.capacityWp || ''}
                        onChange={(e) => handleArrayChange('solarModules', idx, 'capacityWp', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.quantity || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.quantity || ''}
                        onChange={(e) => handleArrayChange('solarModules', idx, 'quantity', e.target.value)}
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
                onClick={() => handleAddRow('solarModules', { make: '', capacityWp: '', quantity: '' })}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Table 2: Solar Power conditioning Units Make */}
        <div style={{ position: 'relative' }}>
          <table className="annexure-table">
            <thead>
              <tr>
                <th style={{ width: '30%', lineHeight: '1.15' }}>
                  Solar Power<br />
                  conditioning Units<br />
                  Make
                </th>
                <th style={{ width: '22%' }}>Rating</th>
                <th style={{ width: '22%' }}>Quantity in Nos.</th>
                <th style={{ width: '26%' }}>Serial Nos</th>
              </tr>
            </thead>
            <tbody>
              {(annexure1.solarPowerConditioningUnits || [{}, {}, {}, {}]).map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.make || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.make || ''}
                        onChange={(e) => handleArrayChange('solarPowerConditioningUnits', idx, 'make', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.rating || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.rating || ''}
                        onChange={(e) => handleArrayChange('solarPowerConditioningUnits', idx, 'rating', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.quantity || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.quantity || ''}
                        onChange={(e) => handleArrayChange('solarPowerConditioningUnits', idx, 'quantity', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.serialNos || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.serialNos || ''}
                        onChange={(e) => handleArrayChange('solarPowerConditioningUnits', idx, 'serialNos', e.target.value)}
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
                onClick={() => handleAddRow('solarPowerConditioningUnits', { make: '', rating: '', quantity: '', serialNos: '' })}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Table 3: Solar Log Make */}
        <div style={{ position: 'relative' }}>
          <table className="annexure-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Solar Log Make</th>
                <th style={{ width: '22%' }}>Rating</th>
                <th style={{ width: '22%' }}>Quantity in Nos.</th>
                <th style={{ width: '26%' }}>Serial Nos</th>
              </tr>
            </thead>
            <tbody>
              {(annexure1.solarLogs || [{}, {}]).map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.make || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.make || ''}
                        onChange={(e) => handleArrayChange('solarLogs', idx, 'make', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.rating || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.rating || ''}
                        onChange={(e) => handleArrayChange('solarLogs', idx, 'rating', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.quantity || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.quantity || ''}
                        onChange={(e) => handleArrayChange('solarLogs', idx, 'quantity', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.serialNos || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.serialNos || ''}
                        onChange={(e) => handleArrayChange('solarLogs', idx, 'serialNos', e.target.value)}
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
                onClick={() => handleAddRow('solarLogs', { make: '', rating: '', quantity: '', serialNos: '' })}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Table 4: ACDB Make */}
        <div style={{ position: 'relative' }}>
          <table className="annexure-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>ACDB Make</th>
                <th style={{ width: '22%' }}>Rating</th>
                <th style={{ width: '22%' }}>Quantity in Nos.</th>
                <th style={{ width: '26%' }}>Serial Nos</th>
              </tr>
            </thead>
            <tbody>
              {(annexure1.acdb || [{}, {}]).map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.make || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.make || ''}
                        onChange={(e) => handleArrayChange('acdb', idx, 'make', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.rating || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.rating || ''}
                        onChange={(e) => handleArrayChange('acdb', idx, 'rating', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.quantity || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.quantity || ''}
                        onChange={(e) => handleArrayChange('acdb', idx, 'quantity', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.serialNos || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.serialNos || ''}
                        onChange={(e) => handleArrayChange('acdb', idx, 'serialNos', e.target.value)}
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
                onClick={() => handleAddRow('acdb', { make: '', rating: '', quantity: '', serialNos: '' })}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Table 5: Batteries Make */}
        <div style={{ position: 'relative' }}>
          <table className="annexure-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Batteries Make</th>
                <th style={{ width: '25%' }}>Battery Voltage, Ah</th>
                <th style={{ width: '28%' }}>Charging Voltage, Current</th>
                <th style={{ width: '22%' }}>Quantity in Nos.</th>
              </tr>
            </thead>
            <tbody>
              {(annexure1.batteries || [{}]).map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.make || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.make || ''}
                        onChange={(e) => handleArrayChange('batteries', idx, 'make', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.batteryVoltageAh || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.batteryVoltageAh || ''}
                        onChange={(e) => handleArrayChange('batteries', idx, 'batteryVoltageAh', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className="doc-static-value">{row.chargingVoltageCurrent || ''}</span>
                    ) : (
                      <input
                        type="text"
                        className="doc-input"
                        value={row.chargingVoltageCurrent || ''}
                        onChange={(e) => handleArrayChange('batteries', idx, 'chargingVoltageCurrent', e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {readOnly ? (
                      <span className="doc-static-value" style={{ textAlign: 'center' }}>{row.quantity || ''}</span>
                    ) : (
                      <input
                        type="number"
                        className="doc-input"
                        style={{ textAlign: 'center' }}
                        value={row.quantity || ''}
                        onChange={(e) => handleArrayChange('batteries', idx, 'quantity', e.target.value)}
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
                onClick={() => handleAddRow('batteries', { make: '', batteryVoltageAh: '', chargingVoltageCurrent: '', quantity: '' })}
              >
                + Row
              </button>
            </div>
          )}
        </div>

        {/* Battery Serial Numbers Grid */}
        <div style={{ fontSize: '9pt', margin: '4px 0 2px 0' }}>Batteries Serial Nos.:</div>
        <table className="battery-serial-table">
          <tbody>
            {[0, 1, 2, 3, 4].map((rowIndex) => (
              <tr key={rowIndex}>
                {[0, 1, 2, 3].map((colIndex) => {
                  const cellIndex = rowIndex * 4 + colIndex;
                  const value = (annexure1.batterySerialNumbers && annexure1.batterySerialNumbers[cellIndex]) || '';
                  return (
                    <td key={colIndex}>
                      {readOnly ? (
                        <span className="doc-static-value" style={{ textAlign: 'center', fontSize: '8.5pt' }}>
                          {value}
                        </span>
                      ) : (
                        <input
                          type="text"
                          className="doc-input"
                          style={{ textAlign: 'center', fontSize: '8.5pt' }}
                          value={value}
                          onChange={(e) => handleBatterySerialChange(cellIndex, e.target.value)}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page-doc-footer">
        <div className="page-number">2</div>
        <div className="copyright-text">© Tata Power Renewable Energy Limited</div>
      </div>
    </div>
  );
}
