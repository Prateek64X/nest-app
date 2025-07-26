# 🏠 Nest App

A mobile-friendly web application for small landlords to easily manage their rooms, tenants, electricity costs, and payments.

---

## 📱 Tech Stack

### Client

- **React** with **Vite**
- **Shadcn/ui** components
- Tailored for mobile-first usage

### Server

- **Express.js**
- **Prisma ORM**
- **PostgreSQL**

---

## ✨ Features

- ✅ Add and manage rooms
- ✅ Create and update tenants
- ✅ Upload and manage tenant documents
- ✅ Track monthly electricity cost per room
- ✅ Mark rent/electricity as paid
- ✅ Fully responsive and mobile-optimized UI

---

## 🛠️ Project Structure

```markdown
nest-app/
├── client/ # React frontend (Vite)
├── server/ # Express backend with Prisma and PostgreSQL
├── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the Repository

---

```bash
git clone https://github.com/your-username/nest-app.git
cd nest-app
```

### 2. Configure Environment Variables

📦 Server (server/.env)

```bash
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/nest_app_db
JWT_SECRET=secret
JWT_EXPIRES_IN=150d
```

💻 Client (client/.env)

```bash
VITE_API_URL=http://localhost:4000/api
```

### 3. Install Dependencies

- #### Server

```bash
cd server
npm install
```

- #### Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

- #### Client

```bash
cd ../client
npm install
```

### 4. Run the App

- #### Start Backend

```bash
cd server
npm run dev
```

- #### Start Frontend

```bash
cd ../client
npm run dev
```

- Visit: http://localhost:5173

## 🗃️ Database Schema

    admins
    rooms
    tenants
    room_rents

## 🔐 Authentication

JWT-based admin authentication is implemented with:
Secret: JWT_SECRET
Expiry: JWT_EXPIRES_IN

## 📌 Future Improvements

    ⏳ Monthly rent/electricity report generation
    🧾 Documents upload in personal Google Drive
    🔔 Payment reminders
    🖥️ Better Desktop UI

## 🙌 License

MIT License
