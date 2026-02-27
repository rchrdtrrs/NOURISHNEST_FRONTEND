import React, { useState } from 'react';

function Register({ onRegister, onBack }) {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          // If response is not JSON (e.g. HTML error page), show generic error
          throw new Error('Registration failed. Please check your backend server and endpoint.');
        }
        throw new Error(data?.email?.[0] || data?.username?.[0] || data?.password?.[0] || data?.password_confirm?.[0] || 'Registration failed');
      }
      onRegister && onRegister();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        background: 'linear-gradient(135deg, #fff9f3 0%, #eaf6ef 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 4px 24px #ffb36a22',
          padding: '32px 20px',
          margin: '0 auto'
        }}
      >
        <h2
          style={{
            fontFamily: 'Fredoka One',
            color: '#2d7a46',
            fontSize: '2rem',
            marginBottom: 16,
            textAlign: 'center'
          }}
        >
          Sign Up
        </h2>
        <form
          className="register-form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          <input
            type="password"
            name="password_confirm"
            placeholder="Confirm Password"
            value={form.password_confirm}
            onChange={handleChange}
            required
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name (optional)"
            value={form.first_name}
            onChange={handleChange}
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name (optional)"
            value={form.last_name}
            onChange={handleChange}
            style={{ padding: 12, borderRadius: 12, fontSize: 16, border: '1px solid #eee' }}
          />
          {error && (
            <div style={{ color: '#ff6a6a', marginTop: '8px', textAlign: 'center' }}>{error}</div>
          )}
          <button
            className="button-main"
            style={{
              background: '#6aff7a',
              color: '#2d7a46',
              fontSize: 18,
              padding: '12px 0',
              borderRadius: 16,
              marginTop: 8
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="button-main"
            style={{
              background: '#ffb36a',
              color: '#fff',
              fontSize: 18,
              padding: '12px 0',
              borderRadius: 16
            }}
            onClick={onBack}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
