import React from 'react';
import './Navbar.css';

function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <button onClick={() => setPage('profile')}>Profile</button>
      <button onClick={() => setPage('recipes')}>Recipes</button>
      <button onClick={() => setPage('inventory')}>Inventory</button>
      <button onClick={() => setPage('paypal')}>PayPal</button>
      <button onClick={() => setPage('community')}>Community</button>
    </nav>
  );
}

export default Navbar;
