import React from 'react';
import { Camera } from 'lucide-react';
import brandLogo from '../assets/brand-logo.png';

export default function CommonHeader({
  geoTaggedSelfie,
  latitudeLongitude,
  readOnly = false,
  onOpenSelfieModal,
  showSelfieSlot = false
}) {
  return (
    <div className="common-doc-header">
      <div className={`doc-header-inner ${showSelfieSlot ? 'has-selfie-slot' : ''}`}>
        {/* Left: Brand Logo */}
        <div className="doc-brand-logo-wrap">
          <img src={brandLogo} alt="Tata Power Renewable Energy Logo" className="doc-brand-logo" />
        </div>

        {/* Center: Official Title & Address */}
        <div className="doc-header-text">
          <div className="tata-brand-heading">TATA POWER RENEWABLE ENERGY</div>
          <div className="tata-brand-address">
            The Tata Power Company Limited, Corporate Center B, 34, Sant Tukaram Road, Carnac Bunder, Mumbai 400009
          </div>
        </div>

        {/* Right: Integrated Top-Right Geo Selfie Slot (Page 1 Only) */}
        {showSelfieSlot && (
          <div className="doc-header-selfie-slot">
            {geoTaggedSelfie ? (
              <div className="selfie-header-badge">
                <img src={geoTaggedSelfie} alt="Site Geo Selfie" className="selfie-badge-img" />
                <div className="selfie-mini-gps-tag" title={latitudeLongitude || 'GPS Stamped'}>
                  📍 {latitudeLongitude ? latitudeLongitude.split(',')[0] : 'GPS Stamped'}
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    className="btn-edit-selfie-pill no-print"
                    onClick={onOpenSelfieModal}
                    title="Retake Geo Selfie"
                  >
                    📸 Retake
                  </button>
                )}
              </div>
            ) : (
              !readOnly && (
                <button
                  type="button"
                  className="btn-add-geo-selfie-box no-print"
                  onClick={onOpenSelfieModal}
                  title="Capture Geo-Tagged Selfie with GPS Coordinates & Timestamp"
                >
                  <Camera size={13} color="#0ea5e9" />
                  <span>Instant Selfie</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
