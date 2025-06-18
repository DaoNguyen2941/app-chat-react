# 💬 VivuWord - Ứng dụng Chat Thời Gian Thực

**VivuWord** là một ứng dụng nhắn tin hiện đại, thời gian thực, được xây dựng bằng ReactJS và các công nghệ web mạnh mẽ. Ứng dụng hỗ trợ chat cá nhân, chat nhóm, gửi emoji, quản lý bạn bè và hồ sơ người dùng – tất cả trong một giao diện mượt mà và trực quan.

---

## 🚀 Tính Năng Nổi Bật

* **Đang ký tài khoản miễn phí**: tạo tài khoản bằng email và mã otp, thay đổi mật khẩu, quên mật khẩu
* **Gửi/nhận tin nhắn thời gian thực**
* **Quản lý bạn bè**: gửi lời mời, chấp nhận, từ chối, hủy kết bạn
* **trò chuyện trực tuyến**: tạo và xóa cuộc hội thoại
* **trò chuyện nhóm**: tạo nhóm, thêm thành viên, rời nhóm, giải tán nhóm
* **Gửi emoji**
* **Cập nhật hồ sơ người dùng**: avatar, tên, ngày sinh, giới tính, số điện thoại
* **Tìm kiếm người dùng & kết bạn** : gửi kết bạn,chấp nhận, từ chối
* **Thông báo thời gian thực**
* **Giao diện đẹp, responsive, hỗ trợ light/dark mode**

---

## 🧱🏼‍💻 Kiến Trúc Công Nghệ

| Công Nghệ            | Mục Đích                       |
| -------------------- | ------------------------------ |
| ReactJS              | Xây dựng giao diện             |
| React Router         | Điều hướng trang SPA           |
| React Query          | Quản lý dữ liệu bất đồng bộ    |
| Redux Toolkit        | Quản lý state toàn cục         |
| Socket.IO Client     | Kết nối thời gian thực         |
| React Hook Form      | Quản lý và validate form       |
| Yup                  | Xác thực dữ liệu form          |
| MUI (Material UI)    | Giao diện hiện đại & linh hoạt |
| Axios                | Gọi REST API                   |
| emoji-picker         | Thêm emoji vào tin nhắn        |


---

## 📁 Cấu Trúc Thư Mục

```bash
src/
├── assets/             # Hình ảnh, icon, file tĩnh
├── features/           # Các module chức năng chính (chat, auth, friend,...)
├── hooks/              # Custom hooks
├── layouts/            # Giao diện bố cục (Dashboard, Auth...)
├── pages/              # Các trang chính (ChatPage, LoginPage,...)
├── router/             # Cấu hình routing
├── services/           # Gọi API qua axios
├── socket/             # Cấu hình Socket.IO client
├── store/              # Redux store & slices
├── types/              # Kiểu TypeScript chung
├── utils/              # Tiện ích chung
├── App.tsx             # Component gốc
└── main.tsx            # Điểm khởi chạy React app
```

---

## ⚙️ Cài Đặt & Chạy Ứng Dụng

### 1. Clone Dự Án

```bash
git clone https://github.com/your-username/vivuworld.git
cd vivuworld
```

### 2. Cài Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Tạo file `.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

> 🔐 Nếu dùng backend của bạn, cập nhật URL API/SOCKET tương ứng.

### 4. Chạy Ứng Dụng

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập tại: [http://localhost:5173](http://localhost:5173)

---

## 🥪 Scripts Hữu Ích

```bash
npm run dev        # Chạy development server
npm run build      # Build production
npm run preview    # Xem bản build production
npm run lint       # Kiểm tra linting
```

---

## 🔌 Kết Nối Với Backend

Ứng dụng yêu cầu backend hỗ trợ REST API và WebSocket (có thể dùng NestJS + Socket.IO).

Các endpoint backend nên bao gồm:

* `/auth/login`, `/auth/register`
* `/users/me`, `/users/update-profile`, `/users/avatar`
* `/friends/request`, `/friends/accept`, `/friends/remove`
* `/messages/:conversationId`, `/messages/send`
* `/groups/create`, `/groups/members`, `/groups/invite`, etc.
* WebSocket events: `message:new`, `friend:request`, `group:update`, v.v.

---

## 📦 Backend Gợi Ý

Nếu bạn cần backend tương thích:

> 🔧 [VivuWord Backend (NestJS)](https://github.com/your-username/vivuworld-backend) *(tùy chọn)*

---

## 🌐 Triển Khai (Deployment)

Bạn có thể deploy VivuWord frontend trên các nền tảng như:

* **Vercel**
* **Netlify**
* **Render**
* **Firebase Hosting**

### Triển khai với Vercel:

```bash
npm run build
# sau đó push lên GitHub và kết nối với Vercel
```

---

## 📸 Một Số Hình Ảnh

> *(Thêm ảnh chụp màn hình ứng dụng nếu có)*

---

## 👨‍💼 Đóng Góp

Mọ i ý tưởng, lỗi phát hiện, hoặc tính năng mới đều được chào đón!

* Fork repository
* Tạo branch mới (`feature/your-feature`)
* Tạo pull request 🚀

---

## 📜 Giấy Phép

Dự án được phát hành theo giấy phép MIT. Bạn được phép sử dụng, sửa đổi và triển khai ứng dụng với mục đích cá nhân hoặc thương mại.

---

## 📧 Liên Hệ

> 📬 Email: [your-email@example.com](mailto:your-email@example.com)
> 🌐 Website: [https://your-portfolio.com](https://your-portfolio.com)
> 👥 GitHub: [@yourusername](https://github.com/yourusername)

---

**VivuWord – Trải nghiệm chat hiện đại, kết nối tức thì.**
