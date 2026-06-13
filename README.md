# NovaShop

Nền tảng thương mại điện tử full-stack — đồ án **DACN**.

| | |
|---|---|
| **Website** | [https://novashop-frontend.onrender.com](https://novashop-frontend.onrender.com) |
| **Repository** | [github.com/GiangVoTruong/NovaShop](https://github.com/GiangVoTruong/NovaShop) |
| **API (production)** | `https://novashop-e4ir.onrender.com/api` |

Monorepo gồm **React** (frontend), **Spring Boot** (backend) và **PostgreSQL** (Supabase).

---

## Tính năng

### Khách hàng

- Duyệt sản phẩm, tìm kiếm debounce, lọc danh mục / thương hiệu / giá
- Giỏ hàng — chọn sản phẩm thanh toán một phần, áp mã giảm giá
- **Mua ngay** — checkout chỉ sản phẩm đang chọn
- Thanh toán **COD**, **VNPay**, **Stripe**
- Yêu thích, theo dõi đơn hàng, xác nhận đã nhận hàng
- **Đánh giá sản phẩm** — tối đa 3 lần / sản phẩm (cần đơn DELIVERED), xem phản hồi từ shop
- Đăng nhập email, **Google OAuth**, quên / đặt lại mật khẩu, xác minh email
- Thông báo realtime qua **WebSocket**
- Quản lý địa chỉ giao hàng, hồ sơ cá nhân
- Trang tĩnh (hỗ trợ, chính sách, liên hệ…)
- Đa ngôn ngữ **Tiếng Việt / English**

### Quản trị (Admin)

- Dashboard, sản phẩm, đơn hàng, khách hàng, danh mục
- Kho hàng, mã giảm giá, phân tích, cài đặt cửa hàng
- Quản lý đánh giá — ẩn, xóa, **trả lời review**
- Tìm kiếm tổng hợp, phân quyền người dùng

### Seller

- Đăng ký trở thành người bán
- Quản lý sản phẩm và đơn hàng của shop

---

## Cấu trúc dự án

```
NovaShop/
├── frontend/                 # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── features/NovaShop/
│   │   │   ├── customer/     # Trang khách hàng
│   │   │   ├── admin/        # Trang quản trị
│   │   │   └── shared/       # UI, format, thông báo…
│   │   ├── lib/              # Axios, i18n, WebSocket
│   │   ├── router/paths.ts   # Hằng số route
│   │   └── types/
│   └── e2e/                  # Playwright E2E tests
├── backend/
│   ├── src/main/java/com/backend/
│   │   ├── features/         # Module theo domain
│   │   │   ├── auth/         # Đăng nhập, JWT, OAuth
│   │   │   ├── cart/         # Giỏ hàng
│   │   │   ├── order/        # Đơn hàng
│   │   │   ├── product/      # Sản phẩm, danh mục
│   │   │   ├── review/       # Đánh giá + trả lời
│   │   │   ├── payment/      # VNPay, Stripe
│   │   │   ├── coupon/       # Mã giảm giá
│   │   │   ├── wishlist/     # Yêu thích
│   │   │   ├── notification/ # Thông báo
│   │   │   ├── analytics/    # Phân tích (admin)
│   │   │   └── …
│   │   ├── common/           # DTO, exception, util dùng chung
│   │   └── config/           # Cấu hình Spring
│   ├── docker/               # Dockerfile + docker-compose
│   └── src/test/             # Unit & integration tests
└── render.yaml               # Blueprint deploy Render
```

---

## Công nghệ

| Lớp | Stack |
|-----|--------|
| **Frontend** | React 19, TypeScript, Vite 8, Ant Design 6, Tailwind CSS 4, React Router 7, TanStack Query, i18next, Axios, Playwright |
| **Backend** | Java 21, Spring Boot 4, Spring Data JPA, PostgreSQL, WebSocket (STOMP), springdoc-openapi, Lombok, MapStruct |
| **Database** | PostgreSQL (Supabase) |
| **Deploy** | Render (Docker backend, Node frontend) |
| **Package manager (FE)** | [pnpm](https://pnpm.io) |

---

## Yêu cầu môi trường

- **Node.js** 22 LTS + **pnpm**
- **JDK 21** + **Maven** (hoặc `mvnw` trong `backend/`)
- **PostgreSQL** (Supabase hoặc local)

---

## Chạy local

### 1. Backend

Tạo `backend/.env` (**không commit**):

```env
SUPABASE_DB_PASSWORD=mat_khau_database_cua_ban
JWT_SECRET=chuoi_bi_mat_jwt_dai_it_nhat_32_ky_tu
```

Các biến tuỳ chọn: `GOOGLE_CLIENT_ID`, `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

```bash
cd backend
./mvnw spring-boot:run
```

Windows (PowerShell):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

- API: [http://localhost:8080/api](http://localhost:8080/api)
- Health: `GET /api/health`
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 2. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Dev server: [http://localhost:5173](http://localhost:5173) — proxy `/api` và `/ws` sang `localhost:8080`.

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Dev server + HMR |
| `pnpm build` | Build production → `frontend/dist/` |
| `pnpm lint` | ESLint |
| `pnpm preview` | Xem thử bản build |
| `pnpm test:e2e` | Playwright E2E (cần backend + tài khoản test) |
| `pnpm test:e2e:ui` | Playwright UI mode |

**Biến môi trường frontend** — tạo `frontend/.env`:

```env
# Gọi /api — Vite proxy sang backend local (mặc định localhost:8080)
VITE_API_BASE_URL=/api

# Không chạy BE local — proxy sang production:
# VITE_PROXY_TARGET=https://novashop-e4ir.onrender.com

# Google Sign-In (tuỳ chọn)
# VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

E2E tests:

```powershell
$env:TEST_EMAIL = "email_test_cua_ban"
$env:TEST_PASSWORD = "mat_khau_test"
pnpm test:e2e
```

---

## API chính

| Nhóm | Endpoint | Mô tả |
|------|----------|--------|
| Auth | `POST /api/auth/login`, `/register`, `/refresh` | Đăng nhập, đăng ký, làm mới token |
| Products | `GET /api/products`, `/api/products/{id}` | Danh sách, chi tiết sản phẩm |
| Cart | `GET/POST/PATCH/DELETE /api/cart/...` | Giỏ hàng |
| Orders | `POST /api/orders/checkout`, `GET /api/orders` | Thanh toán, danh sách đơn |
| Reviews | `GET/POST /api/products/{id}/reviews` | Xem / viết đánh giá (tối đa 3 lần) |
| Reviews | `DELETE /api/reviews/{id}` | Xóa đánh giá của mình |
| Admin | `POST /api/admin/reviews/{id}/reply` | Admin trả lời đánh giá |
| Payments | `POST /api/payments/vnpay/create`, Stripe | Thanh toán online |
| Notifications | `GET /api/notifications`, WebSocket `/ws` | Thông báo realtime |

Chi tiết đầy đủ: Swagger UI khi backend đang chạy.

---

## Route frontend

| Route | Trang |
|-------|--------|
| `/` | Trang chủ |
| `/products` | Danh sách sản phẩm |
| `/products/:id` | Chi tiết sản phẩm (đánh giá, mua hàng) |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/orders` | Đơn hàng |
| `/profile` | Hồ sơ |
| `/admin` | Dashboard quản trị |
| `/admin/products` | Quản lý sản phẩm |
| `/admin/orders` | Quản lý đơn hàng |

Danh sách đầy đủ: `frontend/src/router/paths.ts`

---

## Kiểm thử

### Backend (JUnit)

```powershell
cd backend
.\mvnw.cmd test
```

Chạy nhóm test cụ thể:

```powershell
.\mvnw.cmd test "-Dtest=CartServiceTest,ReviewServiceTest,ReviewIntegrationTest"
```

Integration test cần biến `TEST_USER_EMAIL` trỏ tới tài khoản có trong database.

### Frontend (Playwright E2E)

```powershell
cd frontend
$env:TEST_EMAIL = "email_test"
$env:TEST_PASSWORD = "mat_khau"
pnpm test:e2e
```

Bao phủ: trang public, luồng đăng nhập, giỏ hàng, checkout, admin modules.

---

## Deploy (Render)

| Dịch vụ | URL |
|---------|-----|
| **Frontend** | [https://novashop-frontend.onrender.com](https://novashop-frontend.onrender.com) |
| **Backend API** | `https://novashop-e4ir.onrender.com/api` |

Cấu hình trong [`render.yaml`](render.yaml):

- **Backend**: Docker (`backend/docker/Dockerfile`), health check `/api/health`
- **Frontend**: Node 22, `pnpm build` + `pnpm start` (serve SPA)

### SPA routing

React Router chạy phía client — copy/paste URL `/admin`, `/products/…` trên Static Site có thể lỗi 404. Blueprint dùng Web Service với `serve -s dist` để tự xử lý fallback `index.html`.

Nếu dùng Static Site, thêm rewrite rule trên Render Dashboard:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | **Rewrite** |

---

## Clone

```bash
git clone https://github.com/GiangVoTruong/NovaShop.git
cd NovaShop
```

---

## Bảo mật

- **Không commit** `backend/.env`, mật khẩu database, JWT secret, OAuth / payment keys.
- Chỉ dùng biến môi trường phù hợp từng môi trường (local / production).
- Tài khoản test chỉ dùng khi chạy E2E / integration test — không hardcode vào mã nguồn.

---

## Giấy phép

Dự án phục vụ mục đích học tập / đồ án — quyền sử dụng do nhóm hoặc lớp quy định.
