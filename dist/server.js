"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
const cart_1 = require("./routes/cart");
const orders_1 = require("./routes/orders");
const payment_1 = require("./routes/payment");
const reviews_1 = require("./routes/reviews");
const promotions_1 = require("./routes/promotions");
const favorites_1 = require("./routes/favorites");
const notifications_1 = require("./routes/notifications");
const admin_1 = require("./routes/admin");
const recommendations_1 = require("./routes/recommendations");
const delivery_1 = require("./routes/delivery");
const analytics_1 = require("./routes/analytics");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Session configuration
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
// Routes
app.use('/api/auth', auth_1.authRoutes);
app.use('/api/products', products_1.productRoutes);
app.use('/api/cart', cart_1.cartRoutes);
app.use('/api/orders', orders_1.orderRoutes);
app.use('/api/payment', payment_1.paymentRoutes);
app.use('/api/reviews', reviews_1.reviewRoutes);
app.use('/api/promotions', promotions_1.promotionRoutes);
app.use('/api/favorites', favorites_1.favoriteRoutes);
app.use('/api/notifications', notifications_1.notificationRoutes);
app.use('/api/admin', admin_1.adminRoutes);
app.use('/api/recommendations', recommendations_1.recommendationRoutes);
app.use('/api/delivery', delivery_1.deliveryRoutes);
app.use('/api/analytics', analytics_1.analyticsRoutes);
// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map