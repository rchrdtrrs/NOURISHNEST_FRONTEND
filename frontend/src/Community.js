import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { UserContext } from './UserContext';

function Community({ token }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { badges, streak, userProfile, aiUsage, maxAiUsage } = useContext(UserContext);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/v1/community/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch community posts');
        return res.json();
      })
      .then(data => setPosts(data.results || data))
      .catch(err => setError(err.message));
  }, [token]);

  return (
    <div className="card" style={{position:'relative', overflow:'hidden'}}>
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
      <div className="logo" style={{justifyContent:'flex-start', zIndex:1}}>
        <span style={{fontFamily:'Fredoka One', fontSize:'1.5rem', color:'#2d7a46'}}>Community</span>
      </div>
      {/* Gamification: Show streak and badges */}
      <div style={{ marginBottom: 16, zIndex: 1 }}>
        <span style={{ background: '#eaf6ef', borderRadius: 12, padding: '6px 14px', marginRight: 8 }}>
          🏆 Streak: {streak} days
        </span>
        {badges.map(badge => (
          <span key={badge} style={{ background: '#ffb36a22', borderRadius: 12, padding: '6px 14px', marginRight: 8 }}>
            {badge}
          </span>
        ))}
      </div>
      {/* Subscription/AI usage */}
      <div style={{ marginBottom: 16, zIndex: 1 }}>
        <span style={{ color: userProfile.subscription === 'premium' ? '#23c483' : '#ff6a6a' }}>
          {userProfile.subscription === 'premium' ? 'NourishNest+' : 'Free'} • AI Usage: {aiUsage}/{maxAiUsage}
        </span>
        {userProfile.subscription !== 'premium' && (
          <button className="button-main" style={{ marginLeft: 12, fontSize: '0.9rem', padding: '8px 18px' }}>
            Upgrade
          </button>
        )}
      </div>
      {error && <div style={{color:'#ff6a6a', margin:'8px 0', zIndex:1}}>Error: {error}</div>}
      <ul style={{listStyle:'none', padding:0, zIndex:1, position:'relative'}}>
        {posts.map(post => (
          <li key={post.id} style={{background:'#ffb36a22', borderRadius:'16px', boxShadow:'0 2px 8px #ffb36a33', marginBottom:'16px', padding:'16px'}}>
            <div style={{fontWeight:'bold', fontSize:'1.1rem', color:'#2d7a46', marginBottom:'6px', fontFamily:'Fredoka One'}}>
              🌱 {post.title}
              {/* Fork button for recipe adaptation */}
              {post.canFork && (
                <button className="button-main green" style={{ marginLeft: 12, fontSize: '0.9rem', padding: '6px 14px' }}>
                  Fork
                </button>
              )}
            </div>
            <div style={{color:'#ff6a6a', fontSize:'1rem', fontFamily:'Quicksand'}}>{post.content}</div>
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

export default Community;
