import React, { useEffect, useState } from 'react';
import './App.css';

function Inventory({ token }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/v1/inventory/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch inventory');
        return res.json();
      })
      .then(data => setItems(data.results || data))
      .catch(err => setError(err.message));
  }, [token]);

  return (
    <div className="card" style={{position:'relative', overflow:'hidden'}}>
      {/* Playful background shapes */}
      <div style={{
        position: 'absolute',
        top: '-60px', left: '-60px',
        width: '160px', height: '160px',
        background: 'rgba(106,255,122,0.13)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', right: '-80px',
        width: '180px', height: '180px',
        background: 'rgba(255,106,106,0.10)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div className="logo" style={{justifyContent:'flex-start', zIndex:1}}>
        <span style={{fontFamily:'Fredoka One', fontSize:'1.5rem', color:'#2d7a46'}}>Inventory</span>
      </div>
      {error && <div style={{color:'#ff6a6a', margin:'8px 0', zIndex:1}}>Error: {error}</div>}
      <ul className="inventory-list" style={{zIndex:1, position:'relative'}}>
        {items.map(item => (
          <li key={item.id}>
            <img className="inventory-img" src={item.img || 'https://img.icons8.com/color/96/spinach.png'} alt={item.name} />
            <span className="inventory-name">{item.name}</span>
            <span className="inventory-qty">Qty: {item.quantity}</span>
          </li>
        ))}
      </ul>
      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .card { padding: 18px 4vw !important; }
          .logo span { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Inventory;
