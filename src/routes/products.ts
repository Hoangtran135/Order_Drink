import express from 'express';
import { products } from '../data/mockData';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  
  res.json(product);
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  
  res.json(filteredProducts);
});

export { router as productRoutes };
