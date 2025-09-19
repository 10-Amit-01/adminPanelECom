# 📦 Admin Panel (React + Redux Toolkit + Node.js + MongoDB)

A full-stack **Admin Panel** application with authentication and product management.  
Built using **React, Redux Toolkit Query, Node.js, Express**.  

---

## 🚀 Features
- 🔐 JWT Authentication (Access + Refresh Tokens)  
- 🔄 Auto token refresh on expiry  
- 📦 Product CRUD (Add, Edit, Delete, List)  
- 📑 Pagination for products  
- 🖼️ Image upload with local path (`http://localhost:5000/uploads/...`)  
- 🎨 Styled with Tailwind CSS  

---

## ⚙️ Tech Stack
**Frontend:** React (Vite + TypeScript), Redux Toolkit, RTK Query, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Auth:** JWT with HttpOnly cookies  

---

## 📂 Project Structure
```
root/
 ├── client/   # React frontend
 ├── server/   # Node.js backend
 └── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/admin-panel.git
cd admin-panel
```

---

### 2️⃣ Backend Setup (server)
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/adminpanel
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Start backend:
```bash
npm run dev
```
Runs on: [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Frontend Setup (client)
```bash
cd client
npm install
```

Start frontend:
```bash
npm run dev
```
Runs on: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication Flow
1. **Login** → User gets short-lived `accessToken` and `refreshToken` (cookie).  
2. **Protected requests** → Send `Authorization: Bearer <accessToken>`.  
3. **On 403 (expired)** → Client calls `/api/refresh` to get a new token.  
4. **If refresh fails** → User is logged out.  

---

## 📡 API Endpoints

| Method | Endpoint                | Description                 | Auth |
|--------|--------------------------|-----------------------------|------|
| POST   | `/api/login`             | Login user                  | ❌   |
| POST   | `/api/refresh`           | Refresh access token        | ✅   |
| POST   | `/api/logout`            | Logout                      | ✅   |
| GET    | `/api/products?page=1`   | Get paginated products      | ✅   |
| POST   | `/api/products`          | Add product (form-data)     | ✅   |
| PUT    | `/api/products/:id`      | Update product              | ✅   |
| DELETE | `/api/products/:id`      | Delete product              | ✅   |

---

## 📸 Image Handling
- Uploads saved in `server/uploads/`  
- Served via `http://localhost:5000/uploads/<filename>`  

---

## ✅ To-Do
- [ ] Role-based access control (admin/user)  
- [ ] Use MongoDb to store products  
- [ ] Deployment (Vercel + Render/Heroku)  
- [ ] Global error notifications  

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.  

---

## 📜 License
[MIT](LICENSE)  
