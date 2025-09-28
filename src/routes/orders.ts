import express from 'express';
import { orders, users } from '../data/mockData';
import { Order, CartItem } from '../types';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để xem đơn hàng' });
  }
  next();
};

// Get user orders
router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const userOrders = orders.filter(order => order.userId === userId);
  
  res.json(userOrders);
});

// Get order by ID
router.get('/:id', requireAuth, (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.session.userId;
  
  const order = orders.find(o => o.id === orderId && o.userId === userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  }
  
  res.json(order);
});

// Create new order
router.post('/', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const { deliveryAddress, phone } = req.body;
  
  const cart: CartItem[] = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }
  
  // Calculate total amount
  const { products } = require('../data/mockData');
  let totalAmount = 0;
  
  cart.forEach(item => {
    const product = products.find((p: any) => p.id === item.productId);
    if (product) {
      totalAmount += product.price * item.quantity;
    }
  });
  
  const newOrder: Order = {
    id: orders.length + 1,
    userId: userId!,
    items: [...cart],
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
    deliveryAddress,
    phone
  };
  
  orders.push(newOrder);
  
  // Clear cart after creating order
  req.session.cart = [];
  
  res.json({
    message: 'Đặt hàng thành công',
    order: newOrder
  });
});

// Update order status (admin only)
router.put('/:id/status', requireAuth, (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;
  
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  }
  
  // Check if user is admin or order owner
  const user = users.find(u => u.id === req.session.userId);
  if (user?.username !== 'admin' && order.userId !== req.session.userId) {
    return res.status(403).json({ message: 'Không có quyền cập nhật đơn hàng này' });
  }
  
  order.status = status;
  
  res.json({
    message: 'Đã cập nhật trạng thái đơn hàng',
    order
  });
});

// Cancel order
router.put('/:id/cancel', requireAuth, (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.session.userId;
  
  const order = orders.find(o => o.id === orderId && o.userId === userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  }
  
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return res.status(400).json({ message: 'Không thể hủy đơn hàng này' });
  }
  
  order.status = 'cancelled';
  
  res.json({
    message: 'Đã hủy đơn hàng',
    order
  });
});

export { router as orderRoutes };
