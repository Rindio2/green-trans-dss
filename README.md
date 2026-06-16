# GreenTrans DSS

Hệ thống web hỗ trợ lựa chọn phương án vận chuyển xanh giữa đường bộ và đường thủy cho container xuất khẩu khu vực TP.HCM – ĐBSCL.

## Công nghệ

- Frontend: Next.js App Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT

## Chức năng chính

- Đăng ký / đăng nhập
- Dashboard tổng quan kịch bản
- Tạo kịch bản vận chuyển container
- Nhập phương án đường bộ trực tiếp
- Nhập phương án kết hợp đường bộ – đường thủy
- Điều chỉnh trọng số 6 tiêu chí
- Tính chi phí, thời gian, CO₂, chuẩn hóa điểm và điểm tổng hợp
- Kiểm tra ràng buộc thời gian
- Khuyến nghị phương án phù hợp
- Xem chi tiết kết quả và xuất báo cáo dạng CSV / in PDF qua trình duyệt

## Cấu trúc thư mục

```txt
green-trans-dss
├── client      # Next.js frontend
└── server      # Node.js/Express API
```

## Cài đặt nhanh

### 1. Cài MongoDB

Có thể dùng MongoDB local hoặc MongoDB Atlas.

Ví dụ MongoDB local:

```bash
mongodb://127.0.0.1:27017/green_trans_dss
```

### 2. Chạy backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend chạy tại:

```txt
http://localhost:5000
```

### 3. Chạy frontend

Mở terminal khác:

```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend chạy tại:

```txt
http://localhost:3000
```

## Tài khoản sử dụng

Tạo tài khoản mới tại `/register`, sau đó đăng nhập tại `/login`.

## Công thức mô hình

### Tổng chi phí

```txt
Total cost = transport cost + handling cost + waiting cost + other cost
```

### Tổng thời gian

```txt
Total time = travel time + handling time + waiting time + buffer time
```

### Phát thải CO₂

```txt
CO2 = TEU × distance_km × emission_factor
```

### Điểm tổng hợp

```txt
score = C*wC + T*wT + E*wE + G*wG + F*wF + I*wI
```

Trong đó:

- C: điểm chi phí
- T: điểm thời gian
- E: điểm phát thải CO₂
- G: điểm khả năng gom container
- F: điểm linh hoạt
- I: điểm kết nối hạ tầng

## Ghi chú triển khai

- Các hệ số phát thải trong form là tham số mô phỏng, có thể thay bằng dữ liệu thực tế khi có số liệu từ doanh nghiệp/cảng/ICD/depot.
- Hệ thống hiện dùng mô hình tính điểm đa tiêu chí theo trọng số. Có thể mở rộng sang AHP ở giai đoạn sau.
# green-trans-dss
