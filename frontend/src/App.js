import React, { useEffect, useState, useContext, useRef } from 'react';
import './App.css';
import Navbar from './Navbar';
import Recipes from './Recipes';
import Inventory from './Inventory';
import PayPal from './PayPal';
import Community from './Community';
import TopBar from './TopBar';
import Login from './Login';
import Register from './Register';
import HealthVeggieLogo from './HealthVeggieLogo';
import { UserProvider, UserContext } from './UserContext';
import HistoryBadges from './HistoryBadges';

function Profile({ token }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { avatar, userColor, userProfile, setUserProfile } = useContext(UserContext);
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/v1/users/me/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, [token]);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Change avatar emoji
  const handleAvatarChange = () => {
    const avatarList = ['🦊','🐻','🐯','🦁','🐸','🐧','🦄','🐼','🐨','🐙','🦉','🐝','🦋','🐢','🐳','🦕','🦖','🦩','🦚','🦜'];
    let newAvatar = avatar;
    while (newAvatar === avatar) {
      newAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];
    }
    setUserProfile(prev => ({ ...prev, avatar: newAvatar }));
  };

  return (
    <div className="card" style={{position:'relative', overflow:'hidden', maxWidth:'900px', margin:'40px auto', display:'flex', alignItems:'flex-start', boxShadow:'0 24px 96px #ff1e5633, 0 4px 32px #23c48333'}}>
      {/* Playful background shapes */}
      <div style={{position:'absolute',top:'-60px',left:'-60px',width:'160px',height:'160px',background:'rgba(255,106,106,0.13)',borderRadius:'50%',filter:'blur(2px)',zIndex:0}} />
      <div style={{position:'absolute',bottom:'-80px',right:'-80px',width:'180px',height:'180px',background:'rgba(106,255,122,0.10)',borderRadius:'50%',filter:'blur(2px)',zIndex:0}} />
      <div style={{minWidth:120,marginRight:40,display:'flex',flexDirection:'column',alignItems:'center',zIndex:1,position:'relative'}}>
        <div style={{position:'relative',cursor:'pointer'}} onClick={handleAvatarChange} title="Click to randomize avatar">
          {photo ? (
            <img src={photo} alt="Profile" style={{width:100,height:100,borderRadius:'50%',objectFit:'cover',border:`4px solid ${userColor}`,boxShadow:'0 2px 12px #ffb36a33'}} />
          ) : (
            <span style={{fontSize:'4rem',background:userColor,padding:'22px',borderRadius:'50%',boxShadow:'0 2px 12px #ffb36a33',display:'inline-block'}}>{avatar}</span>
          )}
          <button onClick={()=>fileInputRef.current.click()} style={{position:'absolute',bottom:-8,right:-8,background:'#fff',border:'2px solid #ffb36a',borderRadius:'50%',padding:8,cursor:'pointer',boxShadow:'0 2px 8px #ffb36a33'}}>📷</button>
          <input type="file" accept="image/*" style={{display:'none'}} ref={fileInputRef} onChange={handlePhotoChange} />
        </div>
      </div>
      <div style={{flex:1,zIndex:1,position:'relative'}}>
        <h2 style={{fontFamily:'Fredoka One',color:'#2d7a46',fontSize:'2.5rem',margin:'0 0 18px 0'}}>User Profile</h2>
        {error && <div style={{color:'#ff1e56',marginBottom:'8px',fontWeight:'bold'}}>Error: {error}</div>}
        {profile ? (
          <div style={{fontFamily:'Quicksand',fontSize:'1.25rem'}}>
            <div style={{fontFamily:'Fredoka One',color:'#ff1e56',fontSize:'1.5rem',marginBottom:'8px'}}>{profile.username}</div>
            <div style={{color:'#2d7a46',marginBottom:'8px'}}>Email: <b>{profile.email}</b></div>
            <div style={{color:'#ffb36a',marginBottom:'8px'}}>Subscription: <b>{profile.subscription_type}</b></div>
            <div style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:'8px'}}>Health Profile:</div>
            <ul style={{background:'rgba(255,255,255,0.9)',borderRadius:'18px',padding:'18px 28px',boxShadow:'0 2px 12px #ffb36a22',fontSize:'1.1rem'}}>
              <li>Allergies: <b>{profile.health_profile?.allergies?.join(', ') || 'None'}</b></li>
              <li>Dietary Restrictions: <b>{profile.health_profile?.dietary_restrictions?.join(', ') || 'None'}</b></li>
              <li>Health Goals: <b>{profile.health_profile?.health_goals?.join(', ') || 'None'}</b></li>
              <li>Calorie Target: <b>{profile.health_profile?.calorie_target || 'N/A'}</b></li>
            </ul>
          </div>
        ) : (
          <div style={{color:'#2d7a46',fontFamily:'Quicksand'}}>Loading profile...</div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const { avatar, userColor } = useContext(UserContext);
  return (
    <div>
      <div className="hero" style={{marginBottom:48,display:'flex',alignItems:'center',gap:32}}>
        <span style={{fontSize:'4.5rem',background:userColor,padding:'24px',borderRadius:'50%',boxShadow:'0 2px 16px #ffb36a33'}}>{avatar}</span>
        <div>
          <h1 style={{color:'#fff',fontSize:'4.5rem',margin:0,fontFamily:'Fredoka One',textShadow:'2px 2px 0 #ffb36a, 0 8px 32px #23c48399'}}>NourishNest</h1>
          <p style={{fontSize:'2rem',color:'#fff9f3',marginTop:24,fontFamily:'Quicksand'}}>Your healthy living companion <span style={{fontSize:'2.5rem'}}>🌱</span></p>
        </div>
      </div>
      <div className="main-grid">
        <div className="card" style={{background:'linear-gradient(120deg,#fff9f3 60%,#ffb36a 100%)',border:'3px solid #ffb36a'}}>
          <h2 style={{color:'#ff1e56'}}>🥗 Personalized Recipes</h2>
          <p style={{fontFamily:'Quicksand',fontSize:'1.2rem',color:'#2d7a46'}}>AI-powered, nutrition-optimized, and always delicious. Get meal ideas that fit your goals and inventory!</p>
        </div>
        <div className="card" style={{background:'linear-gradient(120deg,#fff9f3 60%,#23c483 100%)',border:'3px solid #23c483'}}>
          <h2 style={{color:'#ff1e56'}}>🛒 Smart Inventory</h2>
          <p style={{fontFamily:'Quicksand',fontSize:'1.2rem',color:'#2d7a46'}}>Track your pantry with instant updates, smart tags, and zero waste. Add, remove, and tag with a click!</p>
        </div>
        <div className="card" style={{background:'linear-gradient(120deg,#fff9f3 60%,#b36aff 100%)',border:'3px solid #b36aff'}}>
          <h2 style={{color:'#ff1e56'}}>💬 Community</h2>
          <p style={{fontFamily:'Quicksand',fontSize:'1.2rem',color:'#2d7a46'}}>Share, fork, and celebrate recipes. Earn badges, streaks, and connect with other healthy eaters!</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('nourishnest_token'));
  const [showRegister, setShowRegister] = useState(false);
  // Feedback state for demo
  const [feedback, setFeedback] = useState([]);

  const handleLogin = (jwt) => {
    setToken(jwt);
    setPage('home');
    setShowRegister(false);
  };

  const handleRegister = () => {
    setShowRegister(false);
    // Optionally, show a success message or auto-login
  };

  // Add navigation for new pages
  const renderPage = () => {
    if (page === 'home') return <Home />;
    if (page === 'profile') return <Profile token={token} />;
    if (page === 'recipes') return <Recipes token={token} onFeedback={f=>setFeedback(prev=>[f,...prev])} />;
    if (page === 'inventory') return <Inventory token={token} />;
    if (page === 'paypal') return <PayPal token={token} />;
    if (page === 'community') return <Community token={token} />;
    if (page === 'history') return <HistoryBadges />;
    // Remove FeedbackRating page, as feedback is now handled in Recipes.js
    return null;
  };

  if (!token) {
    if (showRegister) {
      return <Register onRegister={handleRegister} onBack={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onSignup={() => setShowRegister(true)} />;
  }

  return (
    <div className="app-container" style={{
      background: 'radial-gradient(circle at 70% 20%, #fff9f3 60%, #ffb36a 100%)',
      minHeight: '100vh',
      fontFamily: 'Quicksand',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 0 8px #fff9f3, 0 0 0 16px #ffb36a22',
      borderRadius: '0 0 48px 48px',
      border: '6px solid #23c483',
      transition: 'background 0.5s',
      /* 3D effect: perspective and subtle tilt */
      perspective: '1200px',
      transformStyle: 'preserve-3d',
      /* Subtle 3D shadow for the whole app */
      filter: 'drop-shadow(0 24px 48px #b36aff33) drop-shadow(0 2px 24px #23c48322)'
    }}>
      {/* Minimal, modern, strong, cutie background: fewer blobs, veggies, and sparkles, with 3D effect */}
      <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:0,overflow:'hidden',transform:'rotateY(-8deg) scale(1.03)',filter:'blur(0.5px)'}}>
        {/* One main color blob top left, one bottom right, with 3D shadow */}
        <div style={{position:'absolute',top:'-8%',left:'-10%',width:'260px',height:'260px',background:'radial-gradient(circle,#ffb36a 60%,#ff1e56 100%)',opacity:0.13,borderRadius:'50%',filter:'blur(8px) drop-shadow(0 12px 32px #ffb36a88)'}} />
        <div style={{position:'absolute',bottom:'-10%',right:'-8%',width:'220px',height:'220px',background:'radial-gradient(circle,#23c483 60%,#b36aff 100%)',opacity:0.11,borderRadius:'50%',filter:'blur(8px) drop-shadow(0 12px 32px #23c48388)'}} />
        {/* Minimal sparkles, with 3D shadow */}
        <span style={{position:'absolute',top:'18%',left:'12%',fontSize:'1.7rem',color:'#fff',opacity:0.18,filter:'drop-shadow(0 0 8px #ffb36a) drop-shadow(0 4px 8px #fff)',animation:'sparkle1 7s infinite alternate',pointerEvents:'none'}}>✨</span>
        <span style={{position:'absolute',top:'70%',left:'85%',fontSize:'1.3rem',color:'#fff',opacity:0.15,filter:'drop-shadow(0 0 8px #ffb36a) drop-shadow(0 4px 8px #fff)',animation:'sparkle2 8s infinite alternate',pointerEvents:'none'}}>✨</span>
        {/* Minimal floating veggies, with 3D shadow */}
        <span style={{position:'absolute',top:'15%',left:'8%',fontSize:'2.2rem',opacity:0.15,filter:'drop-shadow(0 6px 12px #23c48355)',animation:'float1 7s infinite alternate'}}>🥦</span>
        <span style={{position:'absolute',top:'75%',left:'80%',fontSize:'2.1rem',opacity:0.13,filter:'drop-shadow(0 6px 12px #b36aff55)',animation:'float2 8s infinite alternate'}}>🍅</span>
        {/* Minimal SVG grid overlay, with 3D tilt */}
        <svg width="100vw" height="100vh" style={{position:'absolute',top:0,left:0,opacity:0.04,transform:'perspective(800px) rotateX(12deg)'}}>
          <defs>
            <linearGradient id="techyGrid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#23c483" />
              <stop offset="100%" stopColor="#b36aff" />
            </linearGradient>
          </defs>
          {Array.from({length:8}).map((_,i)=>(
            <line key={'v'+i} x1={i*160} y1={0} x2={i*160} y2={window.innerHeight} stroke="url(#techyGrid)" strokeWidth="2" strokeDasharray="8 16" />
          ))}
          {Array.from({length:4}).map((_,i)=>(
            <line key={'h'+i} x1={0} y1={i*220} x2={window.innerWidth} y2={i*220} stroke="url(#techyGrid)" strokeWidth="2" strokeDasharray="8 16" />
          ))}
        </svg>
        <style>{`
          @keyframes float1 { 0%{transform:translateY(0);} 100%{transform:translateY(-12px);} }
          @keyframes float2 { 0%{transform:translateY(0);} 100%{transform:translateY(10px);} }
          @keyframes sparkle1 { 0%{opacity:0.2;} 100%{opacity:0.5;transform:scale(1.1);} }
          @keyframes sparkle2 { 0%{opacity:0.18;} 100%{opacity:0.4;transform:scale(1.15);} }
        `}</style>
      </div>
      <TopBar />
      <Navbar setPage={setPage} />
      <div style={{display:'flex',gap:16,margin:'24px 0 0 0',justifyContent:'center',zIndex:2,position:'relative'}}>
        <button
          className="button-main"
          style={{
            background: 'linear-gradient(90deg,#b36aff 60%,#23c483 100%)',
            color: '#fff',
            fontSize: '1.2rem',
            boxShadow: '0 4px 16px #b36aff33',
            borderRadius: 22,
            padding: '14px 38px',
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: 'pointer',
            border: 'none',
            letterSpacing: '0.03em',
            fontFamily: 'Fredoka One',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
          onClick={()=>setPage('history')}
          onMouseOver={e=>{
            e.currentTarget.style.transform='scale(1.09)';
            e.currentTarget.style.boxShadow='0 8px 24px #b36aff55';
          }}
          onMouseOut={e=>{
            e.currentTarget.style.transform='scale(1)';
            e.currentTarget.style.boxShadow='0 4px 16px #b36aff33';
          }}
        >
          <span style={{fontSize:'1.5rem',marginRight:8,filter:'drop-shadow(0 2px 2px #fff9f3)'}}>🏅</span>
          History & Badges
        </button>
      </div>
      <div style={{zIndex:2,position:'relative'}}>
        {renderPage()}
      </div>
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
