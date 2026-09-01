import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch distinct categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories/list');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (category && category !== 'All') params.append('category', category);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (inStockOnly) params.append('inStock', 'true');
        params.append('page', page);
        params.append('limit', '12');

        // Update browser URL query params
        setSearchParams(params, { replace: true });

        const { data } = await api.get(`/products?${params.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, category, sort, minPrice, maxPrice, inStockOnly, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Explore All Products
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Showing {products.length} of {totalCount} available items
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-wrapper">
        <div className="filter-grid">
          {/* Search */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products by name..."
              className="form-input search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Price Range Inputs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Min ₹"
              className="form-input"
              style={{ width: '50%' }}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
            />
            <input
              type="number"
              placeholder="Max ₹"
              className="form-input"
              style={{ width: '50%' }}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="btn btn-secondary"
            title="Clear all filters"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* In Stock toggle */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setPage(1);
              }}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            In-Stock Items Only
          </label>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '3.5rem',
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
