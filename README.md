# Hoàng Trần - Ứng dụng đặt đồ uống trực tuyến

## Mô tả
Ứng dụng web đặt đồ uống trực tuyến được xây dựng bằng TypeScript và Node.js với Express framework. Phát triển bởi Hoàng Trần.

## Tính năng

### Cho người dùng chưa đăng nhập:
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Xem thông tin cửa hàng

### Cho người dùng đã đăng nhập:
- Tất cả tính năng của người dùng chưa đăng nhập
- Thêm sản phẩm vào giỏ hàng
- Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng)
- Đặt hàng và thanh toán
- Xem lịch sử đơn hàng
- Đăng xuất

## Cấu trúc dự án

```
hoang-tran-drink/
├── src/
│   ├── server.ts              # Server chính
│   ├── types/
│   │   └── index.ts          # Định nghĩa types
│   ├── data/
│   │   └── mockData.ts       # Dữ liệu mẫu
│   └── routes/
│       ├── auth.ts           # API xác thực
│       ├── products.ts      # API sản phẩm
│       ├── cart.ts          # API giỏ hàng
│       └── orders.ts        # API đơn hàng
├── public/
│   ├── index.html            # Trang chủ
│   ├── styles.css           # CSS
│   └── app.js               # JavaScript frontend
├── package.json
├── tsconfig.json
└── README.md
```

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Chạy ứng dụng
```bash
npm start
```

### 4. Chạy ở chế độ development
```bash
npm run dev
```

## Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## Tài khoản mẫu

### Admin
- Username: `admin`
- Password: `password`

### User thường
- Username: `user1`
- Password: `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Kiểm tra trạng thái đăng nhập

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/category/:category` - Lọc sản phẩm theo danh mục

### Cart (Yêu cầu đăng nhập)
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/update` - Cập nhật số lượng
- `DELETE /api/cart/remove/:productId` - Xóa sản phẩm khỏi giỏ
- `DELETE /api/cart/clear` - Xóa toàn bộ giỏ hàng

### Orders (Yêu cầu đăng nhập)
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

## Công nghệ sử dụng

### Backend
- Node.js
- TypeScript
- Express.js
- Express Session
- bcryptjs (mã hóa mật khẩu)
- CORS

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome (icons)

## Tác giả
**Hoàng Trần** - Full Stack Developer

## Tính năng bảo mật
- Mã hóa mật khẩu với bcrypt
- Session-based authentication
- Kiểm tra quyền truy cập cho các API yêu cầu đăng nhập

## Responsive Design
Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- Desktop
- Tablet
- Mobile
