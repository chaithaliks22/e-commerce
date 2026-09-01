import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCw,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Home as HomeIcon,
  Smile,
  Star,
} from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products?featured=true&limit=8');
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Laptop size={24} />, desc: 'Gadgets & Tech' },
    { name: 'Fashion', icon: <Shirt size={24} />, desc: 'Clothing & Styles' },
    { name: 'Shoes', icon: <Footprints size={24} />, desc: 'Sneakers & Boots' },
    { name: 'Accessories', icon: <Watch size={24} />, desc: 'Watches & Bags' },
    { name: 'Home', icon: <HomeIcon size={24} />, desc: 'Decor & Essentials' },
    { name: 'Beauty', icon: <Smile size={24} />, desc: 'Skincare & Care' },
  ];

  return (
    <div className="container">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} /> New Season Arrivals 2025
          </div>
          <h1 className="hero-title">
            Discover Quality Essentials for <span>Modern Living</span>
          </h1>
          <p className="hero-desc">
            Explore our curated catalog of premium electronics, contemporary fashion,
            and timeless everyday accessories with guaranteed express delivery.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/products?category=Electronics"
              className="btn btn-outline btn-lg"
              style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)' }}
            >
              Explore Tech
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Features */}
      <section className="features-bar">
        <div className="feature-card">
          <div className="feature-icon">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="feature-title">Free Express Shipping</h4>
            <p className="feature-desc">On all orders above ₹999</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="feature-title">Secure Demo Payments</h4>
            <p className="feature-desc">Encrypted & safe checkout</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="feature-title">Easy 30-Day Returns</h4>
            <p className="feature-desc">Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Headphones size={24} />
          </div>
          <div>
            <h4 className="feature-title">24/7 Dedicated Support</h4>
            <p className="feature-desc">Instant customer assistance</p>
          </div>
        </div>
      </section>

      {/* 3. Product Categories */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you are looking for</p>
          </div>
          <Link
            to="/products"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            All Categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="category-icon-box">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {cat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked top-rated products of the week</p>
          </div>
          <Link
            to="/products"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          emptyMessage="No featured products currently available."
        />
      </section>

      {/* 5. Promotional Callout Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 'var(--radius-xl)',
          color: '#ffffff',
          padding: '3rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '4rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ maxWidth: '550px' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Special Promotion
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', margin: '0.8rem 0 0.5rem' }}>
            Get ₹100 Flat OFF on Orders Over ₹2,000!
          </h2>
          <p style={{ color: '#dbeafe', fontSize: '1rem' }}>
            Automatic discount applied at checkout. Free shipping included on all eligible baskets!
          </p>
        </div>

        <Link
          to="/products"
          className="btn btn-lg"
          style={{
            backgroundColor: '#ffffff',
            color: '#1e3a8a',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Claim Offer Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* 6. Customer Satisfaction Quotes */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Loved by Thousands of Shoppers</h2>
          <p className="section-subtitle">Real experiences from our community</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              name: 'Ananya Sharma',
              role: 'Verified Buyer',
              review:
                'The Sony WH-1000XM5 headphones arrived within 2 days! Genuine product, pristine packaging, and the checkout was instantaneous.',
              rating: 5,
            },
            {
              name: 'Rohan Mehta',
              role: 'Tech Enthusiast',
              review:
                'Exceptional shopping experience. The category filters and detailed technical specifications made comparing watches super simple.',
              rating: 5,
            },
            {
              name: 'Pooja Nair',
              role: 'Fashion Designer',
              review:
                'The quality of the denim jacket and hoodie exceeded my expectations. Beautiful interface and very clean order tracking.',
              rating: 5,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                "{t.review}"
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--secondary)' }}>
                  {t.name}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
