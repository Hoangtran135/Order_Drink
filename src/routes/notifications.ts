import express from 'express';
import { Notification } from '../types';

const router = express.Router();

// Mock data for notifications
let notifications: Notification[] = [
  {
    id: 1,
    userId: 2,
    title: 'Đơn hàng đã được xác nhận',
    message: 'Đơn hàng #12345 của bạn đã được xác nhận và đang được chuẩn bị',
    type: 'success',
    isRead: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    data: { orderId: 12345 }
  },
  {
    id: 2,
    userId: 2,
    title: 'Khuyến mãi mới',
    message: 'Mã giảm giá WELCOME10 - Giảm 10% cho đơn hàng đầu tiên',
    type: 'info',
    isRead: false,
    createdAt: new Date('2024-01-14T15:20:00'),
    data: { promotionCode: 'WELCOME10' }
  },
  {
    id: 3,
    userId: 2,
    title: 'Đơn hàng đã giao thành công',
    message: 'Đơn hàng #12345 đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ!',
    type: 'success',
    isRead: true,
    createdAt: new Date('2024-01-13T14:45:00'),
    data: { orderId: 12345 }
  }
];

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để xem thông báo' });
  }
  next();
};

// Get user notifications
router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const unreadOnly = req.query.unread === 'true';

  let userNotifications = notifications
    .filter(notif => notif.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (unreadOnly) {
    userNotifications = userNotifications.filter(notif => !notif.isRead);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

  const unreadCount = notifications.filter(notif => notif.userId === userId && !notif.isRead).length;

  res.json({
    notifications: paginatedNotifications,
    unreadCount,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(userNotifications.length / limit),
      totalItems: userNotifications.length,
      itemsPerPage: limit
    }
  });
});

// Mark notification as read
router.put('/:notificationId/read', requireAuth, (req, res) => {
  const notificationId = parseInt(req.params.notificationId);
  const userId = req.session.userId!;

  const notification = notifications.find(notif => notif.id === notificationId && notif.userId === userId);
  if (!notification) {
    return res.status(404).json({ message: 'Không tìm thấy thông báo' });
  }

  notification.isRead = true;

  res.json({
    message: 'Đã đánh dấu thông báo là đã đọc',
    notification
  });
});

// Mark all notifications as read
router.put('/read-all', requireAuth, (req, res) => {
  const userId = req.session.userId!;

  notifications
    .filter(notif => notif.userId === userId && !notif.isRead)
    .forEach(notif => {
      notif.isRead = true;
    });

  res.json({ message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
});

// Delete notification
router.delete('/:notificationId', requireAuth, (req, res) => {
  const notificationId = parseInt(req.params.notificationId);
  const userId = req.session.userId!;

  const notificationIndex = notifications.findIndex(notif => notif.id === notificationId && notif.userId === userId);
  if (notificationIndex === -1) {
    return res.status(404).json({ message: 'Không tìm thấy thông báo' });
  }

  notifications.splice(notificationIndex, 1);

  res.json({ message: 'Đã xóa thông báo' });
});

// Delete all notifications
router.delete('/all', requireAuth, (req, res) => {
  const userId = req.session.userId!;

  notifications = notifications.filter(notif => notif.userId !== userId);

  res.json({ message: 'Đã xóa tất cả thông báo' });
});

// Get unread count
router.get('/unread-count', requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const unreadCount = notifications.filter(notif => notif.userId === userId && !notif.isRead).length;

  res.json({ unreadCount });
});

// Create notification (for admin or system)
router.post('/create', requireAuth, (req, res) => {
  const { userId, title, message, type, data } = req.body;

  const newNotification: Notification = {
    id: notifications.length + 1,
    userId,
    title,
    message,
    type: type || 'info',
    isRead: false,
    createdAt: new Date(),
    data
  };

  notifications.push(newNotification);

  res.json({
    message: 'Tạo thông báo thành công',
    notification: newNotification
  });
});

// Create notification for all users (broadcast)
router.post('/broadcast', requireAuth, (req, res) => {
  const { title, message, type, data } = req.body;

  // Get all unique user IDs
  const allUserIds = [...new Set(notifications.map(notif => notif.userId))];

  const broadcastNotifications = allUserIds.map(userId => ({
    id: notifications.length + allUserIds.indexOf(userId) + 1,
    userId,
    title,
    message,
    type: type || 'info',
    isRead: false,
    createdAt: new Date(),
    data
  }));

  notifications.push(...broadcastNotifications);

  res.json({
    message: 'Đã gửi thông báo đến tất cả người dùng',
    count: broadcastNotifications.length
  });
});

export { router as notificationRoutes };
