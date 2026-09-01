import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create a new order from cart / checkout
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, items: directItems } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const { fullName, email, phone, address, city, state, pincode } = shippingAddress;
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all shipping and contact details (name, email, phone, address, city, state, pincode)',
      });
    }

    // Determine order items: from request body or from user's current Cart
    let orderItems = [];

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems;
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Your cart is empty. Cannot place an order.' });
      }

      orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Validate stock and verify products
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.product} no longer exists`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
      }
    }

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculate totals
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCharge = subtotal >= 999 ? 0 : 50; // Free delivery over 999
    const discount = subtotal >= 2000 ? 100 : 0; // Special 100 discount above 2000
    const totalAmount = subtotal + shippingCharge - discount;

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
      },
      phone,
      subtotal,
      shippingCharge,
      discount,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery / Demo Payment',
      paymentStatus: 'Completed',
      orderStatus: 'Processing',
    });

    const savedOrder = await order.save();

    // Clear user's cart in database
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], totalPrice: 0 } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure only the owner or an admin can view the order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
