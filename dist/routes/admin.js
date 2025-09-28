"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.adminRoutes = router;
// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }
    const user = mockData_1.users.find(u => u.id === req.session.userId);
    if (!user || user.username !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
};
// Get dashboard analytics
router.get('/analytics', requireAdmin, (req, res) => {
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
// Get all orders for admin
router.get('/orders', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    let filteredOrders = mockData_1.orders;
    if (status) {
        filteredOrders = mockData_1.orders.filter(order => order.status === status);
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    res.json({
        orders: paginatedOrders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredOrders.length / limit),
            totalItems: filteredOrders.length,
            itemsPerPage: limit
        }
    });
});
// Update order status
router.put('/orders/:orderId/status', requireAdmin, (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;
    const order = mockData_1.orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    order.status = status;
    res.json({
        message: 'Cập nhật trạng thái đơn hàng thành công',
        order
    });
});
// Get all users
router.get('/users', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockData_1.users.slice(startIndex, endIndex);
    // Remove password from response
    const safeUsers = paginatedUsers.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });
    res.json({
        users: safeUsers,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockData_1.users.length / limit),
            totalItems: mockData_1.users.length,
            itemsPerPage: limit
        }
    });
});
// Get user details
router.get('/users/:userId', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = mockData_1.users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    const { password, ...safeUser } = user;
    const userOrders = mockData_1.orders.filter(o => o.userId === userId);
    res.json({
        user: safeUser,
        orders: userOrders,
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    });
});
// Get all products
router.get('/products', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = mockData_1.products.slice(startIndex, endIndex);
    res.json({
        products: paginatedProducts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockData_1.products.length / limit),
            totalItems: mockData_1.products.length,
            itemsPerPage: limit
        }
    });
});
// Create product
router.post('/products', requireAdmin, (req, res) => {
    const { name, description, price, image, category, available } = req.body;
    const newProduct = {
        id: mockData_1.products.length + 1,
        name,
        description,
        price,
        image,
        category,
        available: available !== false
    };
    mockData_1.products.push(newProduct);
    res.json({
        message: 'Tạo sản phẩm thành công',
        product: newProduct
    });
});
// Update product
router.put('/products/:productId', requireAdmin, (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = mockData_1.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    const { name, description, price, image, category, available } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.available = available !== undefined ? available : product.available;
    res.json({
        message: 'Cập nhật sản phẩm thành công',
        product
    });
});
// Delete product
router.delete('/products/:productId', requireAdmin, (req, res) => {
    const productId = parseInt(req.params.productId);
    const productIndex = mockData_1.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    mockData_1.products.splice(productIndex, 1);
    res.json({ message: 'Xóa sản phẩm thành công' });
});
// Get recent activities
router.get('/activities', requireAdmin, (req, res) => {
    const activities = [
        {
            id: 1,
            type: 'order',
            message: 'Đơn hàng mới #12345',
            timestamp: new Date('2024-01-15T10:30:00'),
            user: 'John Doe'
        },
        {
            id: 2,
            type: 'user',
            message: 'Người dùng mới đăng ký',
            timestamp: new Date('2024-01-15T09:15:00'),
            user: 'Jane Smith'
        },
        {
            id: 3,
            type: 'product',
            message: 'Sản phẩm mới được thêm',
            timestamp: new Date('2024-01-15T08:45:00'),
            user: 'Admin'
        }
    ];
    res.json(activities);
});
// Get sales report
router.get('/sales-report', requireAdmin, (req, res) => {
    const { startDate, endDate } = req.query;
    let filteredOrders = mockData_1.orders;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = mockData_1.orders.filter(order => order.createdAt >= start && order.createdAt <= end);
    }
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const ordersByStatus = {
        pending: filteredOrders.filter(o => o.status === 'pending').length,
        confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
        preparing: filteredOrders.filter(o => o.status === 'preparing').length,
        ready: filteredOrders.filter(o => o.status === 'ready').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    };
    res.json({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        ordersByStatus,
        dateRange: {
            startDate: startDate || null,
            endDate: endDate || null
        }
    });
});
//# sourceMappingURL=admin.js.map