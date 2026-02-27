import React from 'react';

// A playful SVG logo: leafy green with a heart for health
function HealthVeggieLogo({ style = {}, className = '' }) {
  return (
    <svg
      width="160"
      height="120"
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-60%)', zIndex: 0, ...style }}
      className={className}
    >
      {/* Leafy green base */}
      <ellipse cx="80" cy="80" rx="60" ry="32" fill="#23c483" fillOpacity="0.18" />
      {/* Carrot body */}
      <rect x="70" y="40" width="20" height="40" rx="10" fill="#ffac41" fillOpacity="0.7" />
      {/* Carrot top */}
      <path d="M80 40 C75 30, 85 30, 80 40" stroke="#23c483" strokeWidth="6" fill="none" />
      {/* Heart for health */}
      <path d="M80 70 C80 65, 90 65, 90 70 C90 75, 80 80, 80 85 C80 80, 70 75, 70 70 C70 65, 80 65, 80 70 Z" fill="#ff1e56" fillOpacity="0.7" />
    </svg>
  );
}

export default HealthVeggieLogo;
