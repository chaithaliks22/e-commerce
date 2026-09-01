import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
