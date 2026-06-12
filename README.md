# NovaShop

Nền tảng thương mại điện tử full-stack — đồ án **DACN**.

| | |
|---|---|
| **Website** | [https://novashop-frontend.onrender.com](https://novashop-frontend.onrender.com) |
| **Repository** | [github.com/GiangVoTruong/NovaShop](https://github.com/GiangVoTruong/NovaShop) |
| **API (production)** | `https://novashop-e4ir.onrender.com/api` |

Monorepo gồm giao diện **React**, API **Spring Boot** và script khởi tạo **PostgreSQL**.

---

## Tính năng

### Khách hàng

- Duyệt sản phẩm, tìm kiếm debounce, lọc danh mục / thương hiệu / giá
- Giỏ hàng — chọn sản phẩm thanh toán một phần, áp mã giảm giá
- **Mua ngay** — checkout chỉ sản phẩm đang chọn, không gộp cả giỏ
- Thêm vào giỏ / mua ngay trực tiếp trên thẻ sản phẩm
- Thanh toán **COD**, **VNPay**, **Stripe**
- Yêu thích, đánh giá, theo dõi đơn hàng, mua lại đơn cũ
- Đăng nhập email, **Google OAuth**, quên / đặt lại mật khẩu
- Thông báo realtime qua **WebSocket**
- Trang tĩnh (hỗ trợ, chính sách, liên hệ…)
- Đa ngôn ngữ **Tiếng Việt / English**

### Quản trị

- Dashboard, sản phẩm, đơn hàng, khách hàng, danh mục
- Kho hàng, mã giảm giá, phân tích, cài đặt cửa hàng
- Chế độ bảo trì, duyệt đánh giá, quản lý seller

---

## Cấu trúc dự án

```
NovaShop/
├── frontend/          # React 19 + Vite + TypeScript
├── backend/           # Spring Boot 4 + JPA
├── db/
│   └── schema.sql     # Khởi tạo schema PostgreSQL
└── README.md
```

| Thư mục | Mô tả |
|--------|--------|
| `frontend/` | Giao diện khách & admin |
| `backend/` | REST API, WebSocket, Swagger |
| `db/` | Script SQL khởi tạo database |

---

## Công nghệ

| Lớp | Stack |
|-----|--------|
| **Frontend** | React 19, TypeScript, Vite 8, Ant Design 6, Tailwind CSS 4, React Router 7, TanStack Query, i18next, Axios |
| **Backend** | Java 21, Spring Boot 4, Spring Data JPA, PostgreSQL, WebSocket, springdoc-openapi, Lombok, MapStruct |
| **Package manager (FE)** | [pnpm](https://pnpm.io) |

---

## Yêu cầu môi trường

- **Node.js** LTS + **pnpm**
- **JDK 21** + **Maven** (hoặc `mvnw` trong `backend/`)
- **PostgreSQL** (local, Supabase hoặc dịch vụ tương thích)

---

## Chạy local

### 1. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Dev server: [http://localhost:5173](http://localhost:5173)

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Dev server + HMR |
| `pnpm build` | Build production → `frontend/dist/` |
| `pnpm lint` | ESLint |
| `pnpm preview` | Xem thử bản build |

**Biến môi trường** — copy `frontend/.env.example` → `frontend/.env`:

```env
# Gọi /api — Vite proxy sang backend local (mặc định localhost:8080)
VITE_API_BASE_URL=/api

# Không chạy BE local — proxy sang Render:
# VITE_PROXY_TARGET=https://novashop-e4ir.onrender.com

# Google Sign-In (tuỳ chọn)
# VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Production build dùng `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://novashop-e4ir.onrender.com/api
```

**Cấu trúc mã nguồn frontend:**

```
frontend/src/
├── features/NovaShop/
│   ├── customer/     # Trang khách
│   ├── admin/        # Trang quản trị
│   └── shared/       # UI, thông báo, format…
├── hooks/
├── lib/              # Axios, i18n, websocket
├── router/paths.ts   # Hằng số route
└── types/
```

### 2. Backend

1. Tạo database và chạy `db/schema.sql`.
2. Tạo `backend/.env` (**không commit**):

   ```env
   SUPABASE_DB_PASSWORD=mat_khau_database_cua_ban
   ```

3. Chạy Spring Boot:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

   Windows (PowerShell):

   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

4. Mở **Swagger UI** theo log khởi động (thường `/swagger-ui.html` hoặc đường dẫn springdoc tương ứng).

---

## Route chính (frontend)

| Route | Trang |
|-------|--------|
| `/` | Trang chủ |
| `/products` | Danh sách sản phẩm |
| `/products/:id` | Chi tiết sản phẩm |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/orders` | Đơn hàng |
| `/profile` | Hồ sơ |
| `/admin` | Quản trị |

Danh sách đầy đủ: `frontend/src/router/paths.ts`

---

## Deploy

| Dịch vụ | URL |
|---------|-----|
| **Frontend** | [https://novashop-frontend.onrender.com](https://novashop-frontend.onrender.com) |
| **Backend API** | `https://novashop-e4ir.onrender.com/api` |

### SPA routing (React Router)

Đăng nhập xong điều hướng trong app **hoạt động** vì React Router chạy phía client. Copy/dán URL `/admin`, `/products/…` **lỗi Not Found** vì Render tìm file vật lý tại path đó — cần cấu hình hosting.

**Cách 1 — Rewrite trên Static Site** (giữ Static Site, sửa nhanh nhất):

1. [Render Dashboard](https://dashboard.render.com) → **novashop-frontend**
2. **Redirects / Rewrites** → **Add Rule**
3. Action phải là **Rewrite** (không phải Redirect):

   | Source | Destination | Action |
   |--------|-------------|--------|
   | `/*` | `/index.html` | **Rewrite** |

4. **Save** → thử lại URL `/admin`

**Cách 2 — Web Service** (tự xử lý SPA, khuyến nghị với Blueprint):

[`render.yaml`](render.yaml) khai báo `novashop-frontend` là Web Service Node, chạy `serve -s dist`. Sync Blueprint hoặc tạo Web Service: Root `frontend`, Build `pnpm install --frozen-lockfile && pnpm build`, Start `pnpm start`.

**Lưu ý:** Chỉ push `render.yaml` **không** tự sửa Static Site đã tạo thủ công — vẫn cần Cách 1 hoặc 2 trên Dashboard.

Tài liệu: [Render — Redirects and Rewrites](https://render.com/docs/redirects-rewrites)

---
## Clone

```bash
git clone https://github.com/GiangVoTruong/NovaShop.git
cd NovaShop
```

---

## Bảo mật

- Không commit `backend/.env`, mật khẩu database, secret OAuth / payment.
- Chỉ dùng biến môi trường phù hợp từng môi trường (local / production).

---

## Giấy phép

Dự án phục vụ mục đích học tập / đồ án — quyền sử dụng do nhóm hoặc lớp quy định.
