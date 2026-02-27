import React, { useState, useContext } from 'react';
import './App.css';
import { UserContext } from './UserContext';

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userProfile, setUserProfile, aiUsage, maxAiUsage } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('nourishnest_token', data.access);
      // Optionally fetch user profile and set in context
      setUserProfile(prev => ({ ...prev, email, subscription: data.subscription || 'free' }));
      onLogin(data.access);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{position:'relative', overflow:'hidden'}}>
      {/* Playful background shapes */}
      <div style={{
        position: 'absolute',
        top: '-60px', left: '-60px',
        width: '180px', height: '180px',
        background: 'rgba(106,255,122,0.18)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', right: '-80px',
        width: '200px', height: '200px',
        background: 'rgba(255,106,106,0.13)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div className="logo">
        <h1>NourishNest</h1>
      </div>
      {/* Show AI usage and subscription status for demo */}
      <div style={{marginBottom: 12, color: userProfile.subscription === 'premium' ? '#23c483' : '#ff6a6a', fontFamily: 'Fredoka One', textAlign: 'center'}}>
        {userProfile.subscription === 'premium' ? 'NourishNest+ (Premium)' : 'Free Tier'} • AI Usage: {aiUsage}/{maxAiUsage}
      </div>
      <form className="login-form" onSubmit={handleSubmit} style={{zIndex:1, position:'relative'}}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="button-main" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        {error && <div style={{color:'#ff6a6a', marginTop:'8px'}}>{error}</div>}
      </form>
      <button className="button-main green" style={{zIndex:1, position:'relative'}} onClick={onSignup}>Sign up</button>
    </div>
  );
}

export default Login;
