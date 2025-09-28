"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.reviewRoutes = router;
// Mock data for reviews
let reviews = [
    {
        id: 1,
        userId: 2,
        productId: 1,
        rating: 5,
        comment: 'Cà phê rất ngon, đậm đà và thơm!',
        createdAt: new Date('2024-01-10'),
        user: {
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            password: '',
            fullName: 'John Doe',
            phone: '0987654321',
            address: '456 Oak Ave, Town'
        }
    },
    {
        id: 2,
        userId: 2,
        productId: 2,
        rating: 4,
        comment: 'Cà phê sữa ngọt ngào, rất thích!',
        createdAt: new Date('2024-01-12'),
        user: {
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            password: '',
            fullName: 'John Doe',
            phone: '0987654321',
            address: '456 Oak Ave, Town'
        }
    }
];
// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để đánh giá' });
    }
    next();
};
// Get reviews for a product
router.get('/product/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const productReviews = reviews
        .filter(review => review.productId === productId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Calculate average rating
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
        : 0;
    // Count ratings
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: productReviews.filter(r => r.rating === rating).length
    }));
    res.json({
        reviews: productReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: productReviews.length,
        ratingCounts
    });
});
// Add a review
router.post('/', requireAuth, (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.session.userId;
    // Validate rating
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
    }
    // Check if user already reviewed this product
    const existingReview = reviews.find(r => r.userId === userId && r.productId === productId);
    if (existingReview) {
        return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }
    const newReview = {
        id: reviews.length + 1,
        userId,
        productId,
        rating,
        comment,
        createdAt: new Date()
    };
    reviews.push(newReview);
    res.json({
        message: 'Đánh giá thành công',
        review: newReview
    });
});
// Update a review
router.put('/:reviewId', requireAuth, (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const { rating, comment } = req.body;
    const userId = req.session.userId;
    const review = reviews.find(r => r.id === reviewId && r.userId === userId);
    if (!review) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
    }
    review.rating = rating;
    review.comment = comment;
    res.json({
        message: 'Cập nhật đánh giá thành công',
        review
    });
});
// Delete a review
router.delete('/:reviewId', requireAuth, (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const userId = req.session.userId;
    const reviewIndex = reviews.findIndex(r => r.id === reviewId && r.userId === userId);
    if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    reviews.splice(reviewIndex, 1);
    res.json({ message: 'Xóa đánh giá thành công' });
});
// Get user's reviews
router.get('/user', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const userReviews = reviews
        .filter(review => review.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(userReviews);
});
//# sourceMappingURL=reviews.js.map