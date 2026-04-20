# 💒 Wedding QR Guest Manager

A full-stack web application that helps manage wedding guests using QR codes. Each guest receives a unique QR code for entry, and the system validates and tracks attendance in real-time.

---

## 🚀 Features

- 📂 Upload guest list (CSV or JSON)
- 🔑 Generate unique QR code for each guest
- 📧 Send or download QR codes
- 📱 Scan QR codes at entrance
- ✅ Automatic check-in system (prevents duplicate entry)
- 📊 Admin dashboard (guest stats)

---

## 🧠 How It Works

1. Upload guest list (name + phone)
2. Backend generates a unique ID (token) for each guest
3. QR code is generated using that token
4. Guest receives QR code
5. At entrance:
   - QR is scanned
   - System verifies guest
   - Marks guest as “checked in”

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React QR Scanner

### Backend
- Node.js
- Express.js
- PostgreSQL / MongoDB (depending on setup)
- CSV Parser
- QR Code Generator

---
