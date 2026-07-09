# Expense Tracker

A fullstack web app for tracking personal expenses, with user authentication and a spending summary chart. Built as a portfolio project for internship applications.

## Live Demo
- **Frontend:** https://joyful-bonbon-5426c4.netlify.app
- **Backend API:** https://expense-tracker-rumm.onrender.com

> Note: the backend is on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a while may take 30–60 seconds to respond.

## Features
- User signup and login with JWT-based authentication
- Passwords hashed with bcrypt (never stored in plain text)
- Full CRUD for expenses — add, edit, delete, view
- Data is private per user (protected API routes)
- Monthly total and category-based spending summary
- Interactive pie chart of spending by category (Chart.js)

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB (MongoDB Atlas) + Mongoose |
| Auth | JWT + bcrypt |
| Charts | Chart.js |
| Deployment | Render (backend), Netlify (frontend) |

## Screenshots
*(Add 2–3 screenshots here — login page, dashboard with expenses, and the pie chart)*

```
![Login Page](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
```

## Project Structure
```
expense-tracker/
├── backend/
│   ├── server.js
│   ├── models/         # Mongoose schemas (User, Expense)
│   ├── routes/          # Auth and expense API routes
│   ├── middleware/       # JWT verification middleware
│   └── .env.example
└── frontend/
    ├── login.html
    ├── index.html
    ├── style.css
    ├── auth.js
    └── script.js
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/expenses` | Get all expenses for the logged-in user |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/expenses/summary/stats` | Monthly total and category breakdown |

All `/api/expenses` routes require an `Authorization: Bearer <token>` header.

## Running Locally

**1. Clone the repo**
```bash
git clone https://github.com/Lasen-Kulanaka/Expense-Tracker.git
cd Expense-Tracker/backend
```

**2. Install backend dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy `.env.example` to `.env` and fill in your own values:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
PORT=5000
```

**4. Start the backend**
```bash
npm run dev
```

**5. Run the frontend**

Open `frontend/login.html` directly in your browser (make sure `API_URL` in `auth.js` and `script.js` points to `http://localhost:5000` for local use).
