import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  X,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Loading } from '../components/Loading';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding new
  const [modalLoading, setModalLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    image: '',
    stock: '',
    featured: false,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?limit=100');
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'Electronics',
      image: '',
      stock: '10',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingProduct) {
        // Update product
        const { data } = await api.put(`/products/${editingProduct._id}`, formData);
        if (data.success) {
          addToast('Product updated successfully!', 'success');
          closeModal();
          fetchProducts();
        }
      } else {
        // Create product
        const { data } = await api.post('/products', formData);
        if (data.success) {
          addToast('Product created successfully!', 'success');
          closeModal();
          fetchProducts();
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const { data } = await api.delete(`/products/${id}`);
        if (data.success) {
          addToast(`Deleted "${name}"`, 'success');
          fetchProducts();
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Navigation & Header */}
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
            Product Catalog Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Add, update, or remove products from the store ({products.length} total products)
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="filter-bar-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            className="form-input search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        {loading ? (
          <Loading text="Loading products catalog..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Original Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              background: 'var(--bg-subtle)',
                            }}
                          />
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              ID: {p._id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{p.category}</span>
                      </td>
                      <td>
                        <strong>₹{p.price.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-muted)' }}>
                          ₹{p.originalPrice?.toLocaleString() || p.price.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            p.stock === 0
                              ? 'badge-danger'
                              : p.stock <= 5
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} style={{ color: 'var(--text-muted)', padding: '0.4rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="2499"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="3999"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Available Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="15"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label className="form-label">Featured Showcase</label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      style={{ accentColor: 'var(--primary)', transform: 'scale(1.2)' }}
                    />
                    Display on Homepage
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product information..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn btn-primary">
                  {modalLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
