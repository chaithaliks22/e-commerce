import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order operations require user to be authenticated
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.route('/:id')
  .get(getOrderById);

export default router;
