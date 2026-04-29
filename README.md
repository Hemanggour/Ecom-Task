# E-Commerce Application

A full-stack e-commerce application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Admin Panel**: Admin dashboard for managing products, categories, and orders
- **Product Management**: Browse products by categories, search functionality
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, track order status
- **Responsive Design**: Mobile-friendly interface built with modern UI components

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **TailwindCSS** for styling (via shadcn/ui components)

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🗄️ Database Setup

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE ecom;
   ```

2. **Run the database schema:**
   ```bash
   cd BACKEND
   psql -U postgres -d ecom -f db.sql
   ```

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd Internship-Task
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials and preferences
# Example configuration:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecom
PORT=5000
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword123

# Create admin user (optional - you can register through the app)
node scripts/createAdmin.js

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd FRONTEND

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: Available through the frontend after admin login

## 📁 Project Structure

```
Internship-Task/
├── BACKEND/
│   ├── middleware/          # Express middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── utils/              # Helper utilities
│   ├── .env.example        # Environment variables template
│   ├── db.sql              # Database schema
│   ├── db.js               # Database connection
│   └── package.json        # Backend dependencies
├── FRONTEND/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── assets/         # Static assets
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🔧 Available Scripts

### Backend
```bash
npm start          # Start the server
npm test           # Run tests (not configured yet)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## 🤖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=5000
JWT_SECRET=your-secret-jwt-key
FRONTEND_URL=http://localhost:5173

# Admin user (optional)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword123
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in .env file
   - Verify database exists and schema is imported

2. **Port Already in Use**
   - Change PORT in .env file (backend)
   - Frontend runs on 5173 by default (Vite default)

3. **CORS Issues**
   - Ensure FRONTEND_URL in backend .env matches your frontend URL
   - Check that CORS middleware is properly configured

4. **JWT Token Issues**
   - Clear browser localStorage/cookies
   - Ensure JWT_SECRET is set in .env

## 📝 Development Notes

- The backend uses Express.js with middleware for authentication and CORS
- Database uses UUID for primary keys with automatic timestamp updates
- Frontend uses React Router for client-side routing
- Authentication state is managed using localStorage and context
- File uploads are handled using Multer middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 📞 Support

For any queries or issues, please open an issue in the repository or contact the development team.
