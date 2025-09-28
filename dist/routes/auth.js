"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.authRoutes = router;
// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = mockData_1.users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
    }
    const isValidPassword = bcryptjs_1.default.compareSync(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({
        message: 'Đăng nhập thành công',
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        }
    });
});
// Register
router.post('/register', (req, res) => {
    const { username, email, password, fullName, phone, address } = req.body;
    const existingUser = mockData_1.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const newUser = {
        id: mockData_1.users.length + 1,
        username,
        email,
        password: hashedPassword,
        fullName,
        phone,
        address
    };
    mockData_1.users.push(newUser);
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    res.json({
        message: 'Đăng ký thành công',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName
        }
    });
});
// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
        }
        res.json({ message: 'Đăng xuất thành công' });
    });
});
// Check auth status
router.get('/me', (req, res) => {
    if (req.session.userId) {
        const user = mockData_1.users.find(u => u.id === req.session.userId);
        if (user) {
            return res.json({
                isAuthenticated: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName
                }
            });
        }
    }
    res.json({ isAuthenticated: false });
});
//# sourceMappingURL=auth.js.map