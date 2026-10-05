import React from 'react';
import brandLogo from '../assets/brand-logo.png';

export default function CommonHeader() {
  return (
    <div className="common-doc-header">
      <div className="doc-header-inner">
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
      </div>
    </div>
  );
}
