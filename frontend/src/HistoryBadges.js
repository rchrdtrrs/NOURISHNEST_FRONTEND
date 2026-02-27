import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import './App.css';

export default function HistoryBadges() {
  const { streak, history, badges } = useContext(UserContext);

  return (
    <div className="card" style={{maxWidth:600,margin:'40px auto',padding:'40px 32px',boxShadow:'0 16px 64px #ff1e5633, 0 2px 24px #23c48333'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:'2rem'}}>🍳</span>
          <h2 style={{fontFamily:'Fredoka One',color:'#2d7a46',margin:0}}>Cooking Streak</h2>
        </div>
        <span style={{fontFamily:'Fredoka One',color:'#ff1e56',fontSize:'1.3rem'}}>{streak} Days</span>
      </div>
      <hr style={{margin:'16px 0'}} />
      <div style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:12}}>Past Recipes</div>
      <div style={{marginBottom:24}}>
        {history.length === 0 ? (
          <div style={{color:'#aaa',fontFamily:'Quicksand'}}>No recipes yet.</div>
        ) : (
          history.slice(0,3).map((r,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:16,marginBottom:12}}>
              <span style={{fontSize:'2rem'}}>🍲</span>
              <span style={{fontFamily:'Quicksand',fontSize:'1.1rem',color:'#2d7a46'}}>Spinach Chicken Stir fry</span>
              <span style={{color:'#ffb36a',fontSize:'1.2rem'}}>★★★★★</span>
            </div>
          ))
        )}
      </div>
      <hr style={{margin:'16px 0'}} />
      <div style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:12}}>Badges Earned</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
        {badges.length === 0 ? (
          <div style={{color:'#aaa',fontFamily:'Quicksand'}}>No badges yet.</div>
        ) : (
          badges.map((b,i) => (
            <div key={i} className="badge" style={{display:'flex',alignItems:'center',gap:8,background:'linear-gradient(90deg,#ffb36a 0%,#23c483 100%)',color:'#fff',fontSize:'1.1rem',padding:'10px 22px',borderRadius:'20px',boxShadow:'0 2px 8px #ffb36a22'}}>
              <span style={{fontSize:'1.3rem'}}>{b.emoji}</span> {b.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
