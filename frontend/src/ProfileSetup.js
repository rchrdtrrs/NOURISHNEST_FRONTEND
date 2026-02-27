import React, { useState } from 'react';
import './App.css';

function ProfileSetup({ onNext }) {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [diet, setDiet] = useState('');
  const [error, setError] = useState(null);

  const handleNext = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/me/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nourishnest_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height,
          age,
          dietary_preferences: diet,
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      onNext && onNext();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{position:'relative', overflow:'hidden', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      {/* Playful background shapes */}
      <div style={{
        position: 'absolute',
        top: '-80px', left: '-80px',
        width: '220px', height: '220px',
        background: 'rgba(106,255,122,0.18)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px', right: '-100px',
        width: '260px', height: '260px',
        background: 'rgba(255,106,106,0.13)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      {/* Progress bar */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        height: 10,
        background: 'rgba(255,255,255,0.4)',
        borderRadius: 8,
        marginBottom: 32,
        marginTop: 24,
        overflow: 'hidden',
        boxShadow: '0 2px 8px #ffb36a33',
        zIndex: 2,
      }}>
        <div style={{
          width: '33%',
          height: '100%',
          background: 'linear-gradient(90deg, #6aff7a 0%, #ffb36a 100%)',
          borderRadius: 8,
          transition: 'width 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
        }} />
      </div>
      <div className="logo" style={{zIndex:2}}>
        <h1 style={{color:'#fff', textShadow:'0 2px 16px #ffb36a'}}>NourishNest <span role="img" aria-label="leaf">🍃</span></h1>
      </div>
      <div className="card profile-setup-card" style={{width:'100%', maxWidth:'400px', zIndex:2, background:'rgba(255,255,255,0.97)', border:'4px solid #6aff7a', padding:'32px 18px'}}>
        <h2 style={{color:'#2d7a46', marginBottom:'24px', letterSpacing:1}}>Profile Setup</h2>
        <div className="input-row">
          <span style={{fontSize:'1.5rem'}}>📏</span>
          <input type="number" placeholder="Height (cm)" value={height} onChange={e=>setHeight(e.target.value)} />
        </div>
        <div className="input-row">
          <span style={{fontSize:'1.5rem'}}>🎂</span>
          <input type="number" placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
        </div>
        <div className="input-row">
          <span style={{fontSize:'1.5rem'}}>🥗</span>
          <input type="text" placeholder="Dietary Preferences" value={diet} onChange={e=>setDiet(e.target.value)} />
        </div>
        {error && <div style={{color:'#ff6a6a', marginBottom:'8px'}}>{error}</div>}
        <button className="button-main green" style={{width:'100%', fontSize:'1.2rem', border:'3px solid #ff6a6a', color:'#2d7a46', marginTop:'8px'}} onClick={handleNext}>
          Next ➡️
        </button>
      </div>
      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .profile-setup-card { padding: 18px 4vw !important; }
          .logo h1 { font-size: 2rem !important; }
        }
        .input-row {
          width: 100%;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .input-row input {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

export default ProfileSetup;
