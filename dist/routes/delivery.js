"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.deliveryRoutes = router;
// Mock delivery tracking data
const deliveryTracking = {
    1: [
        {
            id: 1,
            status: 'confirmed',
            message: 'Đơn hàng đã được xác nhận',
            timestamp: new Date('2024-01-15T10:00:00'),
            location: 'Cửa hàng'
        },
        {
            id: 2,
            status: 'preparing',
            message: 'Đang chuẩn bị đồ uống',
            timestamp: new Date('2024-01-15T10:15:00'),
            location: 'Cửa hàng'
        },
        {
            id: 3,
            status: 'ready',
            message: 'Đồ uống đã sẵn sàng',
            timestamp: new Date('2024-01-15T10:30:00'),
            location: 'Cửa hàng'
        },
        {
            id: 4,
            status: 'out_for_delivery',
            message: 'Đang giao hàng',
            timestamp: new Date('2024-01-15T10:45:00'),
            location: 'Trên đường giao hàng'
        },
        {
            id: 5,
            status: 'delivered',
            message: 'Đã giao hàng thành công',
            timestamp: new Date('2024-01-15T11:00:00'),
            location: '456 Oak Ave, Town'
        }
    ]
};
// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để theo dõi giao hàng' });
    }
    next();
};
// Get delivery tracking for an order
router.get('/track/:orderId', requireAuth, (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const userId = req.session.userId;
    const order = mockData_1.orders.find(o => o.id === orderId && o.userId === userId);
    if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    const tracking = deliveryTracking[orderId] || [];
    const currentStatus = order.status;
    res.json({
        order,
        tracking,
        currentStatus,
        estimatedDelivery: getEstimatedDelivery(order.createdAt, currentStatus)
    });
});
// Get all user's delivery tracking
router.get('/my-deliveries', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const userOrders = mockData_1.orders.filter(o => o.userId === userId);
    const deliveries = userOrders.map(order => ({
        order,
        tracking: deliveryTracking[order.id] || [],
        currentStatus: order.status,
        estimatedDelivery: getEstimatedDelivery(order.createdAt, order.status)
    }));
    res.json(deliveries);
});
// Update delivery status (for admin/delivery staff)
router.put('/update-status/:orderId', requireAuth, (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const { status, message, location } = req.body;
    const order = mockData_1.orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    // Update order status
    order.status = status;
    // Add tracking entry
    if (!deliveryTracking[orderId]) {
        deliveryTracking[orderId] = [];
    }
    const newTrackingEntry = {
        id: deliveryTracking[orderId].length + 1,
        status,
        message: message || getStatusMessage(status),
        timestamp: new Date(),
        location: location || getStatusLocation(status)
    };
    deliveryTracking[orderId].push(newTrackingEntry);
    res.json({
        message: 'Cập nhật trạng thái giao hàng thành công',
        order,
        tracking: deliveryTracking[orderId]
    });
});
// Get delivery statistics
router.get('/stats', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const userOrders = mockData_1.orders.filter(o => o.userId === userId);
    const stats = {
        totalOrders: userOrders.length,
        deliveredOrders: userOrders.filter(o => o.status === 'delivered').length,
        pendingOrders: userOrders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length,
        cancelledOrders: userOrders.filter(o => o.status === 'cancelled').length,
        averageDeliveryTime: calculateAverageDeliveryTime(userOrders)
    };
    res.json(stats);
});
// Get delivery zones and estimated times
router.get('/zones', (req, res) => {
    const zones = [
        {
            id: 1,
            name: 'Quận 1',
            estimatedTime: '15-20 phút',
            deliveryFee: 10000
        },
        {
            id: 2,
            name: 'Quận 2',
            estimatedTime: '20-25 phút',
            deliveryFee: 15000
        },
        {
            id: 3,
            name: 'Quận 3',
            estimatedTime: '15-20 phút',
            deliveryFee: 10000
        },
        {
            id: 4,
            name: 'Quận 7',
            estimatedTime: '25-30 phút',
            deliveryFee: 20000
        },
        {
            id: 5,
            name: 'Quận 10',
            estimatedTime: '20-25 phút',
            deliveryFee: 15000
        }
    ];
    res.json(zones);
});
// Calculate delivery fee
router.post('/calculate-fee', (req, res) => {
    const { address, orderAmount } = req.body;
    // Mock delivery fee calculation
    let deliveryFee = 0;
    let estimatedTime = '15-20 phút';
    if (address.includes('Quận 1') || address.includes('Quận 3')) {
        deliveryFee = 10000;
        estimatedTime = '15-20 phút';
    }
    else if (address.includes('Quận 2') || address.includes('Quận 10')) {
        deliveryFee = 15000;
        estimatedTime = '20-25 phút';
    }
    else if (address.includes('Quận 7')) {
        deliveryFee = 20000;
        estimatedTime = '25-30 phút';
    }
    else {
        deliveryFee = 25000;
        estimatedTime = '30-35 phút';
    }
    // Free delivery for orders over 200,000 VNĐ
    if (orderAmount >= 200000) {
        deliveryFee = 0;
    }
    res.json({
        deliveryFee,
        estimatedTime,
        freeDeliveryThreshold: 200000,
        isFreeDelivery: orderAmount >= 200000
    });
});
// Helper functions
function getEstimatedDelivery(createdAt, currentStatus) {
    const baseTime = new Date(createdAt);
    switch (currentStatus) {
        case 'pending':
            return new Date(baseTime.getTime() + 30 * 60 * 1000); // +30 minutes
        case 'confirmed':
            return new Date(baseTime.getTime() + 25 * 60 * 1000); // +25 minutes
        case 'preparing':
            return new Date(baseTime.getTime() + 20 * 60 * 1000); // +20 minutes
        case 'ready':
            return new Date(baseTime.getTime() + 15 * 60 * 1000); // +15 minutes
        case 'delivered':
            return new Date(baseTime.getTime()); // Already delivered
        default:
            return new Date(baseTime.getTime() + 30 * 60 * 1000);
    }
}
function getStatusMessage(status) {
    const messages = {
        'pending': 'Đơn hàng đang chờ xử lý',
        'confirmed': 'Đơn hàng đã được xác nhận',
        'preparing': 'Đang chuẩn bị đồ uống',
        'ready': 'Đồ uống đã sẵn sàng',
        'out_for_delivery': 'Đang giao hàng',
        'delivered': 'Đã giao hàng thành công',
        'cancelled': 'Đơn hàng đã bị hủy'
    };
    return messages[status] || 'Trạng thái không xác định';
}
function getStatusLocation(status) {
    const locations = {
        'pending': 'Cửa hàng',
        'confirmed': 'Cửa hàng',
        'preparing': 'Cửa hàng',
        'ready': 'Cửa hàng',
        'out_for_delivery': 'Trên đường giao hàng',
        'delivered': 'Địa chỉ giao hàng',
        'cancelled': 'Cửa hàng'
    };
    return locations[status] || 'Cửa hàng';
}
function calculateAverageDeliveryTime(userOrders) {
    const deliveredOrders = userOrders.filter(o => o.status === 'delivered');
    if (deliveredOrders.length === 0)
        return 0;
    const totalTime = deliveredOrders.reduce((sum, order) => {
        const deliveryTime = new Date().getTime() - new Date(order.createdAt).getTime();
        return sum + deliveryTime;
    }, 0);
    return Math.round(totalTime / deliveredOrders.length / (1000 * 60)); // in minutes
}
//# sourceMappingURL=delivery.js.map