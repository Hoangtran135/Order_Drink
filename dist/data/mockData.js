"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = exports.products = exports.users = void 0;
exports.users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        fullName: 'Admin User',
        phone: '0123456789',
        address: '123 Main St, City'
    },
    {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        fullName: 'John Doe',
        phone: '0987654321',
        address: '456 Oak Ave, Town'
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
        phone: '0987654321'
    }
];
//# sourceMappingURL=mockData.js.map