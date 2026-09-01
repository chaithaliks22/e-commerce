import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div>
            <div className="brand-logo" style={{ color: '#ffffff' }}>
              <div className="brand-icon">
                <ShoppingBag size={18} strokeWidth={2.4} />
              </div>
              <span>ShopSphere</span>
            </div>
            <p className="footer-brand-desc">
              Your premium destination for the finest electronics, contemporary fashion,
              designer footwear, and lifestyle essentials with fast doorstep delivery.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#60a5fa" /> support@shopsphere.demo
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#60a5fa" /> +91 (800) 123-4567
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#60a5fa" /> Tech Hub, Silicon Boulevard
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Fashion">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=Shoes">Footwear</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
              <li><Link to="/products?category=Home">Home & Living</Link></li>
              <li><Link to="/products?category=Beauty">Beauty & Wellness</Link></li>
            </ul>
          </div>

          {/* Column 4: Guarantees */}
          <div>
            <h4 className="footer-heading">Why Shop With Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Truck size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Free Express Shipping</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>On all qualifying orders above ₹999</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Secure Checkout</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>100% encrypted & verified transactions</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <RefreshCw size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Hassle-Free Returns</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>30-day instant money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere E-Commerce. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem', color: '#64748b' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Demo Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
