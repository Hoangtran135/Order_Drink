# Order Drink - Ứng dụng đặt đồ uống trực tuyến

## Mô tả
Ứng dụng web đặt đồ uống trực tuyến được xây dựng bằng TypeScript và Node.js với Express framework. Giao diện hiện đại, responsive và tối ưu cho trải nghiệm người dùng.

## Tính năng

### Cho người dùng chưa đăng nhập:
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Xem thông tin cửa hàng
- Tìm kiếm sản phẩm
- Xem sản phẩm nổi bật
- Trang đăng nhập/đăng ký riêng biệt

### Cho người dùng đã đăng nhập:
- Tất cả tính năng của người dùng chưa đăng nhập
- Thêm sản phẩm vào giỏ hàng
- Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng)
- Đặt hàng và thanh toán online (VNPay, MoMo)
- Xem lịch sử đơn hàng
- Theo dõi trạng thái giao hàng
- Danh sách yêu thích
- Đánh giá và bình luận sản phẩm
- Nhận thông báo real-time
- Sử dụng mã giảm giá
- Gợi ý sản phẩm thông minh
- **Quản lý thông tin cá nhân** (mới)
- **Chỉnh sửa profile** (mới)
- **Đổi mật khẩu** (mới)
- Đăng xuất

### Cho quản trị viên:
- Dashboard quản trị với thống kê chi tiết
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng (cập nhật trạng thái)
- Quản lý người dùng
- Quản lý mã giảm giá
- Thống kê doanh thu và báo cáo
- Gửi thông báo đến người dùng

## Cấu trúc dự án

```
Order-drink/
├── src/
│   ├── server.ts              # Server chính
│   ├── types/
│   │   └── index.ts          # Định nghĩa types
│   ├── data/
│   │   └── mockData.ts       # Dữ liệu mẫu
│   └── routes/
│       ├── auth.ts           # API xác thực
│       ├── profile.ts        # API quản lý profile (mới)
│       ├── products.ts       # API sản phẩm
│       ├── cart.ts           # API giỏ hàng
│       ├── orders.ts         # API đơn hàng
│       ├── payment.ts        # API thanh toán
│       ├── reviews.ts        # API đánh giá
│       ├── favorites.ts      # API yêu thích
│       ├── notifications.ts  # API thông báo
│       ├── promotions.ts     # API khuyến mãi
│       ├── delivery.ts       # API giao hàng
│       ├── recommendations.ts # API gợi ý
│       ├── admin.ts         # API quản trị
│       └── analytics.ts     # API thống kê
├── public/
│   ├── index.html            # Trang chủ
│   ├── styles.css           # CSS
│   └── app.js               # JavaScript frontend
├── dist/                    # Build output
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
- Password: `123456`

### User thường
- Username: `user1`
- Password: `123456`

### Tài khoản test
- Username: `test`
- Password: `test123`

- Username: `demo`
- Password: `demo123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Kiểm tra trạng thái đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile (mới)
- `PUT /api/auth/profile` - Cập nhật thông tin profile (mới)
- `POST /api/auth/change-password` - Đổi mật khẩu (mới)

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

### Payment
- `POST /api/payment/vnpay/create` - Tạo thanh toán VNPay
- `POST /api/payment/momo/create` - Tạo thanh toán MoMo
- `GET /api/payment/vnpay/callback` - Callback VNPay
- `POST /api/payment/momo/callback` - Callback MoMo
- `GET /api/payment/methods` - Lấy danh sách phương thức thanh toán

### Reviews (Yêu cầu đăng nhập)
- `GET /api/reviews/product/:productId` - Lấy đánh giá sản phẩm
- `POST /api/reviews` - Thêm đánh giá
- `PUT /api/reviews/:reviewId` - Cập nhật đánh giá
- `DELETE /api/reviews/:reviewId` - Xóa đánh giá
- `GET /api/reviews/user` - Lấy đánh giá của người dùng

### Favorites (Yêu cầu đăng nhập)
- `GET /api/favorites` - Lấy danh sách yêu thích
- `POST /api/favorites/add` - Thêm vào yêu thích
- `DELETE /api/favorites/remove/:productId` - Xóa khỏi yêu thích
- `GET /api/favorites/check/:productId` - Kiểm tra trạng thái yêu thích
- `POST /api/favorites/toggle` - Bật/tắt yêu thích

