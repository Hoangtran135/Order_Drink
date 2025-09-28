import express from 'express';
import { Analytics } from '../types';
import { users, products, orders } from '../data/mockData';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để xem thống kê' });
  }
  next();
};

// Get general analytics
router.get('/overview', requireAuth, (req, res) => {
  const analytics: Analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalUsers: users.length,
    totalProducts: products.length,
    ordersByStatus: {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
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

  let filteredOrders = orders;
  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    filteredOrders = orders.filter(order => 
      order.createdAt >= start && order.createdAt <= end
    );
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Sales by category
  const salesByCategory = products.map(product => {
    const productOrders = filteredOrders.filter(order => 
      order.items.some(item => item.productId === product.id)
    );
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
  }, {} as { [key: string]: { totalSales: number; orderCount: number } });

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

  let filteredOrders = orders;
  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    filteredOrders = orders.filter(order => 
      order.createdAt >= start && order.createdAt <= end
    );
  }

  // User registration over time
  const userRegistrations = users.map(user => ({
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
  }, {} as { [key: number]: { orderCount: number; totalSpent: number } });

  const topCustomers = Object.entries(customerStats)
    .map(([userId, stats]) => {
      const user = users.find(u => u.id === parseInt(userId));
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
    totalUsers: users.length,
    newUsers: userRegistrations.length,
    topCustomers,
    userRegistrations
  });
});

// Get product analytics
router.get('/products', requireAuth, (req, res) => {
  const { startDate, endDate } = req.query;

  let filteredOrders = orders;
  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    filteredOrders = orders.filter(order => 
      order.createdAt >= start && order.createdAt <= end
    );
  }

  // Product performance
  const productStats = products.map(product => {
    const productOrders = filteredOrders.filter(order => 
      order.items.some(item => item.productId === product.id)
    );
    
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
  const categoryStats = products.reduce((acc, product) => {
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
  }, {} as { [key: string]: { totalRevenue: number; totalQuantity: number; productCount: number } });

  res.json({
    productStats: productStats.sort((a, b) => b.totalRevenue - a.totalRevenue),
    categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats
    })),
    totalProducts: products.length,
    availableProducts: products.filter(p => p.available).length
  });
});

// Get order analytics
router.get('/orders', requireAuth, (req, res) => {
  const { startDate, endDate, status } = req.query;

  let filteredOrders = orders;
  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    filteredOrders = orders.filter(order => 
      order.createdAt >= start && order.createdAt <= end
    );
  }

  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  // Order status distribution
  const statusDistribution = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Orders by hour
  const ordersByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourOrders = filteredOrders.filter(order => 
      new Date(order.createdAt).getHours() === hour
    );
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
  let revenueData: { period: string; revenue: number; orders: number }[] = [];

  if (period === 'day') {
    revenueData = [
      { period: '2024-01-15', revenue: 150000, orders: 5 },
      { period: '2024-01-14', revenue: 200000, orders: 7 },
      { period: '2024-01-13', revenue: 180000, orders: 6 },
      { period: '2024-01-12', revenue: 220000, orders: 8 },
      { period: '2024-01-11', revenue: 160000, orders: 5 }
    ];
  } else if (period === 'week') {
    revenueData = [
      { period: 'Tuần 1', revenue: 1200000, orders: 35 },
      { period: 'Tuần 2', revenue: 1400000, orders: 42 },
      { period: 'Tuần 3', revenue: 1600000, orders: 48 },
      { period: 'Tuần 4', revenue: 1800000, orders: 55 }
    ];
  } else {
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
function calculateGrowth(data: { revenue: number }[]): number {
  if (data.length < 2) return 0;
  
  const latest = data[data.length - 1].revenue;
  const previous = data[data.length - 2].revenue;
  
  return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
}

export { router as analyticsRoutes };
