# NovaShop

Ứng dụng thương mại điện tử (DACN) — monorepo gồm **frontend React** và **backend Spring Boot**, kèm script SQL khởi tạo schema.

## Cấu trúc thư mục

| Thư mục | Mô tả |
|--------|--------|
| `FrontEnd/` | Giao diện khách & quản trị (Vite + React + TypeScript) |
| `backend/` | REST API (Spring Boot) |
| `db/` | `schema.sql` — khởi tạo schema PostgreSQL |

## Công nghệ

**Frontend**

- React 19, TypeScript, Vite 8  
- Ant Design 6, Tailwind CSS 4  
- React Router 7  
- Quản lý gói: **pnpm**

**Backend**

- Java 21, Spring Boot 4  
- Spring Data JPA, PostgreSQL  
- Validation, WebSocket, springdoc-openapi (Swagger UI)  
- Lombok, MapStruct  

## Yêu cầu môi trường

- **Node.js** (khuyến nghị LTS) và **pnpm**  
- **JDK 21** và **Maven** (hoặc dùng `./mvnw` trong `backend/`)  
- **PostgreSQL** (hoặc dịch vụ tương thích, ví dụ Supabase)

## Cài đặt & chạy nhanh

### 1. Frontend

```bash
cd FrontEnd
pnpm install
pnpm dev
```

- Dev server mặc định của Vite: `http://localhost:5173`  
- Build production: `pnpm build` — output trong `FrontEnd/dist/`  
- Lint: `pnpm lint`

### 2. Backend

1. Tạo database và chạy script trong `db/schema.sql` (SQL Editor hoặc `psql`).  
2. Cấu hình kết nối DB và mật khẩu **không commit** vào Git:  
   - Sao chép gợi ý từ `backend/.env.example` (nếu có) hoặc tạo `backend/src/main/resources/application-local.properties` (file này đã được `.gitignore`).  
   - Hoặc đặt biến môi trường theo `application.properties` (ví dụ mật khẩu DB qua biến được project đọc).  
3. Chạy ứng dụng:

```bash
cd backend
./mvnw spring-boot:run
```

Trên Windows (PowerShell):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 3. API tài liệu (Swagger)

Sau khi backend chạy, mở UI OpenAPI (đường dẫn chính xác xem log khởi động Spring Boot; thường dạng `/swagger-ui.html` hoặc đường dẫn tương đương theo phiên bản springdoc).

## Git

```bash
git clone https://github.com/GiangVoTruong/NovaShop.git
cd NovaShop
```

## Lưu ý bảo mật

- Không commit `.env`, `application-local.properties`, hoặc mật khẩu database.  
- Chỉ dùng `application.properties` / biến môi trường phù hợp với môi trường deploy của bạn.

## Giấy phép

Dự án phục vụ mục đích học tập / đồ án — quyền sử dụng do nhóm/lớp quy định.
