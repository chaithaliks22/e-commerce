import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers
  const fillDemoAdmin = () => {
    setEmail('admin@example.com');
    setPassword('Admin@123');
    setErrorMsg('');
  };

  const fillDemoUser = () => {
    setEmail('user@example.com');
    setPassword('User@123');
    setErrorMsg('');
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your ShopSphere account</p>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div className="demo-credentials-box">
          <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            ⚡ Instant Demo Accounts:
          </strong>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            Click below to auto-fill pre-seeded credentials for rapid evaluation:
          </p>
          <div className="demo-buttons-row">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, display: 'flex', gap: '0.3rem' }}
            >
              <ShieldCheck size={14} color="#2563eb" /> Admin (Full Access)
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, display: 'flex', gap: '0.3rem' }}
            >
              <UserCheck size={14} color="#10b981" /> Customer Account
            </button>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
