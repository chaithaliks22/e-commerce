import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  // Calculate discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;

    try {
      setAdding(true);
      await addToCart(product, 1);
      setJustAdded(true);
      addToast(`Added "${product.name}" to cart`, 'success');
      setTimeout(() => setJustAdded(false), 1800);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      {/* Badges */}
      <div className="product-badge-group">
        {discountPercent > 0 && (
          <span className="discount-badge">-{discountPercent}% OFF</span>
        )}
        {product.featured && (
          <span className="featured-badge">HOT</span>
        )}
      </div>

      {/* Image Thumbnail */}
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </Link>

      {/* Product Body */}
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="stars">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
          </div>
          <span className="rating-number">{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
          {product.numReviews > 0 && (
            <span className="reviews-count">({product.numReviews})</span>
          )}
        </div>

        {/* Stock status */}
        <div className={`stock-indicator ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isOutOfStock ? '#ef4444' : '#10b981',
              display: 'inline-block',
            }}
          />
          {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`btn btn-sm ${justAdded ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%' }}
          >
            {justAdded ? (
              <>
                <Check size={15} color="#10b981" /> Added!
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart size={15} /> Add to Cart
              </>
            )}
          </button>

          <Link
            to={`/products/${product._id}`}
            className="btn btn-secondary btn-sm"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
