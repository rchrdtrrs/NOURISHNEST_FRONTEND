import React, { useEffect, useState } from 'react';
import './App.css';

function PayPal({ token }) {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/v1/paypal/status/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch PayPal status'))
      .then(data => setStatus(data.status || 'Unknown'))
      .catch(err => setError('Error fetching PayPal status'));
  }, [token]);

  return (
    <div className="card" style={{position:'relative', overflow:'hidden', textAlign:'center'}}>
      {/* Playful background shapes */}
      <div style={{
        position: 'absolute',
        top: '-60px', left: '-60px',
        width: '160px', height: '160px',
        background: 'rgba(255,182,106,0.13)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', right: '-80px',
        width: '180px', height: '180px',
        background: 'rgba(106,255,122,0.10)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <h2 style={{ fontFamily: 'Fredoka One, Arial', color: '#2d7a46', zIndex:1, position:'relative' }}>PayPal Integration</h2>
      {error && <div style={{color:'#ff6a6a', margin:'8px 0', zIndex:1}}> {error} </div>}
      <p style={{ fontSize: '1.2rem', color: '#ff6a6a', zIndex:1, position:'relative' }}>Status: {status}</p>
      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .card { padding: 18px 4vw !important; }
          h2 { font-size: 1.2rem !important; }
        }
      `}</style>
    </div>
  );
}

export default PayPal;
