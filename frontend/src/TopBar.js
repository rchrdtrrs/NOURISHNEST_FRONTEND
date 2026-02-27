import React from 'react';
import './App.css';

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">NourishNest</span>
      </div>
      <div className="topbar-icons">
        <span className="topbar-icon">🔔</span>
        <span className="topbar-icon">☰</span>
      </div>
    </div>
  );
}

export default TopBar;
