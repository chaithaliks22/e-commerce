import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, ShoppingBag, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import { Loading } from '../components/Loading';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders');
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-primary">Shipped</span>;
      case 'Confirmed':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'Processing':
      default:
        return <span className="badge badge-warning">Processing</span>;
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <Loading text="Loading your order history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Package size={38} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
            No Orders Yet
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 2rem' }}>
            You haven't placed any orders with us yet. Start shopping and discover great deals today!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review your purchase history and track active orders ({orders.length} total)
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;

          return (
            <div
              key={order._id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {/* Order Card Header */}
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Order Placed
                    </span>
                    <strong style={{ fontSize: '0.9rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Total Amount
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Order Number
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order._id}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.orderStatus)}
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              <div style={{ padding: '1.5rem 1.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        paddingBottom: idx === order.items.length - 1 ? '0' : '1rem',
                        borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid var(--border-color)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '0.2rem' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                      <strong style={{ fontSize: '1rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px dashed var(--border-color)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--secondary)' }}>
                        Delivery Address
                      </strong>
                      <p style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress?.fullName}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                      <p style={{ color: 'var(--text-muted)' }}>Phone: {order.shippingAddress?.phone}</p>
                    </div>

                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--secondary)' }}>
                        Payment Details
                      </strong>
                      <p style={{ color: 'var(--text-secondary)' }}>Method: {order.paymentMethod}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Payment Status:{' '}
                        <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{order.paymentStatus}</span>
                      </p>
                    </div>

                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--secondary)' }}>
                        Order Breakdown
                      </strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Subtotal:</span>
                        <strong>₹{order.subtotal?.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Shipping:</span>
                        <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
                      </div>
                      {order.discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                          <span>Discount:</span>
                          <span>-₹{order.discount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
