import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    addToast('You have been logged out successfully', 'info');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <ShoppingBag size={20} strokeWidth={2.4} />
          </div>
          <span>ShopSphere</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#2563eb', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions: Cart & Auth */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-button" title="View Shopping Cart">
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Profile / Auth State */}
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                className="user-menu-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    {isAdmin && (
                      <span className="badge badge-primary" style={{ marginTop: '0.35rem' }}>
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={16} /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ color: '#2563eb' }}
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="dropdown-item danger"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem' }}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem' }}
          >
            All Products
          </Link>
          {user && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, fontSize: '1rem' }}
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, fontSize: '1rem' }}
              >
                My Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '1rem', color: '#2563eb' }}
            >
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="btn btn-danger btn-sm"
              style={{ alignSelf: 'flex-start' }}
            >
              <LogOut size={16} /> Log Out
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
