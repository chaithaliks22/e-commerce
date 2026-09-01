import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when user logs in, or load from localStorage for guest
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data } = await api.get('/cart');
          if (data.success && data.cart) {
            // Map MongoDB cart structure to convenient frontend format
            const mapped = data.cart.items
              .filter((item) => item.product) // safeguard against null
              .map((item) => ({
                product: item.product,
                productId: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.price,
                stock: item.product.stock,
                quantity: item.quantity,
              }));
            setItems(mapped);
          }
        } catch (err) {
          console.error('Failed to fetch cart from server:', err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode from localStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          try {
            setItems(JSON.parse(localCart));
          } catch (e) {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (user) {
      try {
        setLoading(true);
        const { data } = await api.post('/cart', {
          productId: product._id,
          quantity: qty,
        });

        if (data.success && data.cart) {
          const mapped = data.cart.items
            .filter((item) => item.product)
            .map((item) => ({
              product: item.product,
              productId: item.product._id,
              name: item.product.name,
              image: item.product.image,
              price: item.price,
              stock: item.product.stock,
              quantity: item.quantity,
            }));
          setItems(mapped);
          return { success: true, message: 'Added to cart' };
        }
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart
      const existingIndex = items.findIndex((i) => i.productId === product._id);
      let updatedItems = [...items];

      if (existingIndex > -1) {
        const newQty = updatedItems[existingIndex].quantity + qty;
        if (newQty > product.stock) {
          throw new Error(`Only ${product.stock} items available in stock`);
        }
        updatedItems[existingIndex].quantity = newQty;
      } else {
        if (qty > product.stock) {
          throw new Error(`Only ${product.stock} items available in stock`);
        }
        updatedItems.push({
          product,
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          quantity: qty,
        });
      }
      setItems(updatedItems);
      return { success: true, message: 'Added to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty < 1) return;

    if (user) {
      try {
        setLoading(true);
        const { data } = await api.put(`/cart/${productId}`, { quantity: qty });
        if (data.success && data.cart) {
          const mapped = data.cart.items
            .filter((item) => item.product)
            .map((item) => ({
              product: item.product,
              productId: item.product._id,
              name: item.product.name,
              image: item.product.image,
              price: item.price,
              stock: item.product.stock,
              quantity: item.quantity,
            }));
          setItems(mapped);
        }
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const item = items.find((i) => i.productId === productId);
      if (item && qty > item.stock) {
        throw new Error(`Only ${item.stock} items available in stock`);
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await api.delete(`/cart/${productId}`);
        if (data.success && data.cart) {
          const mapped = data.cart.items
            .filter((item) => item.product)
            .map((item) => ({
              product: item.product,
              productId: item.product._id,
              name: item.product.name,
              image: item.product.image,
              price: item.price,
              stock: item.product.stock,
              quantity: item.quantity,
            }));
          setItems(mapped);
        }
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Error clearing cart on server:', err.message);
      }
    }
    setItems([]);
    localStorage.removeItem('guest_cart');
  };

  // Calculations
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCharge = cartSubtotal > 0 && cartSubtotal < 999 ? 50 : 0;
  const discount = cartSubtotal >= 2000 ? 100 : 0;
  const cartGrandTotal = Math.max(0, cartSubtotal + shippingCharge - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        shippingCharge,
        discount,
        cartGrandTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
