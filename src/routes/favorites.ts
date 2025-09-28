import express from 'express';
import { Favorite, Product } from '../types';
import { products } from '../data/mockData';

const router = express.Router();

// Mock data for favorites
let favorites: Favorite[] = [
  {
    id: 1,
    userId: 2,
    productId: 1,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    userId: 2,
    productId: 3,
    createdAt: new Date('2024-01-12')
  }
];

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng danh sách yêu thích' });
  }
  next();
};

// Get user's favorites
router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const userFavorites = favorites
    .filter(fav => fav.userId === userId)
    .map(fav => {
      const product = products.find(p => p.id === fav.productId);
      return {
        ...fav,
        product
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(userFavorites);
});

// Add to favorites
router.post('/add', requireAuth, (req, res) => {
  const { productId } = req.body;
  const userId = req.session.userId!;

  // Check if product exists
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }

  // Check if already in favorites
  const existingFavorite = favorites.find(fav => fav.userId === userId && fav.productId === productId);
  if (existingFavorite) {
    return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
  }

  const newFavorite: Favorite = {
    id: favorites.length + 1,
    userId,
    productId,
    createdAt: new Date()
  };

  favorites.push(newFavorite);

  res.json({
    message: 'Đã thêm vào danh sách yêu thích',
    favorite: {
      ...newFavorite,
      product
    }
  });
});

// Remove from favorites
router.delete('/remove/:productId', requireAuth, (req, res) => {
  const productId = parseInt(req.params.productId);
  const userId = req.session.userId!;

  const favoriteIndex = favorites.findIndex(fav => fav.userId === userId && fav.productId === productId);
  if (favoriteIndex === -1) {
    return res.status(404).json({ message: 'Sản phẩm không có trong danh sách yêu thích' });
  }

  favorites.splice(favoriteIndex, 1);

  res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
});

// Check if product is in favorites
router.get('/check/:productId', requireAuth, (req, res) => {
  const productId = parseInt(req.params.productId);
  const userId = req.session.userId!;

  const isFavorite = favorites.some(fav => fav.userId === userId && fav.productId === productId);

  res.json({ isFavorite });
});

// Toggle favorite status
router.post('/toggle', requireAuth, (req, res) => {
  const { productId } = req.body;
  const userId = req.session.userId!;

  // Check if product exists
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }

  const existingFavorite = favorites.find(fav => fav.userId === userId && fav.productId === productId);
  
  if (existingFavorite) {
    // Remove from favorites
    const favoriteIndex = favorites.findIndex(fav => fav.userId === userId && fav.productId === productId);
    favorites.splice(favoriteIndex, 1);
    
    res.json({
      message: 'Đã xóa khỏi danh sách yêu thích',
      isFavorite: false
    });
  } else {
    // Add to favorites
    const newFavorite: Favorite = {
      id: favorites.length + 1,
      userId,
      productId,
      createdAt: new Date()
    };

    favorites.push(newFavorite);

    res.json({
      message: 'Đã thêm vào danh sách yêu thích',
      isFavorite: true,
      favorite: {
        ...newFavorite,
        product
      }
    });
  }
});

// Get favorite products with pagination
router.get('/products', requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const userFavorites = favorites
    .filter(fav => fav.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFavorites = userFavorites.slice(startIndex, endIndex);

  const favoriteProducts = paginatedFavorites.map(fav => {
    const product = products.find(p => p.id === fav.productId);
    return {
      ...fav,
      product
    };
  }).filter(fav => fav.product); // Only include if product exists

  res.json({
    products: favoriteProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(userFavorites.length / limit),
      totalItems: userFavorites.length,
      itemsPerPage: limit
    }
  });
});

export { router as favoriteRoutes };
