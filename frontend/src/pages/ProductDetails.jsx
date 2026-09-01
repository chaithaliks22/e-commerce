import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { Loading } from '../components/Loading';
import ProductGrid from '../components/ProductGrid';

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setQuantity(1);
        const { data } = await api.get(`/products/${id}`);
        if (data.success) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        }
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <Loading text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          The product you are looking for might have been removed or does not exist.
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;

    try {
      setAdding(true);
      await addToCart(product, quantity);
      setJustAdded(true);
      addToast(`Added ${quantity} × "${product.name}" to your cart!`, 'success');
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="container">
      {/* Breadcrumbs & Back */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <Share2 size={15} /> Share
        </button>
      </div>

      {/* Main Details Layout */}
      <div className="product-detail-layout">
        {/* Left: Product Gallery Image */}
        <div className="detail-gallery">
          <div className="detail-main-img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="detail-main-img"
            />
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">{product.category}</span>
            {product.featured && <span className="badge badge-warning">Featured</span>}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
            <strong style={{ fontSize: '0.95rem' }}>{product.rating?.toFixed(1) || '4.8'}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ({product.numReviews || 0} customer reviews)
            </span>
          </div>

          {/* Price Box */}
          <div className="detail-price-box">
            <span className="detail-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="detail-original-price">₹{product.originalPrice.toLocaleString()}</span>
                <span className="badge badge-danger">Save {discountPercent}%</span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '1.25rem' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : (
              <span className="badge badge-success">
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="detail-desc">{product.description}</p>

          {/* Quantity selector and Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '1.5rem 0' }}>
            <div className="quantity-stepper">
              <button
                className="stepper-btn"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <span className="stepper-value">{quantity}</span>
              <button
                className="stepper-btn"
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`btn btn-lg ${justAdded ? 'btn-secondary' : 'btn-primary'}`}
              style={{ flex: 1 }}
            >
              {justAdded ? (
                <>
                  <Check size={18} color="#10b981" /> Added to Cart!
                </>
              ) : isOutOfStock ? (
                'Currently Unavailable'
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Perks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '1.25rem',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              margin: '1.5rem 0',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} color="#2563eb" />
              <span>Fast 2-4 Day Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#2563eb" />
              <span>1-Year Official Warranty</span>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1rem', color: 'var(--secondary)' }}>
                Specifications
              </h3>
              <table className="spec-table">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td>{spec.title}</td>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Related Products</h2>
              <p className="section-subtitle">More items in {product.category}</p>
            </div>
          </div>
          <ProductGrid products={relatedProducts} loading={false} />
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
