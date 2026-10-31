# G Arasu Bakery

Responsive customer storefront and mobile-ready REST API in one JavaScript (no TypeScript) Next.js App Router codebase, backed by MongoDB and Mongoose.

## Setup

1. Install Node.js 20.9 or newer.
2. Set `MONGODB_URI` in `.env.local` to your MongoDB Atlas URI and choose a database name in its path.
3. Set a random `AUTH_SECRET` of at least 32 characters.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (minimum 12 characters).
5. Run `npm install`, `npm run seed:admin`, then `npm run dev`.

The local `.env.local` file is ignored by Git. Never commit database credentials. Rotate credentials if they have been pasted into a chat, source file, or other shared location. This workspace's Node DNS resolver could not resolve the Atlas SRV record, so its local URI uses the equivalent replica-set hosts; the application accepts either `mongodb+srv://` or a standard `mongodb://` replica-set URI.

MongoDB transactions are used for stock reservations and cancellations. Use Atlas or a replica-set-enabled MongoDB deployment.

Next.js development output is isolated in `next-dev/`; production builds use `.next/`. If `next dev` is already running when you update the config, stop it in its terminal and run `npm run dev` again so it picks up the isolated output directory.

## Web storefront

Visit `/` for the responsive bakery website. It reads the live menu and categories from the same API routes used by mobile clients. Additional storefront pages include `/menu`, `/menu/:categorySlug`, `/sweets`, `/snacks`, `/products/:slug`, `/cart`, `/account`, `/about`, and `/contact`. Customers can search and filter the catalog, keep a local shopping bag, register or sign in, place COD orders for delivery or pickup, and view their order history.

Admins use `/admin/login` for the separate staff sign-in and `/admin` for the protected dashboard. The dashboard supports order review/status updates and product create/edit/soft-delete. Customer sign-out is on `/account`; admin sign-out is inside the dashboard. Admin tokens are stored separately from customer tokens in session storage.

The website's mobile layout is responsive; native apps can call the same `/api/*` endpoints on the deployed host. Browser checkout stores its short-lived bearer token in session storage. Native applications should use OS-provided secure token storage.

## Sample Nagercoil sweets and snacks

Run `npm run seed:demo-products` to add sample listings such as banana chips, tapioca chips, mixture, kai murukku, thattai, ribbon pakoda, adhirasam, Mysore pak, coconut burfi, ellu urundai, nei appam, and milk peda. The seed can be rerun safely.

These are clearly marked `isDemo: true`, include illustrative prices and inventory only, display “Ask for today's price” in the storefront, and cannot be purchased. Each sample has an original local illustration under `public/images/products/`. Confirm actual products, prices, and stock with the bakery before publishing them. An admin must update a demo product with verified `pricePaise` and `stock` and explicitly set `isDemo: false` in the same `PATCH /api/admin/products/:id` request before it becomes orderable.

## Mobile authentication

Register or log in, then send the returned access token with protected requests:

```http
Authorization: Bearer <accessToken>
```

Store tokens in the mobile operating system's secure storage. Tokens expire after seven days. The stateless token is not server-revocable; mobile logout should remove it from secure storage.

## Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Verify connection and API health |
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Login and receive bearer JWT |
| GET | `/api/auth/me` | Current authenticated account |
| GET | `/api/categories` | List active categories |
| GET | `/api/products` | Product listing; supports `search`, `category`, `featured`, `sort`, `page`, `limit` |
| GET | `/api/products/:slug` | Product details |
| POST / GET | `/api/orders` | Place COD order / list own orders |
| GET | `/api/orders/:id` | Read own order and status history |
| GET / POST | `/api/admin/products` | Admin list/create products |
| PATCH / DELETE | `/api/admin/products/:id` | Admin update or soft-delete product |
| POST | `/api/admin/categories` | Admin create category |
| GET | `/api/admin/orders` | Admin list/filter orders |
| PATCH | `/api/admin/orders/:id` | Admin update order status/cancel |

