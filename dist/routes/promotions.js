"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.promotionRoutes = router;
// Mock data for promotions
let promotions = [
    {
        id: 1,
        code: 'WELCOME10',
        name: 'Chào mừng khách hàng mới',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        type: 'percentage',
        value: 10,
        minOrderAmount: 50000,
        maxDiscount: 20000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 1000,
        usedCount: 45
    },
    {
        id: 2,
        code: 'SAVE20K',
        name: 'Tiết kiệm 20k',
        description: 'Giảm 20,000 VNĐ cho đơn hàng từ 100,000 VNĐ',
        type: 'fixed',
        value: 20000,
        minOrderAmount: 100000,
        maxDiscount: 20000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 500,
        usedCount: 123
    },
    {
        id: 3,
        code: 'WEEKEND15',
        name: 'Cuối tuần vui vẻ',
        description: 'Giảm 15% cho đơn hàng cuối tuần',
        type: 'percentage',
        value: 15,
        minOrderAmount: 80000,
        maxDiscount: 30000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 200,
        usedCount: 67
    }
];
// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng mã giảm giá' });
    }
    next();
};
// Get all active promotions
router.get('/', (req, res) => {
    const activePromotions = promotions.filter(p => p.isActive && new Date() >= p.startDate && new Date() <= p.endDate);
    res.json(activePromotions);
});
// Get promotion by code
router.get('/code/:code', (req, res) => {
    const code = req.params.code.toUpperCase();
    const promotion = promotions.find(p => p.code === code && p.isActive);
    if (!promotion) {
        return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }
    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
    }
    if (promotion.usedCount >= promotion.usageLimit) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }
    res.json(promotion);
});
// Validate promotion code
router.post('/validate', requireAuth, (req, res) => {
    const { code, orderAmount } = req.body;
    const promotion = promotions.find(p => p.code === code.toUpperCase() && p.isActive);
    if (!promotion) {
        return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
    }
    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
    }
    if (promotion.usedCount >= promotion.usageLimit) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }
    if (orderAmount < promotion.minOrderAmount) {
        return res.status(400).json({
            message: `Đơn hàng phải tối thiểu ${promotion.minOrderAmount.toLocaleString('vi-VN')} VNĐ để sử dụng mã này`
        });
    }
    // Calculate discount
    let discount = 0;
    if (promotion.type === 'percentage') {
        discount = Math.min((orderAmount * promotion.value) / 100, promotion.maxDiscount);
    }
    else {
        discount = Math.min(promotion.value, promotion.maxDiscount);
    }
    res.json({
        valid: true,
        promotion,
        discount: Math.round(discount),
        finalAmount: orderAmount - Math.round(discount)
    });
});
// Apply promotion code
router.post('/apply', requireAuth, (req, res) => {
    const { code, orderAmount } = req.body;
    const promotion = promotions.find(p => p.code === code.toUpperCase() && p.isActive);
    if (!promotion) {
        return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
    }
    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
    }
    if (promotion.usedCount >= promotion.usageLimit) {
        return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }
    if (orderAmount < promotion.minOrderAmount) {
        return res.status(400).json({
            message: `Đơn hàng phải tối thiểu ${promotion.minOrderAmount.toLocaleString('vi-VN')} VNĐ để sử dụng mã này`
        });
    }
    // Calculate discount
    let discount = 0;
    if (promotion.type === 'percentage') {
        discount = Math.min((orderAmount * promotion.value) / 100, promotion.maxDiscount);
    }
    else {
        discount = Math.min(promotion.value, promotion.maxDiscount);
    }
    // Increment usage count
    promotion.usedCount++;
    res.json({
        message: 'Áp dụng mã giảm giá thành công',
        promotion,
        discount: Math.round(discount),
        finalAmount: orderAmount - Math.round(discount)
    });
});
// Admin: Create promotion
router.post('/admin/create', requireAuth, (req, res) => {
    const { code, name, description, type, value, minOrderAmount, maxDiscount, startDate, endDate, usageLimit } = req.body;
    // Check if code already exists
    const existingPromotion = promotions.find(p => p.code === code.toUpperCase());
    if (existingPromotion) {
        return res.status(400).json({ message: 'Mã giảm giá đã tồn tại' });
    }
    const newPromotion = {
        id: promotions.length + 1,
        code: code.toUpperCase(),
        name,
        description,
        type,
        value,
        minOrderAmount,
        maxDiscount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
        usageLimit,
        usedCount: 0
    };
    promotions.push(newPromotion);
    res.json({
        message: 'Tạo mã giảm giá thành công',
        promotion: newPromotion
    });
});
// Admin: Update promotion
router.put('/admin/:id', requireAuth, (req, res) => {
    const promotionId = parseInt(req.params.id);
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) {
        return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
    }
    const { name, description, isActive, usageLimit } = req.body;
    promotion.name = name || promotion.name;
    promotion.description = description || promotion.description;
    promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;
    promotion.usageLimit = usageLimit || promotion.usageLimit;
    res.json({
        message: 'Cập nhật mã giảm giá thành công',
        promotion
    });
});
// Admin: Delete promotion
router.delete('/admin/:id', requireAuth, (req, res) => {
    const promotionId = parseInt(req.params.id);
    const promotionIndex = promotions.findIndex(p => p.id === promotionId);
    if (promotionIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
    }
    promotions.splice(promotionIndex, 1);
    res.json({ message: 'Xóa mã giảm giá thành công' });
});
// Admin: Get all promotions
router.get('/admin', requireAuth, (req, res) => {
    res.json(promotions);
});
//# sourceMappingURL=promotions.js.map