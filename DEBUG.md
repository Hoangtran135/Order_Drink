# Hướng dẫn Debug - Đăng nhập không hoạt động

## Vấn đề đã được sửa

### 1. **Vấn đề chính**: Mật khẩu trong mock data
- **Trước**: Mật khẩu được lưu dưới dạng plain text (`'123456'`)
- **Sau**: Hệ thống xử lý cả plain text và hashed password

### 2. **Tài khoản mẫu đã sửa**:

#### Admin
- Username: `admin`
- Password: `123456`

#### User thường  
- Username: `user1`
- Password: `123456`

#### Tài khoản test
- Username: `test`
- Password: `test123`

- Username: `demo`
- Password: `demo123`

## Cách kiểm tra

### 1. **Kiểm tra server logs**
Khi đăng nhập, bạn sẽ thấy logs trong console:
```
Login attempt: { username: 'admin', password: '***' }
User found: { id: 1, username: 'admin', passwordType: 'plain' }
Using plain text comparison: { provided: '123456', stored: '123456' }
Login successful for user: admin
```

### 2. **Kiểm tra Network tab**
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Thử đăng nhập
4. Xem request POST `/api/auth/login`
5. Kiểm tra response status và data

### 3. **Kiểm tra Console**
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Thử đăng nhập
4. Xem có lỗi JavaScript nào không

## Các bước debug

### Bước 1: Kiểm tra server có chạy không
```bash
npm run dev
```
Server sẽ chạy trên `http://localhost:3000`

### Bước 2: Kiểm tra API endpoint
Mở browser và truy cập:
- `http://localhost:3000/api/auth/me` - Kiểm tra trạng thái đăng nhập
- `http://localhost:3000/api/products` - Kiểm tra API sản phẩm

### Bước 3: Test đăng nhập với curl
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### Bước 4: Kiểm tra session
Sau khi đăng nhập thành công, kiểm tra:
```bash
curl http://localhost:3000/api/auth/me
```

## Lỗi thường gặp

### 1. **"Tên đăng nhập không tồn tại"**
- Kiểm tra username có đúng không
- Kiểm tra server có load được mock data không

### 2. **"Mật khẩu không đúng"**
- Kiểm tra password có đúng không
- Kiểm tra console logs để xem so sánh password

### 3. **"Network Error"**
- Kiểm tra server có chạy không
- Kiểm tra CORS settings
- Kiểm tra firewall/antivirus

### 4. **Session không lưu**
- Kiểm tra cookie settings
- Kiểm tra session middleware
- Thử clear browser cache

## Cách sửa nhanh

### 1. **Restart server**
```bash
# Dừng server (Ctrl+C)
npm run dev
```

### 2. **Clear browser cache**
- Hard refresh: Ctrl+Shift+R
- Clear cookies và local storage

### 3. **Kiểm tra dependencies**
```bash
npm install
```

### 4. **Build lại project**
```bash
npm run build
```

## Test cases

### Test 1: Đăng nhập admin
```javascript
// Trong browser console
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: '123456' })
}).then(r => r.json()).then(console.log)
```

### Test 2: Kiểm tra session
```javascript
// Trong browser console
fetch('/api/auth/me').then(r => r.json()).then(console.log)
```

### Test 3: Đăng xuất
```javascript
// Trong browser console
fetch('/api/auth/logout', { method: 'POST' }).then(r => r.json()).then(console.log)
```

## Nếu vẫn không hoạt động

1. **Kiểm tra server logs** - Xem có lỗi gì không
2. **Kiểm tra network requests** - Xem request có được gửi không
3. **Kiểm tra response** - Xem server có trả về gì không
4. **Thử với tài khoản khác** - Test với `test`/`test123`
5. **Clear tất cả data** - Xóa cookies, local storage, cache

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, hãy cung cấp:
1. Server logs (console output)
2. Browser console errors
3. Network requests (screenshot)
4. Steps to reproduce
