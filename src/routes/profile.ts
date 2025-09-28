import { Router, Request, Response } from 'express';
import { users } from '../data/mockData';

const router = Router();

// Update user profile
router.put('/profile', (req: Request, res: Response) => {
    try {
        const { fullName, email, phone, address } = req.body;
        const userId = req.headers['user-id'] as string;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            fullName: fullName || users[userIndex].fullName,
            email: email || users[userIndex].email,
            phone: phone || users[userIndex].phone,
            address: address || users[userIndex].address
        };
        
        res.json({ 
            success: true, 
            message: 'Cập nhật thông tin thành công',
            user: users[userIndex]
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Change password
router.post('/change-password', (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.headers['user-id'] as string;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        // Check current password
        if (users[userIndex].password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
        }
        
        // Update password
        users[userIndex].password = newPassword;
        
        res.json({ 
            success: true, 
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Get user profile
router.get('/profile', (req: Request, res: Response) => {
    try {
        const userId = req.headers['user-id'] as string;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }
        
        const user = users.find(user => user.id === parseInt(userId));
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        // Return user data without password
        const { password, ...userProfile } = user;
        res.json({ 
            success: true, 
            user: userProfile
        });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

export default router;
