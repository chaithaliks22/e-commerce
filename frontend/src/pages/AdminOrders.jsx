import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Loading } from '../components/Loading';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (data.success) {
        addToast(`Order status updated to "${newStatus}"`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === 'All' ? true : o.orderStatus === statusFilter
  );

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Order Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track and fulfill customer purchases across all order lifecycle stages ({orders.length} total)
          </p>
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-card">
        {loading ? (
          <Loading text="Loading all customer orders..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Customer & Destination</th>
                  <th>Items Ordered</th>
                  <th>Total Amount</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No orders found with status "{statusFilter}".
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary)', display: 'block' }}>
                          {order._id.substring(0, 10)}...
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td>
                        <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.shippingAddress?.phone}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                              • {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>₹{order.totalAmount.toLocaleString()}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.paymentMethod?.split('/')[0]}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            order.orderStatus === 'Delivered'
                              ? 'badge-success'
                              : order.orderStatus === 'Shipped' || order.orderStatus === 'Confirmed'
                              ? 'badge-primary'
                              : order.orderStatus === 'Cancelled'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td>
                        <select
                          className="form-select"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