Prices are integer paise (₹40 is `4000`). The order API accepts product IDs and quantities only, then calculates totals from the database. It reserves inventory in a transaction and returns stock on eligible cancellation. Delivery fees are currently zero; configure a verified business setting before charging any.

## Example order body

```json
{
  "items": [{ "productId": "MongoDB_PRODUCT_ID", "quantity": 2 }],
  "fulfillment": "delivery",
  "address": {
    "name": "Customer Name",
    "phone": "9876543210",
    "line1": "House and street",
    "city": "Nagercoil",
    "state": "Tamil Nadu",
    "pincode": "629001"
  },
  "notes": ""
}
```

## Production limitations

This MVP does not yet include Razorpay, password reset, email, image uploads, coupons, or persistent rate limiting. Its in-memory authentication rate limiter is process-local and is not sufficient for a distributed/serverless deployment. Add a shared rate limit store and token revocation/refresh design before production.


## ✨ Key Features

### 🛍️ Customer Experience

- **Modern Bakery Storefront:** Responsive shopping experience for desktop, tablet and mobile.
- **Product Discovery:** Browse sweets, snacks and bakery products by category.
- **Smart Search:** Find products using product names and categories.
- **Product Details:** View descriptions, availability and pricing.
- **Shopping Bag:** Add products, update quantities and remove items.
- **Customer Authentication:** Secure registration and login.
- **Online Ordering:** Place Cash on Delivery orders.
- **Flexible Fulfillment:** Choose home delivery or store pickup.
- **Order History:** View previously placed orders.
- **Order Tracking:** Follow order progress and status updates.
- **Mobile API Support:** Reuse the same backend APIs for future Android and iOS applications.

### ⚙️ Admin Management

- **Admin Authentication:** Separate and protected staff login.
- **Dashboard:** Manage bakery operations from one place.
- **Product Management:** Create, update and manage products.
- **Category Management:** Organize sweets, snacks and bakery items.
- **Order Management:** View and manage customer orders.
- **Order Status Updates:** Manage order processing and fulfillment.
- **Inventory Management:** Monitor product stock and availability.
- **Demo Product Management:** Safely manage sample listings before publishing verified products.

---

## 🏗️ Application Architecture

The application follows a modular full-stack architecture using Next.js App Router.

```text
                  G ARASU BAKERY
                         |
          +--------------+--------------+
          |                             |
     Customer Storefront           Admin Panel
          |                             |
          +--------------+--------------+
                         |
                 Next.js App Router
                         |
                  REST API Layer
                         |
                  Authentication
                         |
                   Mongoose ODM
                         |
                   MongoDB Atlas
```

### Architecture Highlights

- Single Next.js application for frontend and backend.
- RESTful API endpoints for customer and admin operations.
- Reusable React components.
- Centralized MongoDB connection.
- Mongoose schemas for structured data management.
- Role-based access control.
- Server-side price calculation.
- Transaction-based inventory reservation.
- Shared APIs for web and mobile clients.

---

## 📂 Main Application Modules

| Module | Description |
|---|---|
| Storefront | Customer-facing bakery website |
| Product Catalog | Product listing and discovery |
| Categories | Sweets, snacks and bakery categories |
| Authentication | Customer and admin authentication |
| Shopping Bag | Cart and quantity management |
| Checkout | Delivery and pickup ordering |
| Order Management | Order creation and processing |
| Order Tracking | Order status and history |
| Admin Dashboard | Bakery administration |
| REST API | Backend services for web and mobile |

---

## 🍬 Product Categories

The application includes sample categories inspired by popular Tamil Nadu bakery and traditional snack items.

### Traditional Sweets

- Adhirasam
- Mysore Pak
- Coconut Burfi
- Ellu Urundai
- Nei Appam
- Milk Peda

### Traditional Snacks

