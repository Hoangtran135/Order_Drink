# Hướng dẫn cài đặt và chạy dự án Order Drink

## Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0
- TypeScript >= 5.0.0

## Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd Order-drink
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Build TypeScript
```bash
npm run build
```

### 4. Chạy ứng dụng

#### Chế độ production:
```bash
npm start
```

#### Chế độ development:
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

## Cấu hình thanh toán

### VNPay
1. Đăng ký tài khoản VNPay tại: https://sandbox.vnpayment.vn/
2. Cập nhật thông tin trong `src/routes/payment.ts`:
   - `vnp_TmnCode`: Mã website của bạn
   - `vnp_HashSecret`: Mã bí mật của bạn

### MoMo
1. Đăng ký tài khoản MoMo Developer tại: https://developers.momo.vn/
2. Cập nhật thông tin trong `src/routes/payment.ts`:
   - `partnerCode`: Mã đối tác
   - `accessKey`: Khóa truy cập
   - `secretKey`: Khóa bí mật

## Cấu trúc dự án

```
Order-drink/
├── src/                    # Source code TypeScript
│   ├── server.ts          # Server chính
│   ├── types/             # Định nghĩa types
│   ├── data/              # Dữ liệu mẫu
│   └── routes/            # API routes
│       ├── auth.ts        # Xác thực
│       ├── products.ts    # Sản phẩm
│       ├── cart.ts        # Giỏ hàng
│       ├── orders.ts      # Đơn hàng
│       ├── payment.ts     # Thanh toán
│       ├── reviews.ts     # Đánh giá
│       ├── promotions.ts  # Khuyến mãi
│       ├── favorites.ts   # Yêu thích
│       ├── notifications.ts # Thông báo
│       ├── admin.ts       # Quản trị
│       ├── recommendations.ts # Gợi ý
│       ├── delivery.ts    # Giao hàng
│       └── analytics.ts   # Thống kê
├── public/                # Frontend
│   ├── index.html        # Trang chủ
│   ├── styles.css        # CSS
│   └── app.js           # JavaScript
├── dist/                 # Compiled JavaScript
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md           # Documentation
```

## Tính năng chính

### 🛒 E-commerce
- Danh sách sản phẩm với tìm kiếm và lọc
- Giỏ hàng thông minh
- Thanh toán online (VNPay, MoMo)
- Quản lý đơn hàng

### 👤 User Experience
- Đăng ký/Đăng nhập
- Danh sách yêu thích
- Đánh giá sản phẩm
- Thông báo real-time
- Gợi ý sản phẩm thông minh

### 🎯 Marketing
- Hệ thống khuyến mãi
- Mã giảm giá
- Gợi ý theo mùa
- Sản phẩm trending

### 📊 Analytics
- Dashboard quản trị
- Thống kê doanh thu
- Báo cáo chi tiết
- Phân tích hành vi người dùng

### 🚚 Delivery
- Theo dõi giao hàng
- Tính phí giao hàng
- Quản lý khu vực giao hàng

## API Documentation

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ
- `PUT /api/cart/update` - Cập nhật số lượng
- `DELETE /api/cart/remove/:productId` - Xóa khỏi giỏ

### Orders
- `GET /api/orders` - Lấy đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái

### Payment
- `POST /api/payment/vnpay/create` - Tạo thanh toán VNPay
- `POST /api/payment/momo/create` - Tạo thanh toán MoMo

### Reviews
- `GET /api/reviews/product/:productId` - Đánh giá sản phẩm
- `POST /api/reviews` - Thêm đánh giá

### Favorites
- `GET /api/favorites` - Danh sách yêu thích
- `POST /api/favorites/add` - Thêm yêu thích
- `DELETE /api/favorites/remove/:productId` - Xóa yêu thích

### Notifications
- `GET /api/notifications` - Thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

### Promotions
- `GET /api/promotions` - Danh sách khuyến mãi
- `POST /api/promotions/validate` - Kiểm tra mã giảm giá

### Delivery
- `GET /api/delivery/track/:orderId` - Theo dõi giao hàng
- `GET /api/delivery/zones` - Khu vực giao hàng

### Recommendations
- `GET /api/recommendations/personalized` - Gợi ý cá nhân
- `GET /api/recommendations/trending` - Sản phẩm trending

### Admin
- `GET /api/admin/analytics` - Thống kê tổng quan
- `GET /api/admin/orders` - Quản lý đơn hàng
- `GET /api/admin/users` - Quản lý người dùng

### Analytics
- `GET /api/analytics/overview` - Tổng quan
- `GET /api/analytics/sales` - Thống kê doanh số
- `GET /api/analytics/revenue` - Thống kê doanh thu

## Troubleshooting

### Lỗi thường gặp

1. **Port đã được sử dụng**
   ```bash
   # Thay đổi port trong server.ts
   const PORT = process.env.PORT || 3001;
   ```

2. **Lỗi TypeScript compilation**
   ```bash
   # Xóa dist folder và build lại
   rm -rf dist
   npm run build
   ```

3. **Lỗi dependencies**
   ```bash
   # Xóa node_modules và cài lại
   rm -rf node_modules
   npm install
   ```

4. **Lỗi thanh toán**
   - Kiểm tra cấu hình VNPay/MoMo
   - Đảm bảo URL callback đúng
   - Kiểm tra secret key

## Development

### Chạy ở chế độ watch
```bash
npm run watch
```

### Kiểm tra lỗi TypeScript
```bash
npx tsc --noEmit
```

### Format code
```bash
npx prettier --write "src/**/*.ts"
```

## Deployment

### Production build
```bash
npm run build
npm start
```

### Environment variables
Tạo file `.env`:
```
PORT=3000
NODE_ENV=production
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
```

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ:
- Email: support@orderdrink.com
- Phone: 1900-1234

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
