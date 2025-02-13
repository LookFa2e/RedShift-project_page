import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { getAllOrders, createOrder, deleteOrder, getOrderByID, OrderStatus, getOrderByEmail } from '../controllers/orderController';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/', getAllOrders);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);
router.get('/:id', getOrderByID);
router.put('/:id/status', OrderStatus);
router.get('/email/:email', getOrderByEmail);

export default router;
