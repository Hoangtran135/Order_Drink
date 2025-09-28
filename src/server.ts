import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { SessionData } from './types';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { paymentRoutes } from './routes/payment';
import { reviewRoutes } from './routes/reviews';
import { promotionRoutes } from './routes/promotions';
import { favoriteRoutes } from './routes/favorites';
import { notificationRoutes } from './routes/notifications';
import { adminRoutes } from './routes/admin';
import { recommendationRoutes } from './routes/recommendations';
import { deliveryRoutes } from './routes/delivery';
import { analyticsRoutes } from './routes/analytics';
import profileRoutes from './routes/profile';

declare module 'express-session' {
  interface Session {
    userId?: number;
    username?: string;
    cart?: any[];
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', profileRoutes);

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
