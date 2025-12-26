import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    if (!form.name || !form.email || !form.password) {
      setMsg('Please fill all fields');
      return;
    }
    if (form.password.length<4) {
      setMsg('Password must be at least 4 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setMsg('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.user.id);
      // Navigate to Home after registration
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

        <h1>Create an account</h1>
        {msg && <p className="msg" style={{ color: msg.includes('success') ? '#16a34a' : '#ef4444' }}>{msg}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" value={form.name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={onChange} />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>

        <div className="small">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}