# Thiệp Mời Lễ Tốt Nghiệp

Một trang web thiệp mời lễ tốt nghiệp sang trọng với phong cách đen - vàng, bao gồm tính năng xác nhận tham gia và gửi email tự động.

## ✨ Tính năng

- 🎨 Thiết kế sang trọng với tone màu đen và vàng gold
- 📱 Responsive, hiển thị đẹp trên mọi thiết bị
- ✉️ Form xác nhận tham gia
- 📧 Gửi email xác nhận tự động cho khách mời
- 📬 Thông báo email cho người tổ chức khi có người đăng ký

## 🚀 Cài đặt

### 1. Clone hoặc tải project

```bash
cd GraduationWeb
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình email

Sao chép file `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ORGANIZER_EMAIL=organizer@gmail.com
PORT=3000
```

#### Lấy App Password cho Gmail:

1. Vào [Google Account](https://myaccount.google.com/)
2. Security > 2-Step Verification (bật nếu chưa bật)
3. App passwords > Select app: Mail > Select device: Other
4. Nhập tên (ví dụ: "Graduation Web") > Generate
5. Sao chép mật khẩu 16 ký tự vào `EMAIL_PASS`

### 4. Chạy server

```bash
npm start
# hoặc cho development:
npm run dev
```

### 5. Mở trình duyệt

Truy cập `http://localhost:3000`

## 📁 Cấu trúc project

```
GraduationWeb/
├── index.html      # Trang thiệp mời chính
├── styles.css      # CSS styling
├── script.js       # JavaScript xử lý frontend
├── server.js       # Backend Node.js + Express
├── package.json    # Dependencies
├── .env.example    # Mẫu cấu hình
└── README.md       # Hướng dẫn
```

## 🎨 Tùy chỉnh

### Thay đổi thông tin sự kiện

Chỉnh sửa trong `index.html`:

- Tên người tốt nghiệp
- Ngày, giờ sự kiện
- Địa điểm
- Tên trường

### Thay đổi màu sắc

Chỉnh sửa các biến màu trong `styles.css`:

- Màu gold: `#c9a962`, `#e8d48b`
- Màu nền: `#0d0d0d`, `#1a1a1a`

## 📧 Các phương án gửi email

### 1. Backend Node.js (đề xuất)
Sử dụng `server.js` với Nodemailer - phù hợp cho production.

### 2. EmailJS (không cần backend)
Xem hướng dẫn trong `script.js` - phù hợp cho static hosting.

### 3. Formspree (đơn giản nhất)
Xem hướng dẫn trong `script.js` - dùng cho landing page đơn giản.

## 🌐 Deploy

### Vercel / Netlify (Static)
Sử dụng EmailJS hoặc Formspree cho gửi email.

### Heroku / Railway / Render
Deploy full backend với Node.js.

### VPS
Chạy với PM2: `pm2 start server.js`

## 📄 License

MIT
