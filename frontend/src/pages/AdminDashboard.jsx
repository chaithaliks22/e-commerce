import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Boxes,
  ClipboardList,
} from 'lucide-react';
import api from '../services/api';
import { Loading } from '../components/Loading';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/stats');
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setLowStockProducts(data.lowStockProducts || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading text="Loading admin analytics..." />;
  }

  return (
    <div className="container">
      {/* Header & Quick Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of store metrics, inventory, and orders</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <Boxes size={16} /> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-primary btn-sm">
            <ClipboardList size={16} /> Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-stats-grid">
        {/* Total Sales */}
        <div className="stat-card">
          <div>
            <span className="stat-label">Total Revenue</span>
            <div className="stat-value" style={{ color: '#2563eb' }}>
              ₹{stats?.totalSales?.toLocaleString() || 0}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
              Live Store Revenue
            </span>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IndianRupee size={24} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div>
            <span className="stat-label">Total Orders</span>
            <div className="stat-value">{stats?.totalOrders || 0}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Placed customer orders</span>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Total Products */}
        <div className="stat-card">
          <div>
            <span className="stat-label">Active Products</span>
            <div className="stat-value">{stats?.totalProducts || 0}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Catalog items</span>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={24} />
          </div>
        </div>

        {/* Total Users */}
        <div className="stat-card">
          <div>
            <span className="stat-label">Registered Users</span>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customers & Admins</span>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Inventory Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Orders Table */}
        <div className="table-card">
          <div className="table-header-box">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>
              Recent Orders
            </h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {order._id.substring(0, 10)}...
                      </td>
                      <td>
                        <strong style={{ display: 'block', fontSize: '0.85rem' }}>
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.shippingAddress?.email || order.user?.email}
                        </span>
                      </td>
                      <td>
                        <strong>₹{order.totalAmount.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className="badge badge-warning">{order.orderStatus}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={20} color="#ea580c" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
              Low Stock Alerts
            </h3>
          </div>

          {lowStockProducts.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All inventory levels are healthy (stock &gt; 5).
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}
                    >
                      {p.name}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="badge badge-danger">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/admin/products" className="btn btn-secondary btn-sm btn-full">
              Update Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
