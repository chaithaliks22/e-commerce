import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

export const Checkout = () => {
  const { user } = useAuth();
  const { items, cartSubtotal, shippingCharge, discount, cartGrandTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery / Demo Payment',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Autofill user name and email when user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      addToast('Please login to place your order', 'info');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    // Validate form fields
    const { fullName, email, phone, address, city, state, pincode } = formData;
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      setErrorMsg('Please fill in all required shipping and contact details.');
      addToast('Please complete all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        shippingAddress: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          pincode,
        },
        phone,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const { data } = await api.post('/orders', orderPayload);

      if (data.success && data.order) {
        clearCart();
        addToast('Order placed successfully!', 'success');
        navigate(`/order-success/${data.order._id}`, { state: { order: data.order } });
      }
    } catch (err) {
      console.error('Order creation failed:', err.message);
      setErrorMsg(err.message);
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/cart"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--secondary)' }}>
        Checkout
      </h1>

      {errorMsg && (
        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {!user && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Already have an account? Log in for faster checkout and order tracking.</span>
          <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn btn-primary btn-sm">
            Log In
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="checkout-layout">
          {/* Left Column: Customer & Delivery Information */}
          <div>
            {/* Customer Details */}
            <div className="checkout-section">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--secondary)' }}>
                1. Customer Information
              </h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="checkout-section">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--secondary)' }}>
                2. Delivery Address
              </h3>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat/House No., Building, Street Area"
                  className="form-input"
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State / Province"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Postal / Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit Pincode"
                  className="form-input"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--secondary)' }}>
                3. Payment Method
              </h3>
              <div
                style={{
                  border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  checked
                  readOnly
                  style={{ accentColor: 'var(--primary)', transform: 'scale(1.2)' }}
                />
                <label htmlFor="cod" style={{ cursor: 'pointer' }}>
                  <strong style={{ display: 'block', color: 'var(--secondary)' }}>
                    Cash on Delivery / Demo Payment
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    No real payment gateway needed. Your demo order will be processed instantly.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="summary-card">
            <h3 className="summary-title">Order Review</h3>

            {/* Items summary */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{cartSubtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shippingCharge === 0 ? (
                  <strong style={{ color: 'var(--accent-green)' }}>FREE</strong>
                ) : (
                  `₹${shippingCharge}`
                )}
              </span>
            </div>

            {discount > 0 && (
              <div className="summary-row" style={{ color: 'var(--accent-green)' }}>
                <span>Discount</span>
                <span style={{ fontWeight: 600 }}>-₹{discount}</span>
              </div>
            )}

            <div className="summary-total-row">
              <span>Total Amount</span>
              <span>₹{cartGrandTotal.toLocaleString()}</span>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: '1.75rem' }}
            >
              {submitting ? (
                'Placing Order...'
              ) : (
                <>
                  <Lock size={16} /> Place Order (₹{cartGrandTotal.toLocaleString()})
                </>
              )}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '1.25rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={16} /> 256-bit Secure Encryption
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
