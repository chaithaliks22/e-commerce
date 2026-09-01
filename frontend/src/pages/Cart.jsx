import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

export const Cart = () => {
  const {
    items,
    cartCount,
    cartSubtotal,
    shippingCharge,
    discount,
    cartGrandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQty = (productId, newQty, stock, name) => {
    if (newQty > stock) {
      addToast(`Only ${stock} items available for "${name}"`, 'error');
      return;
    }
    updateQuantity(productId, newQty);
  };

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    addToast(`Removed "${name}" from cart`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <ShoppingBag size={38} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 2rem' }}>
            Looks like you haven't added any products to your cart yet. Explore our catalog
            and discover great deals!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Shopping Cart
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--accent-rose)' }}
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Layout */}
      <div className="cart-layout">
        {/* Left: Cart Items List */}
        <div className="cart-items-card">
          {items.map((item) => (
            <div key={item.productId} className="cart-item-row">
              {/* Thumbnail */}
              <Link to={`/products/${item.productId}`}>
                <img src={item.image} alt={item.name} className="cart-thumb" />
              </Link>

              {/* Info */}
              <div>
                <Link to={`/products/${item.productId}`}>
                  <h4 className="cart-item-name">{item.name}</h4>
                </Link>
                <div className="cart-item-unit-price">
                  ₹{item.price.toLocaleString()} each
                </div>
                {item.stock <= 5 && (
                  <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                    Only {item.stock} left in stock!
                  </span>
                )}
              </div>

              {/* Stepper */}
              <div className="quantity-stepper">
                <button
                  className="stepper-btn"
                  onClick={() =>
                    handleUpdateQty(item.productId, item.quantity - 1, item.stock, item.name)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="stepper-value">{item.quantity}</span>
                <button
                  className="stepper-btn"
                  onClick={() =>
                    handleUpdateQty(item.productId, item.quantity + 1, item.stock, item.name)
                  }
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.productId, item.name)}
                className="remove-btn"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div style={{ marginTop: '2rem' }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.925rem',
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>
              ₹{cartSubtotal.toLocaleString()}
            </span>
          </div>

          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span>
              {shippingCharge === 0 ? (
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>FREE</span>
              ) : (
                `₹${shippingCharge}`
              )}
            </span>
          </div>

          {discount > 0 && (
            <div className="summary-row" style={{ color: 'var(--accent-green)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={15} /> Order Discount
              </span>
              <span style={{ fontWeight: 600 }}>-₹{discount}</span>
            </div>
          )}

          {cartSubtotal < 999 && (
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                margin: '1rem 0',
              }}
            >
              Add <strong>₹{(999 - cartSubtotal).toLocaleString()}</strong> more to get Free Shipping!
            </div>
          )}

          <div className="summary-total-row">
            <span>Grand Total</span>
            <span>₹{cartGrandTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '1.75rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={16} /> 100% Safe & Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
