import express from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../data/mockData';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password: '***' });
  
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log('User not found:', username);
    return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
  }

  console.log('User found:', { id: user.id, username: user.username, passwordType: user.password.startsWith('$') ? 'hashed' : 'plain' });

  // Check if password is hashed (starts with $2a$ or $2b$) or plain text
  let isValidPassword = false;
  if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
    // Password is hashed, use bcrypt
    isValidPassword = bcrypt.compareSync(password, user.password);
    console.log('Using bcrypt comparison');
  } else {
    // Password is plain text (for mock data)
    isValidPassword = password === user.password;
    console.log('Using plain text comparison:', { provided: password, stored: user.password });
  }

  if (!isValidPassword) {
    console.log('Invalid password');
    return res.status(401).json({ message: 'Mật khẩu không đúng' });
  }

  console.log('Login successful for user:', user.username);
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
  
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    fullName,
    phone,
    address
  };

  users.push(newUser);

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
    const user = users.find(u => u.id === req.session.userId);
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

export { router as authRoutes };
