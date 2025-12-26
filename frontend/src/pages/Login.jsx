import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    if (!form.email || !form.password) {
      setMsg('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await login({ email: form.email, password: form.password });

      // Always use the valid JWT token from the backend
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('userEmail', res.user.email);

      // Mark admin users for frontend UI purposes
      if (res.user.email === 'admin@example.com') {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.removeItem('isAdmin');
      }

      // After successful login redirect to Home page
      navigate('/home');
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container form-card">
        <div className="brand">
          <h2 className="brand-heading">Near-me Adventures</h2>
        </div>
        <h1>Login</h1>
        {msg && <p className="msg" style={{ color: '#ef4444' }}>{msg}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <div className="small">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

        <div className="small" style={{ marginTop: 16 }}>
          Mail for profile related help:<br />
          <a href="mailto:nma.admins@gmail.com">nma.admins@gmail.com</a>
        </div>
      </div>
    </div>
  );
}