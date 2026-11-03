**A full-stack e-commerce platform for traditional sweets, snacks, and bakery products.**

G Arasu Bakery is a digital shopping platform that helps customers browse bakery products, manage a shopping cart, place orders, and track purchases. It also provides an admin dashboard for managing products, categories, inventory, and customer orders.

Built with **Next.js, JavaScript, Tailwind CSS, MongoDB Atlas, and Mongoose**, the application uses a modular architecture and REST APIs that can also support future Android and iOS applications.

---

## Table of Contents

- [Overview](#overview)
- [Business Information](#business-information)
- [Features](#features)
- [Product Categories](#product-categories)
- [Order Workflow](#order-workflow)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Database Design](#database-design)
- [API Overview](#api-overview)
- [Security](#security)
- [Performance and SEO](#performance-and-seo)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Overview

The platform has two main interfaces:

### Customer Storefront

Customers can:

- Browse sweets, snacks, and bakery products.
- Search and filter products by category.
- View product descriptions, images, and prices.
- Add products to a shopping cart and update quantities.
- Register, log in, and manage account information.
- Choose home delivery or store pickup.
- Place orders and view order history.
- Track order status.

### Admin Dashboard

Authorized administrators can:

- Access a protected dashboard.
- Create, update, and manage products.
- Organize products into categories.
- Update prices, stock, and product availability.
- View and manage customer orders.
- Update order statuses.
- Review customer and order information.

Both interfaces use a shared backend and MongoDB database to keep product, inventory, and order information consistent.

## Business Information

| Detail | Information |
|---|---|
| Business | G Arasu Bakery |
| Category | Bakery, sweets, and snacks |
| Address | 78PC+97P, Muttaicadu, Kumarapuram, Tamil Nadu 629164 |
| Contact | +91 63695 01625 |
| Business days | Monday–Sunday |
| Opening hours | 8:00 AM–10:00 PM |
| Services | Bakery products and takeout |
| Target area | Nagercoil and nearby locations |

## Features

### Customer Website

| Feature | Description |
|---|---|
| Homepage | Bakery introduction, featured products, offers, and contact details |
| Product catalogue | Browse available bakery products |
| Search and filtering | Find products by name or category |
| Product details | View product images, descriptions, and pricing |
| Shopping cart | Add, remove, and update product quantities |
| Customer accounts | Registration, login, and account access |
| Checkout | Submit an order with contact and fulfilment details |
| Fulfilment | Choose home delivery or store pickup |
| Order history | Review previous purchases |
| Order tracking | Check the current order status |
| Contact page | View bakery contact and location information |

### Admin Dashboard

| Feature | Description |
|---|---|
| Admin authentication | Restricted administrator access |
| Dashboard | Central place to manage bakery operations |
| Product management | Create, view, update, and soft-delete products |
| Category management | Create and organize product categories |
| Inventory management | Update stock and product availability |
| Order management | View, search, and filter customer orders |
| Order status updates | Update the progress of an order |

## Product Categories

The catalogue is designed for traditional Indian sweets, snacks, and bakery items.

**Traditional sweets**
- Adhirasam
- Mysore Pak
- Coconut Burfi
- Milk Peda
- Ellu Urundai
- Nei Appam
- Laddu
- Jangiri
- Gulab Jamun

**Traditional snacks**
- Banana Chips
- Tapioca Chips
- Mixture
- Kai Murukku
- Thattai
- Ribbon Pakoda
- Masala Peanuts
- Kara Sev
- Thatta Payaru Snacks

**Bakery products**
- Egg Puffs
- Chicken Rolls
- Vegetable Puffs
- Bread
- Cakes and pastries
- Cupcakes
- Cookies
- Cream Buns
- Sandwiches

> **Note:** Product names and prices must be verified by the bakery before they are published. Demo products remain unavailable for purchase until an administrator updates and activates them.

## Shopping Cart and Checkout

Customers can add products to their cart, change quantities, remove items, and review the order subtotal and applicable delivery charges.

### Checkout process

1. Review the shopping cart.
2. Enter customer contact information.
3. Select home delivery or store pickup.
4. Enter a delivery address when required.
5. Review the order summary.
6. Submit the order.
7. The server validates product availability and current prices.
8. Stock is reserved as part of the order operation.
9. The application generates an order ID.

**Current payment method:** Cash on Delivery (COD).  
**Planned:** Online payment integration.

## Order Workflow

Orders move through the following stages, depending on the fulfilment method:

```text
Customer places order
        |
        v
     Pending
        |
        v
    Confirmed
        |
        v
    Preparing
        |
        +----------------------+
        |                      |
        v                      v
 Ready for pickup        Out for delivery
        |                      |
        v                      v
 Order collected          Delivered
        |                      |
        +----------+-----------+
                   |
                   v
              Completed
```

| Status | Meaning |
|---|---|
| Pending | The order has been submitted |
| Confirmed | The administrator has accepted the order |
| Preparing | The bakery is preparing the products |
| Ready for Pickup | The order is ready for collection |
| Out for Delivery | The order has been dispatched |
| Delivered | The customer has received the order |
| Cancelled | The order has been cancelled |

Customers can view their order ID, purchased products, totals, order history, and current status. Administrators can review orders, search by order ID, filter by status, and update eligible orders.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Full-stack React framework |
| React.js | User interface components |
| JavaScript | Application language |
| Tailwind CSS | Responsive styling |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modelling |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| Redux Toolkit | Client-side state management |
| Framer Motion | UI animations |
| Lucide React | Icons |
| React Hook Form | Form handling |
| Zod | Input validation |
| Vercel | Application deployment |

> Recharts-based dashboard analytics are listed as a planned capability in the project specification, not as a confirmed implemented feature.

## Application Architecture

The project uses a single Next.js codebase for the customer storefront, admin dashboard, and backend API routes.

```text
                 G ARASU BAKERY
                        |
          +-------------+-------------+
          |                           |
    Customer Website            Admin Dashboard
          |                           |
          +-------------+-------------+
                        |
                 Next.js App Router
                        |
                   REST APIs
                        |
            Authentication / Authorization
                        |
                 Business Logic
                        |
                  Mongoose ODM
                        |
                  MongoDB Atlas
```

### Architecture principles

- Keep customer and admin operations separated.
- Organize API routes by feature.
- Reuse UI components and shared utilities.
- Centralize database connectivity.
- Validate requests on the server.
- Perform sensitive business operations on the server.
- Use database transactions for stock-related operations.

## Database Design

MongoDB Atlas is the primary database. Mongoose is used for schema definitions, validation, and database access.

### Main collections

| Collection | Purpose |
|---|---|
| Users | Customer and administrator accounts |
| Products | Product details, prices, and availability |
| Categories | Product categories |
| Orders | Customer order records |
| Addresses | Customer delivery addresses |
| Payments | Payment records for future integrations |
| Coupons | Future discount functionality |
| Inventory Transactions | Stock movement records |

### Example product document

```javascript
{
  name: "Banana Chips",
  slug: "banana-chips",
  description: "Traditional crispy banana chips",
  category: "Traditional Snacks",
  pricePaise: null,
  stock: null,
  images: [],
  isFeatured: false,
  isAvailable: false,
  isDemo: true,
  createdAt: new Date()
}
```

The example uses placeholder values. Replace them with validated product data before making a product available for purchase.

### Database considerations

- Validate data using Mongoose schemas.
- Use unique slugs for product URLs.
- Add indexes for frequently queried fields.
- Store timestamps for relevant records.
- Calculate prices on the server.
- Keep inventory changes consistent.
- Use transactions for stock reservation and restoration where supported.

## API Overview

The application exposes REST API routes for the customer website and admin dashboard.

### Public routes

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check API and database health |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/:slug` | Get product details |
| `GET` | `/api/categories` | List categories |

### Authentication routes

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a customer |
| `POST` | `/api/auth/login` | Authenticate a customer |
| `GET` | `/api/auth/me` | Get the authenticated user |

### Order routes

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders` | List the authenticated customer's orders |
| `GET` | `/api/orders/:id` | Get order details |

### Admin routes

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/products` | List products in the admin area |
| `POST` | `/api/admin/products` | Create a product |
| `PATCH` | `/api/admin/products/:id` | Update a product |
| `DELETE` | `/api/admin/products/:id` | Soft-delete a product |
| `POST` | `/api/admin/categories` | Create a category |
| `GET` | `/api/admin/orders` | List customer orders |
| `PATCH` | `/api/admin/orders/:id` | Update an order |

All protected routes should validate the caller's identity and permissions on the server. Customers should only be able to access their own account and order information.

## Mobile Application Support

The REST API is designed so that future Android and iOS applications can use the same backend.

Potential mobile capabilities include customer registration and login, product browsing, category filtering, checkout, order history, and order tracking.

Protected API requests use bearer-token authentication:

```http
Authorization: Bearer <accessToken>
```

Mobile clients should store tokens using platform-provided secure storage. Mobile applications are a future extension; their availability should not be implied until they are developed and released.

## Security

The project specification includes the following security practices:

- Hash passwords with bcryptjs.
- Authenticate protected requests using JWT.
- Enforce administrator permissions on admin APIs.
- Restrict customers to their own account and orders.
- Validate incoming request data.
- Calculate product prices on the server.
- Keep secrets and credentials in environment variables.
- Soft-delete products where appropriate.
- Use database transactions for stock operations.

MongoDB transactions require a deployment that supports replica sets or transactions.

## Performance and SEO

### Performance considerations

- Use Next.js App Router features appropriately.
- Optimize product and banner images.
- Keep layouts responsive.
- Avoid unnecessary client-side JavaScript.
- Use efficient database queries and indexes.
- Provide loading and empty states.
- Keep animations lightweight.

### SEO considerations

- Add page-specific metadata.
- Use readable product URLs.
- Use semantic HTML.
- Configure Open Graph metadata.
- Provide a sitemap and `robots.txt`.
- Add relevant local-business structured data.

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm
- Git
- MongoDB Atlas account
- Visual Studio Code or another code editor

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Open the project directory

```bash
cd g-arasu-bakery
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root and add the configuration required by the application. See [Environment Configuration](#environment-configuration).

### 5. Seed the administrator account

```bash
npm run seed:admin
```

### 6. Seed demo products

```bash
npm run seed:demo-products
```

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Admin login page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

> The seed commands above must exist in `package.json`. If your local scripts use different names, update these commands to match the repository.

## Environment Configuration

Create `.env.local` in the project root. Add the environment variable names expected by your application, such as:

```env
MONGODB_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Use the exact variable names referenced by your source code and seed scripts. Do not commit `.env.local`, database credentials, JWT secrets, or administrator passwords to Git.

## Testing

Run through these checks before releasing a change.

### Customer workflows

- [ ] Homepage and navigation
- [ ] Product listing and details
- [ ] Search and category filtering
- [ ] Customer registration and login
- [ ] Cart quantity updates and item removal
- [ ] Checkout validation
- [ ] Order creation
- [ ] Order history and tracking

### Admin workflows

- [ ] Admin login and protected dashboard
- [ ] Product creation and updates
- [ ] Product soft deletion
- [ ] Category creation
- [ ] Order listing and filtering
- [ ] Order status updates
- [ ] Inventory reservation and restoration

### API and security checks

- [ ] Health endpoint
- [ ] Valid and invalid authentication
- [ ] Product and category endpoints
- [ ] Order endpoints
- [ ] Admin-only endpoint authorization
- [ ] Invalid request handling
- [ ] Customer access restricted to their own orders

## Deployment

The documented deployment approach uses **Vercel** for the Next.js application and **MongoDB Atlas** for the database.

1. Push the project to GitHub.
2. Create or select a production MongoDB Atlas database.
3. Import the repository into Vercel.
4. Configure production environment variables.
5. Deploy the application.
6. Verify database connectivity.
7. Test customer and administrator authentication.
8. Test product, inventory, and order workflows.
9. Configure the production domain.
10. Verify the production site on desktop and mobile.

### Production checklist

- [ ] Production database configured
- [ ] Strong secrets and administrator credentials configured
- [ ] Environment variables checked
- [ ] HTTPS enabled
- [ ] Protected API routes verified
- [ ] Database backups configured
- [ ] Shared rate limiting configured
- [ ] Error logging configured
- [ ] Mobile responsiveness checked
- [ ] SEO metadata checked
- [ ] Order and inventory workflows tested

## Roadmap

The following status summary is based on the project notes and should be updated to match the actual code and test results.

| Area | Status in project notes |
|---|---|
| Project initialization | Completed |
| MongoDB integration | Implemented |
| Customer storefront | Implemented |
| Product and category APIs | Implemented |
| Customer authentication | Implemented |
| Shopping cart and checkout | Implemented |
| Order management | Implemented |
| Admin dashboard | Implemented |
| Mobile API support | Implemented |
| Online payment integration | Planned |
| Email and WhatsApp notifications | Planned |
| Production hardening | Pending |

### Potential future enhancements

**E-commerce**
- Online payments through a provider such as Razorpay
- UPI support through a payment provider
- Coupons and promotional offers
- Wishlist, ratings, and product reviews
- Advanced product filtering

**Bakery operations**
- Daily product availability
- Pre-order scheduling
- Bulk orders and custom cake requests
- Delivery-area and delivery-fee management
- Low-stock alerts
- Sales and revenue reports

**Customer communication**
- Email order confirmations
- WhatsApp order notifications
- Order status notifications
- Password reset and email verification

**Mobile**
- Android and iOS applications
- Push notifications
- Mobile-specific shopping experience
- Secure mobile authentication

## Known Limitations

The project is described as an MVP. The following capabilities are not currently available according to the project notes:

- Online payment integration
- Password reset
- Email notifications
- Cloud image uploads
- Coupon management
- Distributed rate limiting
- Token revocation
- Advanced delivery management
- Real-time WebSocket notifications

The current authentication rate limiter is process-local. That is not sufficient for a distributed serverless deployment. Before production use, implement a shared rate-limit store and review the token refresh and revocation strategy.

## Development Guidelines

- Use JavaScript; TypeScript is not part of this project.
- Follow consistent naming conventions.
- Build reusable React components.
- Keep API routes organized by feature.
- Separate business logic from UI components.
- Use Mongoose models for database operations.
- Validate incoming API requests.
- Handle errors consistently.
- Avoid unnecessary code duplication.
- Keep secrets in environment variables.

### Suggested Git workflow

```text
main
 ├── feature/customer-storefront
 ├── feature/admin-dashboard
 ├── feature/product-management
 ├── feature/order-tracking
 └── fix/api-validation
```

Use feature branches and pull requests to keep changes organized.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Commit and push your changes.
6. Open a pull request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## Author

**Sherlin A G**  
Software Developer | Web & Mobile Application Development

- **Portfolio:** https://sherlin-ag.vercel.app/
- **GitHub:** https://github.com/sherlinag
- **LinkedIn:** Add your LinkedIn profile URL.

## License

This project is developed for G Arasu Bakery. Add an appropriate open-source license before distributing or reusing the source code publicly.

---

<p align="center">
  <strong>G Arasu Bakery</strong><br>
  Freshly Baked Happiness, Every Day! 🍰<br>
  Built with ❤️ using Next.js, JavaScript, and MongoDB.
</p>
