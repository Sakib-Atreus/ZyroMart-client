# ZyroMart — Frontend Client

A modern, responsive multi-vendor e-commerce storefront built with **React 18**, **Vite**, and **Tailwind CSS**. Ships separate role-based dashboards for admins and vendors alongside a full customer-facing shopping experience.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Scripts](#scripts)

---

## Overview

ZyroMart's frontend delivers a complete shopping experience for three types of users:

- **Customers** — browse products, manage cart and wishlist, place orders, and pay via Stripe or SSLCommerz.
- **Vendors** — manage their own product listings, variants, orders, and shop settings through a dedicated dashboard.
- **Admins** — oversee the entire platform: approve vendors, moderate products, manage categories, and view platform-wide analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 |
| Build Tool | Vite 5.4 |
| Language | JavaScript (ES2022+) |
| Styling | Tailwind CSS 3.4 + DaisyUI 4.12 |
| Component Library | Ant Design 5.x |
| Routing | React Router DOM 6.x |
| HTTP Client | Axios 1.x |
| Animation | Framer Motion 11.x |
| Charts | Recharts 3.x |
| Carousels | React Slick |
| Maps | React Google Maps API |
| Notifications | React Toastify |
| Sliders | rc-slider |
| Icons | FontAwesome + React Icons |
| Social Sharing | React Share |

---

## Features

### Customer Experience
- Product browsing with search and multi-faceted filtering
- Product detail pages with variant selection (size, color, etc.)
- Image galleries and similar product recommendations
- Star ratings and written reviews
- Product Q&A — ask questions, read vendor answers
- Persistent server-side shopping cart
- Wishlist management
- Checkout with address entry
- Payment via **Stripe** (international cards) or **SSLCommerz** (Bangladeshi banks/mobile money)
- Order history with status tracking
- Order cancellation
- Profile management and password change

### Admin Dashboard
- Platform analytics (revenue, users, orders, vendors)
- Category management (create, edit, delete, nested categories)
- Vendor application review and approval workflow
- Product moderation (activate / deactivate listings)
- Order monitoring across all vendors
- Admin-to-vendor messaging

### Vendor Dashboard
- Vendor-specific analytics (own revenue, orders, top products)
- Product listing management (CRUD + variant management)
- Order tracking for own sales
- Shop settings (name, logo, description)
- Vendor-to-admin messaging
- Answer customer Q&A on own products

### General
- JWT-based authentication with automatic token refresh handling
- Role-based protected routes (`user`, `vendor`, `admin`)
- 401 auto-redirect to login; 403 access-denied feedback
- Responsive design — mobile first via Tailwind CSS
- Toast notifications for all async feedback
- Smooth page and component animations via Framer Motion

---

## Getting Started

### Prerequisites

- Node.js v18+
- The ZyroMart backend running at `http://localhost:5000` (or configure `VITE_API_BASE_URL`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ZyroMart-client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Add your Google Maps API key if needed
```

### Running the App

```bash
# Development server (hot reload)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Backend API base URL (default: http://localhost:5000/api/v1)
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Google Maps (required for store locations page)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## Project Structure

```
ZyroMart-client/
├── public/
├── src/
│   ├── main.jsx               # App entry point — mounts providers
│   ├── App.jsx                # Root component
│   ├── App.css
│   ├── index.css
│   │
│   ├── api/
│   │   ├── axios.js           # Axios instance + request/response interceptors
│   │   └── endpoints.js       # Typed API call wrappers for all modules
│   │
│   ├── context/
│   │   ├── AuthContext.jsx    # User auth state + login/logout actions
│   │   └── CartWishlistContext.jsx  # Cart & wishlist counts + refresh
│   │
│   ├── routes/
│   │   ├── Routes.jsx         # Main router configuration
│   │   ├── PrivateRoutes.jsx  # Require any authenticated user
│   │   ├── AdminRoute.jsx     # Require admin role
│   │   └── VendorRoute.jsx    # Require vendor role
│   │
│   ├── layout/
│   │   ├── Main.jsx           # Public/customer layout (navbar + footer)
│   │   ├── AdminLayout.jsx    # Admin sidebar layout
│   │   └── VendorLayout.jsx   # Vendor sidebar layout
│   │
│   ├── pages/
│   │   ├── Home/              # Landing page (banners, featured products)
│   │   ├── Phones/            # Product listing with filters
│   │   ├── Login/             # Login form
│   │   ├── Register/          # Registration form
│   │   ├── Profile/           # User profile & password change
│   │   ├── Cart/              # Shopping cart
│   │   ├── Wishlist/          # Saved products
│   │   ├── Checkout/          # Checkout flow
│   │   │   ├── index.jsx      # Checkout form + payment method selection
│   │   │   ├── Success.jsx    # Post-payment success page
│   │   │   └── Cancel.jsx     # Payment cancelled page
│   │   │
│   │   ├── Admin/             # Admin dashboard pages
│   │   │   ├── Dashboard/
│   │   │   ├── Categories/
│   │   │   ├── Vendors/
│   │   │   ├── Products/
│   │   │   ├── Orders/
│   │   │   └── Chat/
│   │   │
│   │   ├── Vendor/            # Vendor dashboard pages
│   │   │   ├── Dashboard/
│   │   │   ├── MyProducts/
│   │   │   ├── Orders/
│   │   │   ├── ShopSettings/
│   │   │   └── Chat/
│   │   │
│   │   ├── About/
│   │   ├── FAQ/
│   │   ├── Careers/
│   │   ├── Contact/
│   │   ├── StoreLocations/
│   │   ├── PrivacyPolicy/
│   │   └── TermsOfService/
│   │
│   ├── components/
│   │   ├── ChatWidget/        # Floating chat widget
│   │   └── PhoneDetails/      # Product detail view with variants, reviews, Q&A
│   │
│   ├── assets/                # Images, videos, static media
│   ├── utils/                 # Helper functions
│   ├── shared/                # Shared UI elements
│   └── providers/             # Context providers wrapper
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

---

## Routing

### Public Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page with featured products and promotions |
| `/phones` | Product Listing | Browse, search, and filter all products |
| `/products/:slug` | Product Detail | Full product page with variants, reviews, and Q&A |
| `/cart` | Cart | Shopping cart (view only if not logged in) |
| `/login` | Login | Email + password login |
| `/register` | Register | New account creation |
| `/about` | About | Company information |
| `/faq` | FAQ | Frequently asked questions |
| `/careers` | Careers | Job listings |
| `/contact` | Contact | Contact form and details |
| `/storeLocations` | Store Locations | Map view of physical stores |
| `/privacy-policy` | Privacy Policy | Legal privacy policy |
| `/terms` | Terms of Service | Terms and conditions |

### Private Routes (require login)

| Path | Page | Description |
|---|---|---|
| `/profile` | Profile | View and edit user profile, change password |
| `/wishlist` | Wishlist | Saved products |
| `/checkout` | Checkout | Enter address, select payment method |
| `/checkout/success` | Success | Post-payment confirmation |
| `/checkout/cancel` | Cancel | Cancelled payment message |

### Admin Routes (require `admin` role)

| Path | Page | Description |
|---|---|---|
| `/admin` | Dashboard | Platform analytics overview |
| `/admin/categories` | Categories | Create, edit, delete product categories |
| `/admin/vendors` | Vendors | Review applications, approve or suspend vendors |
| `/admin/products` | Products | View and moderate all product listings |
| `/admin/orders` | Orders | Monitor all orders across all vendors |
| `/admin/chat` | Chat | Message vendors |

### Vendor Routes (require `vendor` role)

| Path | Page | Description |
|---|---|---|
| `/vendor` | Dashboard | Own revenue and sales analytics |
| `/vendor/products` | My Products | Manage own product listings and variants |
| `/vendor/orders` | Orders | Track own incoming orders |
| `/vendor/settings` | Shop Settings | Update shop name, logo, and description |
| `/vendor/chat` | Chat | Message the platform admin |

---

## State Management

State is managed with React Context API — no external state library is required.

### AuthContext (`src/context/AuthContext.jsx`)

Provides authentication state throughout the application.

| Export | Type | Description |
|---|---|---|
| `user` | object \| null | Current authenticated user (persisted to localStorage) |
| `token` | string \| null | JWT access token |
| `isAdmin` | boolean | Computed from `user.role === 'admin'` |
| `isVendor` | boolean | Computed from `user.role === 'vendor'` |
| `login(userData, token)` | function | Stores user and token, initialises cart/wishlist |
| `logout()` | function | Calls backend logout, clears localStorage and context |

### CartWishlistContext (`src/context/CartWishlistContext.jsx`)

Tracks cart and wishlist item counts for header badges.

| Export | Type | Description |
|---|---|---|
| `cartCount` | number | Total items in cart |
| `wishlistCount` | number | Total items in wishlist |
| `refreshCart()` | function | Sync cart count from server |
| `refreshWishlist()` | function | Sync wishlist count from server |

Counts are auto-synced on login and cleared on logout.

---

## API Integration

### Axios Instance (`src/api/axios.js`)

A pre-configured Axios instance handles all API communication.

**Base URL:** `VITE_API_BASE_URL` (default: `http://localhost:5000/api/v1`)

**Request interceptor:** Automatically attaches `Authorization: <token>` from localStorage to every request.

**Response interceptor:**

| Status | Behavior |
|---|---|
| 401 Unauthorized | Clears token and user, redirects to `/login` |
| 403 Forbidden | Shows "No access" toast notification |
| 500+ Server Error | Shows "Server error" toast notification |
| Validation errors | Extracts first field error and shows descriptive toast |

### API Endpoints (`src/api/endpoints.js`)

All API calls are organised into typed function groups:

| Group | Functions |
|---|---|
| `authApi` | `login`, `signup`, `logout`, `changePassword` |
| `userApi` | `getMe`, `updateMe`, `adminList`, `dashboard` |
| `categoryApi` | `list`, `featured`, `get(slug)`, `create`, `update`, `remove` |
| `vendorApi` | `list`, `apply`, `me`, `updateMe`, `changeStatus`, `adminList`, `adminCreate` |
| `productApi` | `list(params)`, `getBySlug(slug)`, `create`, `update`, `remove`, `changeStatus`, `vendorMe`, `newArrivals`, `topSelling`, `onlineExclusive`, `similar(id)` |
| `variantApi` | `byProduct(productId)`, `create`, `bulk`, `update`, `remove` |
| `orderApi` | `listAll`, `listMine`, `vendorMine`, `get(id)`, `create`, `cancel`, `updateStatus` |
| `cartApi` | `get`, `addItem`, `updateItem(variantId)`, `removeItem`, `clear` |
| `paymentApi` | `createCheckoutSession`, `createSSLCSession` |
| `wishlistApi` | `get`, `add`, `remove`, `clear` |
| `reviewApi` | `listByProduct`, `myReviewForProduct`, `create`, `update`, `remove` |
| `questionApi` | `listByProduct`, `create`, `answer`, `remove` |
| `analyticsApi` | `platform`, `vendor` |
| `chatApi` | `sendMessage`, `myConversation`, `listConversations`, `adminSend`, `getMessages` |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across the project |

---

## License

This project is proprietary. All rights reserved.
