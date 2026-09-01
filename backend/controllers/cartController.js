import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalPrice: 0,
    });
  }
  return cart;
};

// @desc    Get user's shopping cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price originalPrice image stock category',
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 },
      });
    }

    // Filter out any items whose product might have been deleted from DB
    cart.items = cart.items.filter((item) => item.product !== null);
    cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or increase quantity
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const qty = Math.max(1, parseInt(quantity, 10));

    // Verify product exists and check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + qty;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} available)`,
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock} available)`,
        });
      }
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    cart.calculateTotalPrice();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice image stock category',
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} available)`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = qty;
    cart.items[itemIndex].price = product.price;
    cart.calculateTotalPrice();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice image stock category',
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.calculateTotalPrice();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice image stock category',
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], totalPrice: 0 },
    });
  } catch (error) {
    next(error);
  }
};
