# SalesSavvy — E-Commerce Frontend

A full-stack e-commerce application frontend built with React.js, featuring a clean user interface for both customers and admins.

 **Live Demo:** [https://ecommerce-frontend-oii1.vercel.app](https://ecommerce-frontend-oii1.vercel.app)  
 **Backend Repository:** [https://github.com/aqibs143/E-Commerce-backend-project](https://github.com/aqibs143/E-Commerce-backend-project)

---

## Tech Stack

- **Framework:** React.js 
- **Routing:** React Router DOM
- **State Management:** Context API
- **Styling:** CSS
- **Deployment:** Vercel

---

## Features

### User Side
- User registration and login with JWT authentication
- Browse and search products
- Add to cart and manage cart items
- Place orders and view order history

### Admin Side
- Admin dashboard with role-based access
- Add, update, and delete products
- View and manage all orders

---

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # User and Admin pages
├── context/           # AuthContext for global state
├── services/          # Axios API calls
└── App.jsx            # Main app with routing
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/aqibs143/ecommerce-frontend.git

# Navigate to project directory
cd ecommerce-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Backend API

This frontend connects to the SalesSavvy Spring Boot backend.  
Make sure the backend is running before testing locally.

Backend Repo: [https://github.com/aqibs143/E-Commerce-backend-project](https://github.com/aqibs143/E-Commerce-backend-project)


