import React from 'react';
import { Camera, MapPin, Clock, ShieldCheck } from 'lucide-react';
import CommonHeader from './CommonHeader';

export default function Page4({
  formData,
  onChange,
  readOnly = false,
  onOpenSelfieModal
}) {
  const hasSelfie = Boolean(formData?.geoTaggedSelfie);

  return (
    <div className="a4-page" id="page-4">
      <div className="page-content">
        {/* Standard Tata Power Header */}
        <CommonHeader readOnly={readOnly} />

        {/* Page Title & Subtitle */}
        <div className="p4-header-block">
          <div className="p4-title">SITE COMMISSIONING GEO-TAGGED PHOTOGRAPH</div>
          <div className="p4-subtitle">
            Mandatory Commissioning Verification Record with Real-Time GPS Coordinates & Timestamp
          </div>
        </div>

        {/* Exact 500px X 500px Site Selfie Container */}
        <div className="page4-selfie-wrapper">
          <div className="page4-selfie-frame-500">
            {hasSelfie ? (
              <img
                src={formData.geoTaggedSelfie}
                alt="Site Commissioning Geo-Tagged Photograph"
                className="page4-selfie-img-500"
              />
            ) : (
              <div
                className="page4-selfie-placeholder-500"
                onClick={!readOnly ? onOpenSelfieModal : undefined}
                style={{ cursor: !readOnly ? 'pointer' : 'default' }}
              >
                <Camera size={54} color="#0f4c81" />
                <div className="placeholder-title">Geo-Tagged Site Commissioning Photo</div>
                <div className="placeholder-sub">
                  Required 500px × 500px Site Photographic Verification
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    className="btn-page4-capture no-print"
                    onClick={onOpenSelfieModal}
                  >
                    <Camera size={15} />
                    <span>Capture Geo-Tagged Selfie Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Site Verification Metadata Table */}
        <div className="p4-table-wrapper">
          <table className="p4-metadata-table">
            <tbody>
              <tr>
                <td className="p4-lbl">Customer Name</td>
                <td className="p4-val p4-val-bold">{formData.customerName || 'N/A'}</td>
                <td className="p4-lbl">SO No. / Order No.</td>
                <td className="p4-val p4-val-bold">{formData.soNo || 'N/A'}</td>
              </tr>
              <tr>
                <td className="p4-lbl">GPS Coordinates</td>
                <td className="p4-val">
                  <span className="p4-mono-tag">
                    📍 {formData.latitudeLongitude || formData.selfieGpsCoords || 'Lat: 18.7981° N, Long: 73.8052° E'}
                  </span>
                </td>
                <td className="p4-lbl">Capture Timestamp</td>
                <td className="p4-val">
                  <span className="p4-mono-tag">
                    🕒 {formData.selfieTimestamp || new Date().toLocaleString()}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p4-lbl">System Capacity</td>
                <td className="p4-val">
                  {formData.systemCapacityKWp ? `${formData.systemCapacityKWp} KWp` : 'N/A'}
                </td>
                <td className="p4-lbl">System Type</td>
                <td className="p4-val">{formData.systemType || 'Grid connect'}</td>
              </tr>
              <tr>
                <td className="p4-lbl">Commissioning Site</td>
                <td className="p4-val" colSpan="3">
                  {formData.locationOfPlant || formData.customerAddress || 'Customer Installation Premises'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Compliance Statement & Signatures */}
        <div className="p4-verification-block">
          <div className="p4-declaration-text">
            <strong>Verification Declaration:</strong> I hereby certify that the solar photovoltaic plant illustrated in the above 500px × 500px geo-tagged photograph has been physically inspected, tested, commissioned, and synchronized in accordance with the official Tata Power Renewable Energy Limited standards and statutory grid regulations.
          </div>

          <div className="p4-signatures-row">
            <div className="p4-sig-cell">
              <div className="p4-sig-space">
                {formData.digitalSignature ? (
                  <img
                    src={formData.digitalSignature}
                    alt="Customer Digital Signature"
                    className="p4-sig-img"
                  />
                ) : (
                  <div className="p4-sig-empty">
                    {formData.customerSignatureName || formData.contactPersonName || 'Customer Signature'}
                  </div>
                )}
              </div>
              <div className="p4-sig-caption">Signature of Customer / Representative</div>
            </div>

            <div className="p4-sig-cell">
              <div className="p4-sig-space">
                <div className="p4-sig-text-stamp">
                  {formData.tprelCommissioningRepName || 'Tata Power Commissioning Officer'}
                </div>
              </div>
              <div className="p4-sig-caption">TPREL Commissioning Engineer</div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="doc-footer-row">
          <span className="footer-left">Tata Power Renewable Energy Limited</span>
          <span className="footer-right">Page 4 of 4</span>
        </div>
      </div>
    </div>
  );
}
