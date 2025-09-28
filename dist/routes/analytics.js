"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.analyticsRoutes = router;
// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để xem thống kê' });
    }
    next();
};
// Get general analytics
router.get('/overview', requireAuth, (req, res) => {
    const analytics = {
        totalOrders: mockData_1.orders.length,
        totalRevenue: mockData_1.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalUsers: mockData_1.users.length,
        totalProducts: mockData_1.products.length,
        ordersByStatus: {
            pending: mockData_1.orders.filter(o => o.status === 'pending').length,
            confirmed: mockData_1.orders.filter(o => o.status === 'confirmed').length,
            preparing: mockData_1.orders.filter(o => o.status === 'preparing').length,
            ready: mockData_1.orders.filter(o => o.status === 'ready').length,
            delivered: mockData_1.orders.filter(o => o.status === 'delivered').length,
            cancelled: mockData_1.orders.filter(o => o.status === 'cancelled').length
        },
        revenueByMonth: [
            { month: 'Tháng 1', revenue: 1500000 },
            { month: 'Tháng 2', revenue: 1800000 },
            { month: 'Tháng 3', revenue: 2200000 },
            { month: 'Tháng 4', revenue: 1900000 },
            { month: 'Tháng 5', revenue: 2500000 },
            { month: 'Tháng 6', revenue: 2800000 }
        ],
        topProducts: [
            { productId: 1, name: 'Cà phê đen', sales: 45 },
            { productId: 2, name: 'Cà phê sữa', sales: 38 },
            { productId: 3, name: 'Trà sữa trân châu', sales: 42 },
            { productId: 4, name: 'Sinh tố bơ', sales: 28 },
            { productId: 5, name: 'Nước cam tươi', sales: 35 }
        ]
    };
    res.json(analytics);
});
// Get sales analytics
router.get('/sales', requireAuth, (req, res) => {
    const { startDate, endDate, period } = req.query;
    let filteredOrders = mockData_1.orders;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = mockData_1.orders.filter(order => order.createdAt >= start && order.createdAt <= end);
    }
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    // Sales by category
    const salesByCategory = mockData_1.products.map(product => {
        const productOrders = filteredOrders.filter(order => order.items.some(item => item.productId === product.id));
        const totalSales = productOrders.reduce((sum, order) => {
            const orderItems = order.items.filter(item => item.productId === product.id);
            return sum + orderItems.reduce((itemSum, item) => itemSum + (item.quantity * product.price), 0);
        }, 0);
        return {
            category: product.category,
            totalSales,
            orderCount: productOrders.length
        };
    });
    // Group by category
    const categorySales = salesByCategory.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = { totalSales: 0, orderCount: 0 };
        }
        acc[item.category].totalSales += item.totalSales;
        acc[item.category].orderCount += item.orderCount;
        return acc;
    }, {});
    res.json({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        salesByCategory: Object.entries(categorySales).map(([category, data]) => ({
            category,
            totalSales: data.totalSales,
            orderCount: data.orderCount
        })),
        dateRange: {
            startDate: startDate || null,
            endDate: endDate || null
        }
    });
});
// Get user analytics
router.get('/users', requireAuth, (req, res) => {
    const { startDate, endDate } = req.query;
    let filteredOrders = mockData_1.orders;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = mockData_1.orders.filter(order => order.createdAt >= start && order.createdAt <= end);
    }
    // User registration over time
    const userRegistrations = mockData_1.users.map(user => ({
        date: user.id === 1 ? new Date('2024-01-01') : new Date('2024-01-10'),
        count: 1
    }));
    // Top customers
    const customerStats = filteredOrders.reduce((acc, order) => {
        if (!acc[order.userId]) {
            acc[order.userId] = { orderCount: 0, totalSpent: 0 };
        }
        acc[order.userId].orderCount++;
        acc[order.userId].totalSpent += order.totalAmount;
        return acc;
    }, {});
    const topCustomers = Object.entries(customerStats)
        .map(([userId, stats]) => {
        const user = mockData_1.users.find(u => u.id === parseInt(userId));
        return {
            userId: parseInt(userId),
            username: user?.username || 'Unknown',
            fullName: user?.fullName || 'Unknown',
            orderCount: stats.orderCount,
            totalSpent: stats.totalSpent
        };
    })
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);
    res.json({
        totalUsers: mockData_1.users.length,
        newUsers: userRegistrations.length,
        topCustomers,
        userRegistrations
    });
});
// Get product analytics
router.get('/products', requireAuth, (req, res) => {
    const { startDate, endDate } = req.query;
    let filteredOrders = mockData_1.orders;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = mockData_1.orders.filter(order => order.createdAt >= start && order.createdAt <= end);
    }
    // Product performance
    const productStats = mockData_1.products.map(product => {
        const productOrders = filteredOrders.filter(order => order.items.some(item => item.productId === product.id));
        const totalQuantity = productOrders.reduce((sum, order) => {
            const orderItems = order.items.filter(item => item.productId === product.id);
            return sum + orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);
        const totalRevenue = productOrders.reduce((sum, order) => {
            const orderItems = order.items.filter(item => item.productId === product.id);
            return sum + orderItems.reduce((itemSum, item) => itemSum + (item.quantity * product.price), 0);
        }, 0);
        return {
            productId: product.id,
            name: product.name,
            category: product.category,
            totalQuantity,
            totalRevenue,
            orderCount: productOrders.length,
            averagePrice: product.price,
            available: product.available
        };
    });
    // Category performance
    const categoryStats = mockData_1.products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = { totalRevenue: 0, totalQuantity: 0, productCount: 0 };
        }
        const productStat = productStats.find(stat => stat.productId === product.id);
        if (productStat) {
            acc[product.category].totalRevenue += productStat.totalRevenue;
            acc[product.category].totalQuantity += productStat.totalQuantity;
            acc[product.category].productCount++;
        }
        return acc;
    }, {});
    res.json({
        productStats: productStats.sort((a, b) => b.totalRevenue - a.totalRevenue),
        categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
            category,
            ...stats
        })),
        totalProducts: mockData_1.products.length,
        availableProducts: mockData_1.products.filter(p => p.available).length
    });
});
// Get order analytics
router.get('/orders', requireAuth, (req, res) => {
    const { startDate, endDate, status } = req.query;
    let filteredOrders = mockData_1.orders;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = mockData_1.orders.filter(order => order.createdAt >= start && order.createdAt <= end);
    }
    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    // Order status distribution
    const statusDistribution = filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    // Orders by hour
    const ordersByHour = Array.from({ length: 24 }, (_, hour) => {
        const hourOrders = filteredOrders.filter(order => new Date(order.createdAt).getHours() === hour);
        return {
            hour,
            count: hourOrders.length,
            revenue: hourOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        };
    });
    // Average order value by status
    const avgOrderValueByStatus = Object.keys(statusDistribution).map(status => {
        const statusOrders = filteredOrders.filter(order => order.status === status);
        const totalRevenue = statusOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        return {
            status,
            count: statusOrders.length,
            averageValue: statusOrders.length > 0 ? totalRevenue / statusOrders.length : 0,
            totalRevenue
        };
    });
    res.json({
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: filteredOrders.length > 0 ?
            filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length : 0,
        statusDistribution,
        ordersByHour,
        avgOrderValueByStatus
    });
});
// Get revenue analytics
router.get('/revenue', requireAuth, (req, res) => {
    const { period = 'month' } = req.query;
    // Mock revenue data by period
    let revenueData = [];
    if (period === 'day') {
        revenueData = [
            { period: '2024-01-15', revenue: 150000, orders: 5 },
            { period: '2024-01-14', revenue: 200000, orders: 7 },
            { period: '2024-01-13', revenue: 180000, orders: 6 },
            { period: '2024-01-12', revenue: 220000, orders: 8 },
            { period: '2024-01-11', revenue: 160000, orders: 5 }
        ];
    }
    else if (period === 'week') {
        revenueData = [
            { period: 'Tuần 1', revenue: 1200000, orders: 35 },
            { period: 'Tuần 2', revenue: 1400000, orders: 42 },
            { period: 'Tuần 3', revenue: 1600000, orders: 48 },
            { period: 'Tuần 4', revenue: 1800000, orders: 55 }
        ];
    }
    else {
        revenueData = [
            { period: 'Tháng 1', revenue: 1500000, orders: 45 },
            { period: 'Tháng 2', revenue: 1800000, orders: 52 },
            { period: 'Tháng 3', revenue: 2200000, orders: 65 },
            { period: 'Tháng 4', revenue: 1900000, orders: 58 },
            { period: 'Tháng 5', revenue: 2500000, orders: 75 },
            { period: 'Tháng 6', revenue: 2800000, orders: 82 }
        ];
    }
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
    const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;
    res.json({
        revenueData,
        totalRevenue,
        totalOrders,
        averageRevenue,
        period,
        growth: calculateGrowth(revenueData)
    });
});
// Helper function to calculate growth
function calculateGrowth(data) {
    if (data.length < 2)
        return 0;
    const latest = data[data.length - 1].revenue;
    const previous = data[data.length - 2].revenue;
    return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
}
//# sourceMappingURL=analytics.js.map