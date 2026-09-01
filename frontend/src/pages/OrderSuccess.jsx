import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Calendar, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { Loading } from '../components/Loading';

export const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/orders/${id}`);
          if (data.success && data.order) {
            setOrder(data.order);
          }
        } catch (err) {
          console.error('Failed to load order:', err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return <Loading text="Fetching confirmation details..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Confirmation</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          We could not load this order's details. You can view all your orders anytime in your account.
        </p>
        <Link to="/orders" className="btn btn-primary">
          View My Orders
        </Link>
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, orderStatus, createdAt } = order;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        {/* Animated Checkmark Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#15803d',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={42} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
          Thank you for your purchase! A confirmation has been sent to your email.
        </p>

        {/* Order Meta Box */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Order ID
            </span>
            <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{order._id}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Order Date
            </span>
            <strong>{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Status
            </span>
            <span className="badge badge-warning">{orderStatus || 'Processing'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Total Paid
            </span>
            <strong style={{ color: 'var(--secondary)', fontSize: '1.05rem' }}>₹{totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>
            Items Ordered ({items.length})
          </h3>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    {item.name}
                  </p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Qty: {item.quantity}
                  </span>
                </div>
                <strong style={{ fontSize: '0.95rem' }}>₹{(item.price * item.quantity).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        {shippingAddress && (
          <div
            style={{
              textAlign: 'left',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2.5rem',
              fontSize: '0.9rem',
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              <MapPin size={16} color="var(--primary)" /> Delivery Information
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{shippingAddress.fullName}</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Phone: {shippingAddress.phone}
            </p>
          </div>
        )}

        {/* Next Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-secondary btn-lg">
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-primary btn-lg">
            <ShoppingBag size={18} /> Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