- Banana Chips
- Tapioca Chips
- Mixture
- Kai Murukku
- Thattai
- Ribbon Pakoda

### Bakery Products

- Egg Puffs
- Chicken Rolls
- Vegetable Puffs
- Bread
- Cakes
- Pastries
- Cupcakes
- Cookies

> **Note:** Sample products are illustrative demo listings. Actual product availability, pricing and inventory must be confirmed by the bakery.

---

## 🔐 Security and Data Integrity

Security and data consistency are important parts of the application.

- Password hashing for customer and admin accounts.
- JWT-based authentication.
- Separate customer and admin authentication tokens.
- Protected admin API endpoints.
- Authorization checks for customer-owned orders.
- Server-side product price verification.
- MongoDB transactions for inventory reservation.
- Inventory restoration during eligible order cancellations.
- Environment-based configuration for sensitive credentials.
- Soft deletion for product management.
- Input validation and API error handling.

---

## 📱 Mobile Application Integration

The backend is designed to support future mobile applications without creating a separate backend.

Android and iOS applications can consume the same REST API endpoints.

### Mobile Integration Features

- Customer registration and login.
- Product catalog browsing.
- Category filtering.
- Shopping cart.
- Order placement.
- Order history.
- Order status tracking.

Authentication uses bearer access tokens. Mobile applications should store these tokens using Android Keystore or iOS Keychain through a secure-storage library.

---

## 🚀 Future Enhancements

The following features are planned for future development:

- [ ] Razorpay online payment integration.
- [ ] Email order confirmation notifications.
- [ ] WhatsApp order notifications.
- [ ] Product image upload using Cloudinary.
- [ ] Coupon and discount management.
- [ ] Delivery charge configuration.
- [ ] Delivery area and pincode management.
- [ ] Real-time order status notifications.
- [ ] Customer reviews and ratings.
- [ ] Wishlist functionality.
- [ ] Advanced sales analytics.
- [ ] Daily and monthly sales reports.
- [ ] Password reset and email verification.
- [ ] Persistent distributed API rate limiting.
- [ ] Android and iOS mobile applications.
- [ ] Product availability and pre-order scheduling.

---

## 🧪 Testing and Verification

Before deployment, verify the following workflows:

1. Customer registration and login.
2. Product listing and category filtering.
3. Shopping bag operations.
4. Checkout validation.
5. Successful Cash on Delivery order creation.
6. Inventory reservation.
7. Customer order history.
8. Order status tracking.
9. Admin login and authorization.
10. Product creation, editing and deletion.
11. Admin order status updates.
12. Inventory restoration after eligible cancellations.
13. Mobile API authentication.

---

## 🌐 Deployment

The application can be deployed using Vercel with MongoDB Atlas as its cloud database.

### Deployment Workflow

1. Push the project to GitHub.
2. Create a MongoDB Atlas production database.
3. Import the GitHub repository into Vercel.
4. Configure production environment variables.
5. Deploy the Next.js application.
6. Verify API health and database connectivity.
7. Test customer and admin workflows.
8. Configure the production domain.

### Health Check Endpoint

```http
GET /api/health
```

Use this endpoint to verify application and database connectivity.

---

## 👨‍💻 Development Philosophy

This project focuses on building a practical, maintainable and scalable e-commerce solution using modern JavaScript technologies.

### Development Principles

- Component-based development.
- Reusable application architecture.
- API-first backend design.
- Secure authentication and authorization.
- Consistent database operations.
- Mobile-friendly responsive design.
- Maintainable code organization.
- Scalable cloud deployment.

---

## 📌 Project Status

**Current Stage:** MVP Development

The core storefront, customer authentication, product management, ordering workflow and admin functionality are included in the current implementation.

Some production integrations, including online payments, notifications and distributed rate limiting, remain planned enhancements.

---

## 📄 License

This project is developed for G Arasu Bakery. Add an appropriate license before distributing or reusing the source code publicly.
