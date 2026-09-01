import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Package, ShoppingCart, LogOut, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
          My Account
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details and account settings</p>
      </div>

      {/* Profile Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {user.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              {user.email}
            </p>
            <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-secondary'}`}>
              {isAdmin ? 'System Administrator' : 'Customer Account'}
            </span>
          </div>
        </div>

        {/* User Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={20} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</span>
              <strong style={{ fontSize: '0.9rem' }}>{user.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={20} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</span>
              <strong style={{ fontSize: '0.9rem' }}>{user.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={20} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</span>
              <strong style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{user.role}</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontWeight: 600,
              color: 'var(--secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Package size={18} color="var(--primary)" /> My Purchase Orders
            </span>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>

          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontWeight: 600,
              color: 'var(--secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShoppingCart size={18} color="var(--primary)" /> View Shopping Cart
            </span>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                background: 'var(--primary-light)',
                fontWeight: 600,
                color: 'var(--primary)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <LayoutDashboard size={18} /> Admin Dashboard
              </span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Logout */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Log Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
