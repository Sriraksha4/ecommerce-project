# AuraCommerce - Smart E-Commerce Management System with AI Assistant & Analytics

A premium, scalable, and intelligent dual-sided e-commerce platform built using the MERN stack, integrated with Google Gemini AI for smart copy generation and database-driven ETL analytics dashboards.

Conducted in collaboration with **Commonwealth Bank of Australia (CBA)** and **TeamLease Foundation** (June 2026).

---

## 👥 Team Structure & Roles

| Name | Role | Responsibilities | Branch Name |
| :--- | :--- | :--- | :--- |
| **Sriraksha K R** | Backend Developer | Authentication, REST APIs, Order Management, Business Logic, AI copywriter | `backend-ai` |
| **Sathya Swaroop** | Frontend Developer | Home Page, Login UI, Product Listing, Cart UI, Dashboard UI, App Styling | `frontend-ui` |
| **Swathi S** | Database Developer | MongoDB Design, Product Models, Category Management, Inventory, Seed Data | `database` |
| **Dhrona R Teekinavaru** | AI/ML & Integration | Analytics Dashboard, AI Assistant, ETL Analytics, Testing, QA | `testing-integration` |

---

## 🏗️ System Architecture

AuraCommerce is designed using a **Three-Tier Architecture** ensuring high scalability, modularity, and security:

```
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER                    │
│      React.js / CSS3 / Context API (Theme & Auth)      │
└───────────────────────────┬────────────────────────────┘
                            │ (REST APIs / JWT Auth)
┌───────────────────────────▼────────────────────────────┐
│                    APPLICATION TIER                    │
│      Node.js / Express.js / Google Gemini AI / Groq     │
└───────────────────────────┬────────────────────────────┘
                            │ (Mongoose ODM / AWS SDK)
┌───────────────────────────▼────────────────────────────┐
│                       DATA TIER                        │
│           MongoDB Atlas / AWS S3 Cloud Storage         │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup & Local Installation

### Prerequisites
* [Node.js](https://nodejs.org) (v16+)
* [Git](https://git-scm.com)
* A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) Account

### 1. Clone the Project
```bash
git clone https://github.com/yourusername/ecommerce-project.git
cd ecommerce-project
```

### 2. Configure Backend Environment
Create a `.env` file under the `/backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_s3_bucket_name
```

### 3. Initialize & Start Servers

* **Start Backend Server**:
  ```bash
  cd backend
  npm install
  npm start
  ```
  *(Verifies: `Server Running` and `MongoDB Connected`)*

* **Seed Initial Data** (Optional - populated with 21 rich products & categories):
  ```bash
  node seed_premium_catalog.js
  ```

* **Start Frontend Dev Server**:
  ```bash
  cd ../frontend
  npm install
  npm start
  ```
  *(React will launch on [http://localhost:3000](http://localhost:3000))*

---

## 🛠️ Step-by-Step Git Collaboration Workflow
To align with the trainer's guidelines, team members work on separate feature branches and merge changes into `main` only through reviewed Pull Requests.

```
       [Feature Branch] ────► [Write Code] ────► [Push Branch] 
                                                    │
[Main Branch (Latest)] ◄─── [Merge PR] ◄─── [Approve PR] ◄─── [Create PR]
```

### Step 1: Clone & Invite Collaborators
1. Create the repository on GitHub and push the main codebase.
2. In the repository settings, go to **Settings** -> **Collaborators** -> **Add People** and invite team members.

### Step 2: Create a Feature Branch
Before writing code, checkout a new branch (never work directly on `main`):
```bash
# Switch to main and pull the latest code
git checkout main
git pull origin main

# Create and switch to your feature branch
git checkout -b <your-branch-name>
```
*Example*: `git checkout -b backend-ai`

### Step 3: Write Code & Commit
Make changes to your controllers, models, or UI components. Keep commits small and clean:
```bash
git add .
git commit -m "Added separate admin-login route and controller verification"
```

### Step 4: Push to GitHub
Publish your feature branch to the remote repository:
```bash
git push -u origin <your-branch-name>
```

### Step 5: Open a Pull Request (PR)
1. Go to the repository on GitHub.
2. Click the green **Compare & Pull Request** button that appears.
3. Choose to merge from `<your-branch-name>` into `main`.
4. Provide details of the changes and click **Create Pull Request**.

### Step 6: Review & Merge
1. Other teammates open the **Pull Requests** tab.
2. They click the PR to review all lines of changed code, comment, and click **Approve**.
3. Once approved, the author (or team lead) clicks **Merge Pull Request**.

### Step 7: Sync the Team
After a PR is merged, all other team members must sync their local workspaces to get the updates:
```bash
git checkout main
git pull origin main
```

---

## 🖼️ Foolproof Image Safeguard Guarantee
To prevent incorrect or mismatched placeholders from appearing in catalog listings (like watch images showing up for laptops):
* **Direct Database Mapping**: Every seeded product has highly relevant, high-resolution photo URLs populated in MongoDB.
* **Client-Side Fallback Logic** ([utils.js](file:///c:/ecommerce-project/frontend/src/services/utils.js)): If no image URL is provided, a dynamic resolver checks the category/name for hardware keywords (`"dell"`, `"hp"`, `"lenovo"`, `"macbook"`, `"intel"`, etc.) and automatically assigns a computer setup mockup graphic instead of general icons, ensuring a polished demonstration.
