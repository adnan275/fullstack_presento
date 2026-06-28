# 🌸 Presento — Premium Full-Stack E-Commerce Platform

Presento is a state-of-the-art, fully featured full-stack e-commerce marketplace designed with premium aesthetics. It incorporates **glassmorphism design concepts**, smooth **micro-animations (Framer Motion)**, and a highly polished dark-pink color palette (Playfair Display & Inter typography). 

Behind its gorgeous front-end lies a robust production-ready API built with Express, Prisma, and MySQL, integrating Cloudinary for media uploads, Google OAuth for authentication, and Nodemailer for transactional email triggers.

---

## 🚀 Key Features

### 🛍️ User Experience
- **Interactive Product Catalog**: Grid layout of products with sorting, searching, badges (e.g., featured, sale), and interactive category selection.
- **Dynamic Shopping Cart**: Real-time calculations, item counters, custom states, and smooth slide-in updates.
- **Saved Address Book**: Multi-address support allowing users to save, modify, or choose addresses during checkout.
- **Secure Checkout & Order Management**: Clean payment mock interface with complete cart-to-order processing, order history, and tracking.
- **Media-Rich Product Reviews**: Customers can leave ratings and comments, and upload **photos and videos** to express their feedback. Includes an overlay lightbox to view media files.
- **AI Assistant**: Conversational assistant interface ready to answer questions about products and recommend items.

### 🔐 Security & Identity
- **Dual-Method Auth**: Standard credentials login/signup alongside one-click **Google OAuth 2.0 Integration**.
- **Role-Based Access**: Secure admin routes protected via middleware. Regular users can manage their profiles and orders while admins have complete oversight.
- **Admin Dashboard**: Comprehensive CRUD dashboard to add products, modify specifications (SKU, discount, stock, descriptions), upload product media, and delete listings.

### ⚙️ Backend Architecture
- **Prisma ORM & MySQL**: Strongly typed database schema with structured relationships between Users, Addresses, Products, Orders, OrderItems, and Reviews.
- **Media Storage via Cloudinary**: Seamless integration with Multer to upload product images and review photos/videos to the cloud.
- **Transactional Email Triggers**: Automatic order confirmation and notifications sent via Nodemailer.

---

## 📊 System Architecture

```mermaid
flowchart TD
    %% Styling Definitions
    classDef client fill:#fdf2f8,stroke:#ec4899,stroke-width:2px,color:#831843;
    classDef server fill:#fff1f2,stroke:#be185d,stroke-width:2px,color:#9d174d;
    classDef database fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#831843;
    classDef external fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#1f2937;

    %% Frontend Components
    subgraph Frontend [Vite + React Client]
        UI[UI Components & Pages]
        Router[React Router DOM]
        State[Cart Context / Local Storage]
        Axios[Axios API Client]
    end
    class UI,Router,State,Axios client;

    %% Backend Server
    subgraph Backend [Express.js Backend API]
        Routing[Express Routers]
        AuthMW[JWT & Google OAuth Validator]
        MulterMW[Multer & Cloudinary Uploder]
        Prisma[Prisma Client ORM]
    end
    class Routing,AuthMW,MulterMW,Prisma server;

    %% Database
    subgraph Storage [Database Layer]
        MySQL[(MySQL Database)]
    end
    class MySQL database;

    %% Third-party APIs
    subgraph ThirdParty [Third-Party Integrations]
        Cloudinary[Cloudinary Cloud Media]
        Google[Google Identity Service]
        SMTP[SMTP Email Server]
    end
    class Cloudinary,Google,SMTP external;

    %% Flows & Interactions
    UI --> Router
    UI --> State
    UI --> Axios
    
    Axios <-->|HTTPS / JSON REST API| Routing
    
    Routing --> AuthMW
    Routing --> MulterMW
    Routing --> Prisma
    
    Prisma <-->|SQL Queries| MySQL
    
    MulterMW -->|Stream Files| Cloudinary
    AuthMW -->|Verify Identity| Google
    Routing -->|Send Notifications| SMTP
```

---

## 📁 Directory Structure

```
fullstack_presento/
├── admin-helper.html         # Local helper utility to mock admin credentials in localStorage
├── backend/                  # Server-side Application
│   ├── index.js              # Entrypoint server script
│   ├── prisma/
│   │   └── schema.prisma     # Prisma database schema definition (User, Product, Order, Review)
│   ├── routes/               # API endpoint definitions (auth, product, order, address, review)
│   ├── middleware/           # Auth verification middleware
│   ├── utils/                # Helper utilities (Cloudinary, Multer configs, nodemailer sendEmail)
│   └── scripts/              # Helper utility scripts
└── frontend/                 # Client-side React Application
    ├── index.html            # Main HTML entrypoint
    ├── src/
    │   ├── App.jsx           # Client router and route definitions
    │   ├── main.jsx          # App bootstrap logic
    │   ├── index.css         # Main custom styling & layout tokens
    │   ├── components/       # Reusable components (Navbar, FAQ, ReviewList, SearchBar, Lightbox)
    │   ├── pages/            # App view screens (Home, Products, Chat, Checkout, Cart)
    │   ├── context/          # Context providers (Cart state management)
    │   └── styles/           # Layout-specific CSS files
    └── vite.config.js        # Vite bundler configuration
```

---

## 🧪 Technologies Used
- **Frontend Core**: React 19, React Router DOM v7, Axios, Framer Motion, Vanilla CSS (Custom tokens with variables)
- **Tooling**: Vite, ESLint
- **Backend API**: Node.js, Express.js (v5)
- **Database Access**: Prisma Client, Prisma CLI
- **Identity & Mail**: jsonwebtoken, google-auth-library, bcryptjs, nodemailer, passport
- **Storage & Uploads**: Multer, Cloudinary SDK
