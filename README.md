# E-Commerce - Smart E-Commerce Management System with AI Assistant & Analytics

A premium, scalable, and intelligent dual-sided e-commerce platform built using the MERN stack. E-Commerce integrates Google Gemini AI for smart product copywriting, an ETL-driven analytics dashboard for sales tracking, and secure dual-role workflows for customers and administrators.

Conducted in collaboration with the **Commonwealth Bank of Australia (CBA)** and **TeamLease Foundation** (June 2026).

---

## 📋 Table of Contents
1. [Project Synopsis & Abstract](#-project-synopsis--abstract)
2. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
3. [Project Directory Structure](#-project-directory-structure)
4. [Installation & Setup Steps](#-installation--setup-steps)
5. [Database Schema & Seed Catalog](#-database-schema--seed-catalog)
6. [Running the Application Locally](#-running-the-application-locally)
7. [Admin vs. Customer Workflows](#-admin-vs-customer-workflows)
8. [Step-by-Step Git Collaboration Workflow](#-step-by-step-git-collaboration-workflow)

---

## 📖 Project Synopsis & Abstract

### Abstract
The **Smart E-Commerce Management System with AI Assistant and Analytics Dashboard** is a MERN-based application designed to bridge modern full-stack development, cloud database architecture, and artificial intelligence. 
* **Customers** can browse products, manage wishlists, place orders, print invoices, and converse with a Google Gemini-powered shopping assistant.
* **Administrators** are equipped with real-time sales overview metrics, inventory level alerts, customer active status switches, and an automated AI copywriting console.

### Key Technologies Used
* **Frontend**: React.js, CSS3 (Light/Dark themes), React Router v7, Bootstrap, Bootstrap Icons
* **Backend**: Node.js, Express.js, JWT Authentication
* **Database**: MongoDB Atlas (NoSQL)
* **AI Integration**: Google Gemini API (`gemini-1.5-flash`) / Groq SDK Llama-3 fallback
* **Cloud Storage**: AWS S3 (Simple Storage Service) for product images

---

## ⚙️ Prerequisites & System Requirements

Ensure the following tools are installed on your local machine before setting up the application:

1. **Node.js**: Version `18.0.0` or higher. [Download Node.js](https://nodejs.org/).
2. **npm**: Node Package Manager (comes bundled with Node.js).
3. **Git**: For version control and branch collaboration. [Download Git](https://git-scm.com/).
4. **MongoDB Atlas Account**: A cloud cluster to host database collections. [Create MongoDB Account](https://www.mongodb.com/cloud/atlas).
5. **Gemini or Groq API Key**: For natural language processing and AI copy generation.

---

## 📂 Project Directory Structure

```text
ecommerce-project/
├── backend/
│   ├── config/             # Database connection setups
│   ├── controllers/        # Business logic controllers (User, Product, Order, AI, etc.)
│   ├── middleware/         # Auth verify checks (JWT extraction)
│   ├── models/             # Mongoose schemas (User, Product, Category, Order, Payment)
│   ├── routes/             # Express API endpoints
│   ├── .env                # Backend environment config (git-ignored)
│   ├── server.js           # Server initialization file
│   └── package.json        # Backend dependencies & startup scripts
└── frontend/
    ├── src/
    │   ├── components/     # Reusable layout containers (Sidebar, Navbar, ProtectedRoute)
    │   ├── context/        # React global state managers (Auth, Cart, Theme)
    │   ├── pages/          # Pages (Home, Shop, Details, Admin Dashboard, AIGenerator)
    │   ├── services/       # API axios clients and helper utilities (utils.js)
    │   ├── App.css         # Global stylesheets and animation keys
    │   ├── App.js          # React Router mappings
    │   └── index.js        # React bootstrap mount
    └── package.json        # Frontend package configuration
```

---

## 🚀 Installation & Setup Steps

Follow these instructions to install all packages and configure dependencies:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecommerce-project.git
cd ecommerce-project
```

### 2. Configure Backend Credentials
Create a file named `.env` inside the `/backend` folder:
```bash
# Windows Command Prompt / PowerShell:
notepad backend/.env
```
Add the following keys (replace placeholders with your actual credentials):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auracommerce?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_s3_bucket_name
```

### 3. Install Backend Dependencies
Navigate to the `backend` directory and install the packages:
```bash
cd backend
npm install
```
This will install core dependencies:
* `express` - Server framework
* `mongoose` - Database ODM
* `jsonwebtoken` - Secure customer/admin token generation
* `bcryptjs` - Password hashing
* `@google/generative-ai` - Gemini SDK

### 4. Install Frontend Dependencies
Open a new terminal session, navigate to the `frontend` folder, and install:
```bash
cd ../frontend
npm install
```
This will install UI packages:
* `axios` - Promise-based HTTP client for API requests
* `react-router-dom` - Navigation routes manager
* `bootstrap` & `bootstrap-icons` - Layout components and icons

---

## 📊 Database Schema & Seed Catalog

Before running the storefront, run the seeder script to populate your MongoDB Atlas Cluster 0 database with 21 premium products across laptops, mobiles, headphones, watches, clothing, furniture, and books.

Run the seeder from the `backend` directory:
```bash
cd backend
node seed_premium_catalog.js
```
*Expected Output:*
```text
Connected to MongoDB Atlas.
Cleared categories.
Cleared products.
Seeded 7 categories.
Seeded 21 products with gorgeous high-quality images.
Disconnected.
```

To promote a registered email address to **Admin**, run:
```bash
node promote_admin.js
```
*(Promotes `srirakshakr.4@gmail.com` to admin role and sets up the backup administrator `admin@ecommerce.com` with password `Admin@1234`)*

---

## 💻 Running the Application Locally

Start both servers to begin testing the storefront and administrative panel:

### Start the Backend API Server
In the `backend` directory:
```bash
npm run start
```
*Expected console logs:*
```text
Server Running
MongoDB Connected
```

### Start the Frontend React Dev Server
In the `frontend` directory:
```bash
npm run start
```
This will start the local server on [http://localhost:3000](http://localhost:3000) and open it automatically in your default browser.

---

## 🛡️ Admin vs. Customer Workflows

The application handles two completely separate user roles:

### 👤 Customer Flow ([http://localhost:3000/login](http://localhost:3000/login))
* **Actions**: Register accounts -> Log in -> Search & filter products -> Add to Wishlist/Cart -> Checkout (COD/UPI/Card) -> Track Order -> Print Invoice.
* **Logout**: Click the **User Name/Initial** button on the top-right header navbar to open the dropdown menu, then select the red **Logout** option.

### 👑 Admin Flow ([http://localhost:3000/admin-login](http://localhost:3000/admin-login))
* **Credential Gates**: Only users holding `role: "admin"` in the database can authenticate. Customers are blocked automatically.
* **Console Tools**:
  * **Dashboard**: Track sales trends, order volumes, and inventory alerts.
  * **Products**: Create, edit, and delete items. Contains a **✨ AI Generate Copy** button inside add/edit modals to generate description details.
  * **Orders**: Track and update fulfillment status (Pending, Shipped, Delivered, Cancelled) using dropdown selections.
  * **Customers**: Control user status (activate or deactivate users).

---

## 🤝 Step-by-Step Git Collaboration Workflow
Collaborators work on separate branches to keep the codebase safe.

```
       [Feature Branch] ────► [Write Code] ────► [Push Branch] 
                                                    │
[Main Branch (Latest)] ◄─── [Merge PR] ◄─── [Approve PR] ◄─── [Create PR]
```


