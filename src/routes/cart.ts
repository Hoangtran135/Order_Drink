import express from 'express';
import { products } from '../data/mockData';
import { CartItem } from '../types';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng giỏ hàng' });
  }
  next();
};

// Get cart
router.get('/', requireAuth, (req, res) => {
  const cart: CartItem[] = req.session.cart || [];
  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  });
  
  res.json(cartWithProducts);
});

// Add item to cart
router.post('/add', requireAuth, (req, res) => {
  const { productId, quantity } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  
  if (!product.available) {
    return res.status(400).json({ message: 'Sản phẩm hiện không có sẵn' });
  }
  
  let cart: CartItem[] = req.session.cart || [];
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.push({
      productId,
      quantity: quantity || 1
    });
  }
  
  req.session.cart = cart;
  res.json({ message: 'Đã thêm vào giỏ hàng', cart });
});

// Update cart item quantity
router.put('/update', requireAuth, (req, res) => {
  const { productId, quantity } = req.body;
  
  let cart: CartItem[] = req.session.cart || [];
  const item = cart.find(item => item.productId === productId);
  
  if (!item) {
    return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
  }
  
  if (quantity <= 0) {
    cart = cart.filter(item => item.productId !== productId);
  } else {
    item.quantity = quantity;
  }
  
  req.session.cart = cart;
  res.json({ message: 'Đã cập nhật giỏ hàng', cart });
});

// Remove item from cart
router.delete('/remove/:productId', requireAuth, (req, res) => {
  const productId = parseInt(req.params.productId);
  
  let cart: CartItem[] = req.session.cart || [];
  cart = cart.filter(item => item.productId !== productId);
  
  req.session.cart = cart;
  res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart });
});

// Clear cart
router.delete('/clear', requireAuth, (req, res) => {
  req.session.cart = [];
  res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
});

export { router as cartRoutes };
