"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favorites = exports.notifications = exports.promotions = exports.reviews = exports.orders = exports.products = exports.users = void 0;
exports.users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '123456', // password
        fullName: 'Admin User',
        phone: '0123456789',
        address: '123 Main St, City'
    },
    {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: '123456', // password
        fullName: 'John Doe',
        phone: '0987654321',
        address: '456 Oak Ave, Town'
    },
    {
        id: 3,
        username: 'test',
        email: 'test@example.com',
        password: 'test123', // password
        fullName: 'Test User',
        phone: '0123456789',
        address: '789 Test St, City'
    },
    {
        id: 4,
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123', // password
        fullName: 'Demo User',
        phone: '0987654321',
        address: '321 Demo Ave, Town'
    }
];
exports.products = [
    {
        id: 1,
        name: 'Cà phê đen',
        description: 'Cà phê đen truyền thống, đậm đà và thơm ngon',
        price: 25000,
        image: '/images/coffee-black.jpg',
        category: 'Coffee',
        available: true
    },
    {
        id: 2,
        name: 'Cà phê sữa',
        description: 'Cà phê sữa đặc biệt, ngọt ngào và béo ngậy',
        price: 30000,
        image: '/images/coffee-milk.jpg',
        category: 'Coffee',
        available: true
    },
    {
        id: 3,
        name: 'Trà sữa trân châu',
        description: 'Trà sữa với trân châu đen, ngọt ngào và thơm ngon',
        price: 35000,
        image: '/images/bubble-tea.jpg',
        category: 'Tea',
        available: true
    },
    {
        id: 4,
        name: 'Sinh tố bơ',
        description: 'Sinh tố bơ tươi, bổ dưỡng và thơm ngon',
        price: 40000,
        image: '/images/avocado-smoothie.jpg',
        category: 'Smoothie',
        available: true
    },
    {
        id: 5,
        name: 'Nước cam tươi',
        description: 'Nước cam tươi vắt, giàu vitamin C',
        price: 20000,
        image: '/images/orange-juice.jpg',
        category: 'Juice',
        available: true
    },
    {
        id: 6,
        name: 'Cappuccino',
        description: 'Cappuccino Ý với lớp foam mịn màng',
        price: 45000,
        image: '/images/cappuccino.jpg',
        category: 'Coffee',
        available: true
    }
];
exports.orders = [
    {
        id: 1,
        userId: 2,
        items: [
            { productId: 1, quantity: 2 },
            { productId: 3, quantity: 1 }
        ],
        totalAmount: 85000,
        status: 'delivered',
        createdAt: new Date('2024-01-15'),
        deliveryAddress: '456 Oak Ave, Town',
        phone: '0987654321',
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        deliveryFee: 10000,
        discount: 5000,
        finalAmount: 90000
    },
    {
        id: 2,
        userId: 1,
        items: [
            { productId: 2, quantity: 1 },
            { productId: 4, quantity: 2 }
        ],
        totalAmount: 110000,
        status: 'pending',
        createdAt: new Date('2024-01-20'),
        deliveryAddress: '123 Main St, City',
        phone: '0123456789',
        paymentMethod: 'card',
        paymentStatus: 'pending',
        deliveryFee: 15000,
        discount: 0,
        finalAmount: 125000
    }
];
exports.reviews = [
    {
        id: 1,
        userId: 2,
        productId: 1,
        rating: 5,
        comment: 'Cà phê rất ngon, đậm đà!',
        createdAt: new Date('2024-01-16'),
        user: exports.users[1]
    },
    {
        id: 2,
        userId: 3,
        productId: 2,
        rating: 4,
        comment: 'Cà phê sữa ngọt ngào, rất thích!',
        createdAt: new Date('2024-01-17'),
        user: exports.users[2]
    }
];
exports.promotions = [
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
        usedCount: 50
    },
    {
        id: 2,
        code: 'SAVE20K',
        name: 'Tiết kiệm 20k',
        description: 'Giảm 20k cho đơn hàng từ 100k',
        type: 'fixed',
        value: 20000,
        minOrderAmount: 100000,
        maxDiscount: 20000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 500,
        usedCount: 25
    }
];
exports.notifications = [
    {
        id: 1,
        userId: 2,
        title: 'Đơn hàng đã được xác nhận',
        message: 'Đơn hàng #1 của bạn đã được xác nhận và đang chuẩn bị',
        type: 'success',
        isRead: false,
        createdAt: new Date('2024-01-15T10:00:00'),
        data: { orderId: 1 }
    },
    {
        id: 2,
        userId: 2,
        title: 'Đơn hàng đã giao thành công',
        message: 'Đơn hàng #1 đã được giao thành công. Cảm ơn bạn!',
        type: 'info',
        isRead: true,
        createdAt: new Date('2024-01-15T15:30:00'),
        data: { orderId: 1 }
    }
];
exports.favorites = [
    {
        id: 1,
        userId: 2,
        productId: 1,
        createdAt: new Date('2024-01-10'),
        product: exports.products[0]
    },
    {
        id: 2,
        userId: 2,
        productId: 3,
        createdAt: new Date('2024-01-12'),
        product: exports.products[2]
    }
];
//# sourceMappingURL=mockData.js.map