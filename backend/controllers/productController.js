import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      featured,
      inStock,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Text search in name or description
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // In Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID (including related products)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find up to 4 related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct product categories
// @route   GET /api/products/categories/list
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories: ['All', ...categories],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      stock,
      specifications,
      featured,
      rating,
    } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, image, and stock',
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category,
      image,
      stock: Number(stock),
      specifications: specifications || [],
      featured: Boolean(featured),
      rating: rating ? Number(rating) : 4.5,
    });

    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      stock,
      specifications,
      featured,
      rating,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (specifications !== undefined) product.specifications = specifications;
    if (featured !== undefined) product.featured = Boolean(featured);
    if (rating !== undefined) product.rating = Number(rating);

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
