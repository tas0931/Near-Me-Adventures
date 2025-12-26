import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    if (!form.email || !form.password) return setMsg('Please fill all fields');
    setLoading(true);
    try {
      // Simple client-side admin credential check
      if (form.email === 'admin@gmail.com' && form.password === 'admin123') {
        // set a token so RequireAuth can allow access
        localStorage.setItem('token', 'admin-token');
        navigate('/admin');
      } else {
        setMsg('Invalid admin credentials');
      }
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
        <h1>Admin Login</h1>
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
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login as Admin'}</button>
        </form>

        <div className="small">
          Back to <Link to="/login">User Login</Link>
        </div>
      </div>
    </div>
  );
}
