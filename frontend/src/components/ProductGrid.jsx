import React from 'react';
import ProductCard from './ProductCard';
import { ProductSkeleton } from './Loading';
import { PackageOpen } from 'lucide-react';

export const ProductGrid = ({
  products,
  loading,
  emptyMessage = 'No products found matching your criteria.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <PackageOpen size={38} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          No Products Found
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button onClick={onResetFilters} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
