"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.recommendationRoutes = router;
// Mock data for user preferences and behavior
const userPreferences = {
    2: ['Coffee', 'Tea'] // User 2 likes Coffee and Tea
};
const userPurchaseHistory = {
    2: [1, 2, 3, 1, 2] // User 2 has purchased products 1, 2, 3, 1, 2
};
// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để xem gợi ý' });
    }
    next();
};
// Get personalized recommendations
router.get('/personalized', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit) || 6;
    const recommendations = getPersonalizedRecommendations(userId, limit);
    res.json({
        recommendations,
        total: recommendations.length
    });
});
// Get trending products
router.get('/trending', (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    const trendingProducts = getTrendingProducts(limit);
    res.json({
        trending: trendingProducts,
        total: trendingProducts.length
    });
});
// Get similar products
router.get('/similar/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const limit = parseInt(req.query.limit) || 4;
    const product = mockData_1.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    const similarProducts = getSimilarProducts(productId, limit);
    res.json({
        product,
        similar: similarProducts,
        total: similarProducts.length
    });
});
// Get category recommendations
router.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const limit = parseInt(req.query.limit) || 6;
    const categoryProducts = mockData_1.products
        .filter(p => p.category === category && p.available)
        .slice(0, limit);
    res.json({
        category,
        products: categoryProducts,
        total: categoryProducts.length
    });
});
// Get frequently bought together
router.get('/frequently-bought-together/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const limit = parseInt(req.query.limit) || 4;
    const frequentlyBoughtTogether = getFrequentlyBoughtTogether(productId, limit);
    res.json({
        productId,
        products: frequentlyBoughtTogether,
        total: frequentlyBoughtTogether.length
    });
});
// Get seasonal recommendations
router.get('/seasonal', (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    const currentMonth = new Date().getMonth() + 1;
    let seasonalProducts = [];
    // Seasonal logic based on month
    if (currentMonth >= 3 && currentMonth <= 5) {
        // Spring - Fresh drinks
        seasonalProducts = mockData_1.products.filter(p => p.category === 'Juice' || p.category === 'Smoothie');
    }
    else if (currentMonth >= 6 && currentMonth <= 8) {
        // Summer - Cold drinks
        seasonalProducts = mockData_1.products.filter(p => p.category === 'Smoothie' || p.category === 'Juice');
    }
    else if (currentMonth >= 9 && currentMonth <= 11) {
        // Autumn - Warm drinks
        seasonalProducts = mockData_1.products.filter(p => p.category === 'Coffee' || p.category === 'Tea');
    }
    else {
        // Winter - Hot drinks
        seasonalProducts = mockData_1.products.filter(p => p.category === 'Coffee' || p.category === 'Tea');
    }
    seasonalProducts = seasonalProducts
        .filter(p => p.available)
        .slice(0, limit);
    res.json({
        season: getSeasonName(currentMonth),
        products: seasonalProducts,
        total: seasonalProducts.length
    });
});
// Helper functions
function getPersonalizedRecommendations(userId, limit) {
    const userPrefs = userPreferences[userId] || [];
    const purchaseHistory = userPurchaseHistory[userId] || [];
    // Get products from preferred categories
    let recommendedProducts = mockData_1.products.filter(p => userPrefs.includes(p.category) && p.available);
    // Remove already purchased products
    recommendedProducts = recommendedProducts.filter(p => !purchaseHistory.includes(p.id));
    // Add products from similar categories
    const similarCategories = getSimilarCategories(userPrefs);
    const similarProducts = mockData_1.products.filter(p => similarCategories.includes(p.category) &&
        p.available &&
        !purchaseHistory.includes(p.id));
    recommendedProducts = [...recommendedProducts, ...similarProducts];
    // Remove duplicates and limit results
    const uniqueProducts = recommendedProducts.filter((product, index, self) => index === self.findIndex(p => p.id === product.id));
    return uniqueProducts.slice(0, limit);
}
function getTrendingProducts(limit) {
    // Mock trending logic - in real app, this would be based on sales data
    const trendingProductIds = [1, 3, 2, 5, 4, 6];
    return trendingProductIds
        .map(id => mockData_1.products.find(p => p.id === id))
        .filter(p => p && p.available)
        .slice(0, limit);
}
function getSimilarProducts(productId, limit) {
    const product = mockData_1.products.find(p => p.id === productId);
    if (!product)
        return [];
    return mockData_1.products
        .filter(p => p.id !== productId &&
        p.category === product.category &&
        p.available)
        .slice(0, limit);
}
function getFrequentlyBoughtTogether(productId, limit) {
    // Mock data for frequently bought together
    const frequentlyBoughtMap = {
        1: [2, 6], // Coffee black with coffee milk and cappuccino
        2: [1, 6], // Coffee milk with coffee black and cappuccino
        3: [4, 5], // Bubble tea with smoothie and juice
        4: [3, 5], // Smoothie with bubble tea and juice
        5: [3, 4], // Juice with bubble tea and smoothie
        6: [1, 2] // Cappuccino with coffee black and coffee milk
    };
    const relatedProductIds = frequentlyBoughtMap[productId] || [];
    return relatedProductIds
        .map(id => mockData_1.products.find(p => p.id === id))
        .filter(p => p && p.available)
        .slice(0, limit);
}
function getSimilarCategories(categories) {
    const categoryMap = {
        'Coffee': ['Tea'],
        'Tea': ['Coffee'],
        'Smoothie': ['Juice'],
        'Juice': ['Smoothie']
    };
    const similarCategories = [];
    categories.forEach(category => {
        const similar = categoryMap[category] || [];
        similarCategories.push(...similar);
    });
    return [...new Set(similarCategories)];
}
function getSeasonName(month) {
    if (month >= 3 && month <= 5)
        return 'Xuân';
    if (month >= 6 && month <= 8)
        return 'Hè';
    if (month >= 9 && month <= 11)
        return 'Thu';
    return 'Đông';
}
// Update user preferences (for learning)
router.post('/preferences', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { categories, productId } = req.body;
    if (categories) {
        userPreferences[userId] = categories;
    }
    if (productId) {
        if (!userPurchaseHistory[userId]) {
            userPurchaseHistory[userId] = [];
        }
        userPurchaseHistory[userId].push(productId);
    }
    res.json({ message: 'Cập nhật sở thích thành công' });
});
//# sourceMappingURL=recommendations.js.map