### Notifications (Yêu cầu đăng nhập)
- `GET /api/notifications` - Lấy thông báo
- `PUT /api/notifications/:notificationId/read` - Đánh dấu đã đọc
- `DELETE /api/notifications/:notificationId` - Xóa thông báo
- `GET /api/notifications/unread-count` - Đếm thông báo chưa đọc

### Promotions
- `GET /api/promotions` - Lấy danh sách khuyến mãi
- `GET /api/promotions/code/:code` - Lấy thông tin mã giảm giá
- `POST /api/promotions/validate` - Kiểm tra mã giảm giá
- `POST /api/promotions/apply` - Áp dụng mã giảm giá

### Delivery (Yêu cầu đăng nhập)
- `GET /api/delivery/track/:orderId` - Theo dõi giao hàng
- `GET /api/delivery/my-deliveries` - Lấy danh sách giao hàng
- `PUT /api/delivery/update-status/:orderId` - Cập nhật trạng thái giao hàng
- `GET /api/delivery/stats` - Thống kê giao hàng
- `GET /api/delivery/zones` - Lấy danh sách khu vực giao hàng
- `POST /api/delivery/calculate-fee` - Tính phí giao hàng

### Recommendations
- `GET /api/recommendations/personalized` - Gợi ý cá nhân hóa
- `GET /api/recommendations/trending` - Sản phẩm trending
- `GET /api/recommendations/similar/:productId` - Sản phẩm tương tự
- `GET /api/recommendations/category/:category` - Gợi ý theo danh mục
- `GET /api/recommendations/seasonal` - Gợi ý theo mùa

### Admin (Yêu cầu quyền admin)
- `GET /api/admin/analytics` - Thống kê tổng quan
- `GET /api/admin/orders` - Quản lý đơn hàng
- `PUT /api/admin/orders/:orderId/status` - Cập nhật trạng thái đơn hàng
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/products` - Quản lý sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới
- `PUT /api/admin/products/:productId` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:productId` - Xóa sản phẩm

### Analytics
- `GET /api/analytics/overview` - Tổng quan thống kê
- `GET /api/analytics/sales` - Thống kê doanh số
- `GET /api/analytics/users` - Thống kê người dùng
- `GET /api/analytics/products` - Thống kê sản phẩm
- `GET /api/analytics/orders` - Thống kê đơn hàng
- `GET /api/analytics/revenue` - Thống kê doanh thu

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

## Tính năng mới được thêm

### Profile Management
- ✅ **Quản lý thông tin cá nhân**: Xem và chỉnh sửa thông tin cá nhân
- ✅ **Chỉnh sửa profile**: Cập nhật họ tên, email, số điện thoại, địa chỉ
- ✅ **Đổi mật khẩu**: Thay đổi mật khẩu với xác thực mật khẩu hiện tại
- ✅ **Giao diện responsive**: Tối ưu cho mobile và desktop
- ✅ **Validation**: Kiểm tra dữ liệu đầu vào và hiển thị lỗi

### UI/UX Improvements
- ✅ **Navbar compact**: Giao diện navbar gọn gàng với dropdown menu
- ✅ **Smooth transitions**: Chuyển trang mượt mà với loading states
- ✅ **Loading states**: Hiển thị trạng thái tải với skeleton screens
- ✅ **Error handling**: Xử lý lỗi và hiển thị thông báo user-friendly
- ✅ **Accessibility**: Hỗ trợ keyboard navigation và screen readers

### Technical Improvements
- ✅ **TypeScript**: Type safety và better development experience
- ✅ **Modular architecture**: Tách biệt routes và components
- ✅ **Error boundaries**: Xử lý lỗi gracefully
- ✅ **Performance**: Tối ưu loading và rendering
- ✅ **Code organization**: Clean code structure và documentation

## Tác giả
**Order Drink Team** - Full Stack Development

## Tính năng bảo mật
- Mã hóa mật khẩu với bcrypt
- Session-based authentication
- Kiểm tra quyền truy cập cho các API yêu cầu đăng nhập

## Responsive Design
Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Cài đặt nhanh

### Development
```bash
# Clone repository
git clone <repository-url>
cd Order-drink

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm start
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Demo
Truy cập ứng dụng tại: `http://localhost:3000`

## License
MIT License - Xem file LICENSE để biết thêm chi tiết.
