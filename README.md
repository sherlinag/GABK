
# Full-Stack E-Commerce Platform


The application provides a complete online shopping experience where customers can explore traditional sweets, snacks and bakery products, add items to their shopping bag, place orders and track their purchases.

It also includes a dedicated admin dashboard that allows bakery administrators to manage products, categories, inventory, customers and customer orders.

Built using **Next.js, JavaScript, Tailwind CSS, MongoDB Atlas and Mongoose**, the application follows a modular full-stack architecture with reusable REST APIs that can also support future Android and iOS applications.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Business Information](#-business-information)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Customer Website](#-customer-website)
- [Admin Dashboard](#-admin-dashboard)
- [Product Management](#-product-management)
- [Shopping Cart and Checkout](#-shopping-cart-and-checkout)
- [Order Management](#-order-management-and-tracking)
- [Authentication and Authorization](#-authentication-and-authorization)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Database Architecture](#-database-architecture)
- [API Architecture](#-api-architecture)
- [Mobile Application Integration](#-mobile-application-integration)
- [UI/UX Design](#-uiux-design)
- [Security and Data Integrity](#-security-and-data-integrity)
- [Performance and SEO](#-performance-and-seo)
- [Installation and Setup](#-installation-and-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Seeding](#-database-seeding)
- [Testing](#-testing-and-validation)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Project Roadmap](#-project-roadmap)
- [Development Guidelines](#-development-guidelines)
- [Project Limitations](#-project-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏪 Project Overview

G Arasu Bakery is a full-stack bakery shopping platform designed to bring a traditional local bakery business into the digital marketplace.

The platform provides two major application interfaces:

### 1. Customer Storefront

Customers can:

- Explore available bakery products.
- Browse sweets and snacks by category.
- Search for specific products.
- View product details and pricing.
- Add products to their shopping bag.
- Register and log in to their accounts.
- Place orders online.
- Select delivery or store pickup.
- View previous orders.
- Track order status.

### 2. Admin Management System

Administrators can:

- Access a protected admin dashboard.
- Manage bakery products.
- Create and organize categories.
- Update product prices and stock.
- Review customer orders.
- Update order statuses.
- Manage product availability.
- Monitor bakery operations.

The application uses a centralized MongoDB database and a shared REST API architecture to maintain consistent information across the customer website, admin dashboard and future mobile applications.

---

## 📍 Business Information

| Information | Details |
|---|---|
| Business Name | G Arasu Bakery |
| Business Category | Bakery, Sweets and Snacks |
| Address | 78PC+97P, Muttaicadu, Kumarapuram, Tamil Nadu 629164 |
| Contact Number | +91 63695 01625 |
| Opening Hours | Monday – Sunday |
| Operating Time | 8:00 AM – 10:00 PM |
| Primary Service | Bakery Products and Takeout |
| Target Market | Nagercoil and Nearby Locations |

---

## 🎯 Project Objectives

The primary objective is to develop a digital ordering platform that simplifies bakery operations and improves customer convenience.

### Business Objectives

- Establish an online presence for G Arasu Bakery.
- Make bakery products accessible through a website.
- Simplify product and inventory management.
- Reduce manual order management.
- Improve customer ordering convenience.
- Provide transparent order status updates.
- Support future business expansion.
- Create a foundation for mobile commerce.

### Technical Objectives

- Build a full-stack application using Next.js.
- Implement RESTful APIs for backend operations.
- Integrate MongoDB Atlas for cloud database management.
- Implement secure customer and admin authentication.
- Develop reusable and maintainable React components.
- Provide responsive user interfaces.
- Design APIs that support web and mobile clients.
- Maintain consistency during inventory and order operations.

---

## ✨ Key Features

### 🛍️ Customer Features

| Feature | Description |
|---|---|
| Responsive Homepage | Modern bakery landing page |
| Product Catalog | Browse all available products |
| Category Filtering | Filter sweets, snacks and bakery items |
| Product Search | Search products by name |
| Product Details | View descriptions and pricing |
| Shopping Bag | Add, remove and update products |
| Customer Registration | Create a customer account |
| Customer Login | Secure account authentication |
| Checkout | Submit bakery orders |
| Delivery Selection | Home delivery or store pickup |
| Order History | View previous purchases |
| Order Tracking | Follow order progress |
| Account Management | Access customer information |
| Contact Page | Find bakery contact information |

### ⚙️ Admin Features

| Feature | Description |
|---|---|
| Admin Login | Protected administrator authentication |
| Dashboard | Centralized bakery management |
| Product CRUD | Create, read, update and manage products |
| Category Management | Organize product categories |
| Order Management | Review customer orders |
| Order Status Updates | Manage order processing |
| Inventory Management | Monitor stock and availability |
| Customer Orders | View order information |
| Demo Product Handling | Manage sample product listings |

---

## 🖥️ Customer Website

The customer-facing website is designed to provide an attractive and easy-to-use bakery shopping experience.

### Homepage

The homepage introduces the bakery and highlights popular products and available offers.

Main sections:

- Announcement and promotional bar.
- Bakery branding and navigation.
- Hero banner with bakery photography.
- Featured product categories.
- Popular sweets and snacks.
- Best-selling bakery products.
- Special offers and promotions.
- Why Choose Us section.
- Customer testimonials.
- Store location and business hours.
- Contact information.
- Responsive footer.

### Product Listing

Customers can browse products through a structured product catalog.

Features:

- Category-based filtering.
- Product search.
- Featured product listings.
- Price sorting.
- Product availability indicators.
- Discount labels.
- Responsive product grid.
- Pagination or load more functionality.

### Product Details

Each product page provides relevant information to help customers make purchasing decisions.

Product information includes:

- Product name.
- Product description.
- Product images.
- Category.
- Price.
- Discount price.
- Stock availability.
- Quantity selection.
- Add to Cart functionality.
- Related products.

### Customer Account

Registered customers can access their personal accounts.

Account functionality includes:

- Customer profile.
- Login and logout.
- Registration.
- Order history.
- Individual order details.
- Order tracking.

---

## 🍬 Product Management

The platform supports different types of traditional Indian sweets, snacks and bakery products.

### Traditional Sweets

- Adhirasam
- Mysore Pak
- Coconut Burfi
- Milk Peda
- Ellu Urundai
- Nei Appam
- Laddu
- Jangiri
- Gulab Jamun

### Traditional Snacks

- Banana Chips
- Tapioca Chips
- Mixture
- Kai Murukku
- Thattai
- Ribbon Pakoda
- Masala Peanuts
- Kara Sev
- Thatta Payaru Snacks

### Bakery Products

- Egg Puffs
- Chicken Rolls
- Vegetable Puffs
- Bread
- Cakes
- Pastries
- Cupcakes
- Cookies
- Cream Buns
- Sandwiches

> Product listings and prices are sample data until verified by the bakery. Demo products are not available for purchase until an administrator updates their information and explicitly activates them.

---

## 🛒 Shopping Cart and Checkout

The shopping cart provides a convenient way for customers to manage their selected products.

### Shopping Cart Functionality

- Add products to the cart.
- Increase or decrease quantities.
- Remove individual products.
- View selected product details.
- Calculate subtotal.
- Display the order summary.
- Calculate applicable delivery fees.
- Calculate the final amount.

### Checkout Workflow

1. Customer reviews the shopping bag.
2. Customer proceeds to checkout.
3. Customer enters contact information.
4. Customer selects delivery or pickup.
5. Customer enters the delivery address when required.
6. Customer reviews the order summary.
7. Customer places the order.
8. Application validates product availability and prices.
9. Inventory is reserved through a database transaction.
10. Customer receives the generated order ID.

### Supported Fulfillment Methods

- Home Delivery.
- Store Pickup.

### Current Payment Support

- Cash on Delivery (COD).

Online payment integration is planned for a future release.

---

## 📦 Order Management and Tracking

Order management is an important part of the bakery application.

Every order contains customer details, purchased products, quantities, pricing information, fulfillment method and order status history.

### Order Processing Workflow

```text
          Customer Places Order
                   |
                   v
              Order Pending
                   |
                   v
             Order Confirmed
                   |
                   v
              Preparing
                   |
                   v
        +----------+----------+
        |                     |
        v                     v
   Ready for Pickup      Out for Delivery
        |                     |
        v                     v
   Order Collected       Order Delivered
        |                     |
        +----------+----------+
                   |
                   v
             Order Completed
```

### Order Statuses

| Status | Description |
|---|---|
| Pending | Order has been submitted |
| Confirmed | Admin has accepted the order |
| Preparing | Bakery is preparing the products |
| Ready for Pickup | Order is ready for collection |
| Out for Delivery | Order has been dispatched |
| Delivered | Customer has received the order |
| Cancelled | Order has been cancelled |

### Customer Order Tracking

Customers can:

- View their order ID.
- Check the current order status.
- View purchased products.
- View order totals.
- Review order history.
- Follow order status updates.

### Admin Order Processing

Administrators can:

- View all customer orders.
- Search orders by ID.
- Filter orders by status.
- Review customer information.
- View purchased products.
- Update order statuses.
- Cancel eligible orders.
- Review order history.

---

## 🔐 Authentication and Authorization

The application provides separate authentication workflows for customers and administrators.

### Customer Authentication

- Customer registration.
- Customer login.
- Password hashing.
- JWT access tokens.
- Protected customer APIs.
- Account information.
- Customer order authorization.

### Admin Authentication

- Separate admin login.
- Environment-configured initial administrator.
- Protected admin dashboard.
- Admin-only API authorization.
- Separate admin token storage.
- Protected product and order management.

### Authorization Strategy

The backend validates authentication and authorization before allowing protected operations.

Customers can only access their own account and order information.

Administrators can access authorized management operations.

---

## 🧰 Technology Stack

The application uses modern JavaScript technologies.

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React.js | Component-based UI development |
| JavaScript | Application development |
| Tailwind CSS | Responsive styling |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| Redux Toolkit | State management |
| Framer Motion | UI animations |
| Lucide React | Icons |
| React Hook Form | Form handling |
| Zod | Input validation |
| Recharts | Dashboard analytics (planned) |
| Vercel | Cloud deployment |

---

## 🏗️ Application Architecture

The application follows a modular architecture using Next.js App Router.

```text
                   G ARASU BAKERY
                          |
           +--------------+--------------+
           |                             |
     Customer Website              Admin Dashboard
           |                             |
           +--------------+--------------+
                          |
                   Next.js App Router
                          |
                   REST API Routes
                          |
              Authentication Middleware
                          |
                   Business Logic
                          |
                    Mongoose ODM
                          |
                    MongoDB Atlas
```

### Architectural Principles

- Single codebase for frontend and backend.
- Modular application structure.
- Reusable React components.
- Centralized database connectivity.
- REST API-based communication.
- Role-based access control.
- Server-side business logic.
- Database transaction support.
- Separation of customer and admin operations.

---

## 🗄️ Database Architecture

MongoDB Atlas is used as the primary cloud database.

Mongoose provides schema definitions, validation and database interaction.

### Main Collections

| Collection | Responsibility |
|---|---|
| Users | Customer and administrator accounts |
| Products | Bakery products and pricing |
| Categories | Product categorization |
| Orders | Customer order records |
| Addresses | Customer delivery addresses |
| Payments | Payment information for future integrations |
| Coupons | Future discount management |
| Inventory Transactions | Stock movement records |

### Product Data Structure

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

### Database Design Principles

- Schema-based data validation.
- Consistent document structures.
- Unique product slugs.
- Appropriate database indexes.
- Timestamp management.
- Inventory consistency.
- Transaction-based stock operations.
- Server-side price calculation.

---

## 🔌 API Architecture

The application provides RESTful APIs for customer and administrator operations.

### Public APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| GET | `/api/products` | List products |
| GET | `/api/products/:slug` | Product details |
| GET | `/api/categories` | List categories |

### Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Customer registration |
| POST | `/api/auth/login` | Customer login |
| GET | `/api/auth/me` | Current user details |

### Order APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders` | List customer orders |
| GET | `/api/orders/:id` | View order details |

### Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/products` | List admin products |
| POST | `/api/admin/products` | Create product |
| PATCH | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Soft-delete product |
| POST | `/api/admin/categories` | Create category |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/:id` | Update order |

### API Design Principles

- Consistent request and response formats.
- Proper HTTP status codes.
- Input validation.
- Server-side authorization.
- Centralized error handling.
- Database-backed product information.
- Secure order processing.

---

## 📱 Mobile Application Integration

The application backend is designed to support mobile application development.

Future Android and iOS applications can consume the same REST API endpoints without requiring a separate backend.

### Supported Mobile Operations

- Customer registration.
- Customer login.
- Product browsing.
- Category filtering.
- Product details.
- Order placement.
- Order history.
- Order tracking.

### Mobile Authentication

Protected endpoints accept JWT bearer access tokens.

```http
Authorization: Bearer <accessToken>
```

Mobile applications should store authentication tokens using operating-system secure storage.

---

## 🎨 UI/UX Design

The application follows a premium bakery-inspired visual identity.

### Design Theme

- Chocolate brown.
- Warm cream.
- Caramel orange.
- Soft beige.
- Subtle olive green.

### Typography

- Playfair Display – Headings.
- Poppins – Body text.
- Inter – UI elements.

### UI Components

- Responsive navigation.
- Hero banners.
- Product cards.
- Category cards.
- Search interfaces.
- Shopping cart.
- Checkout forms.
- Admin sidebar.
- Data tables.
- Dashboard statistics.
- Order status timelines.
- Loading skeletons.
- Empty states.

### Animation Strategy

- Smooth page transitions.
- Scroll-triggered animations.
- Product image hover effects.
- Animated buttons.
- Add-to-cart feedback.
- Responsive mobile navigation.
- Order progress animations.
- Lightweight loading effects.

The interface should remain accessible, fast and responsive across different screen sizes.

---

## 🔒 Security and Data Integrity

Security is implemented across authentication, authorization, APIs and database operations.

### Security Measures

- Password hashing using bcryptjs.
- JWT-based authentication.
- Separate customer and admin authentication.
- Protected admin endpoints.
- Server-side authorization.
- Customer-specific order access.
- Server-side product price calculation.
- Input validation.
- Environment-based secret management.
- Soft deletion of products.
- Database transaction support.

### Inventory Consistency

MongoDB transactions are used for stock reservations and eligible cancellations.

This helps prevent inconsistent inventory updates during order processing.

The deployment database must support replica sets or transactions.

---

## ⚡ Performance and SEO

The application is designed with performance and search visibility in mind.

### Performance

- Next.js App Router.
- Reusable React components.
- Optimized images.
- Responsive layouts.
- Efficient database queries.
- Server-side data operations.
- Loading and empty states.
- Lightweight animations.

### SEO

- Page-specific metadata.
- SEO-friendly product URLs.
- Semantic HTML.
- Open Graph metadata.
- Search engine indexing support.
- Sitemap and robots.txt.
- Local business structured data.

---

## 🚀 Installation and Setup

### Prerequisites

Install the following:

- Node.js 20.9 or newer.
- npm.
- Git.
- MongoDB Atlas account.
- Visual Studio Code or another code editor.

### Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### Navigate to Project

```bash
cd g-arasu-bakery
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env.local` in the project root.

Configure the MongoDB connection, authentication secret and admin credentials.

### Seed Admin Account

```bash
npm run seed:admin
```

### Seed Demo Products

```bash
npm run seed:demo-products
```

### Start Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

---

## 🧪 Testing and Validation

Test the following application workflows before production deployment.

### Customer Testing

- [ ] Homepage loading.
- [ ] Product listing.
- [ ] Category filtering.
- [ ] Product search.
- [ ] Product details.
- [ ] Customer registration.
- [ ] Customer login.
- [ ] Shopping bag operations.
- [ ] Checkout validation.
- [ ] Order creation.
- [ ] Order history.
- [ ] Order tracking.

### Admin Testing

- [ ] Admin authentication.
- [ ] Protected dashboard access.
- [ ] Product creation.
- [ ] Product updates.
- [ ] Product soft deletion.
- [ ] Category creation.
- [ ] Order listing.
- [ ] Order status updates.
- [ ] Inventory reservation.
- [ ] Inventory restoration.

### API Testing

- [ ] Health check.
- [ ] Authentication endpoints.
- [ ] Product endpoints.
- [ ] Category endpoints.
- [ ] Order endpoints.
- [ ] Admin endpoints.
- [ ] Invalid request handling.
- [ ] Unauthorized access handling.

---

## 🌐 Deployment

The recommended deployment architecture uses Vercel for the Next.js application and MongoDB Atlas for database hosting.

### Deployment Steps

1. Push the source code to GitHub.
2. Create a production MongoDB Atlas database.
3. Connect the GitHub repository to Vercel.
4. Configure environment variables.
5. Deploy the application.
6. Verify database connectivity.
7. Test customer authentication.
8. Test admin authentication.
9. Test order processing.
10. Configure the production domain.

### Production Checklist

- [ ] Production MongoDB connection.
- [ ] Strong authentication secrets.
- [ ] Secure admin credentials.
- [ ] Environment variables configured.
- [ ] HTTPS enabled.
- [ ] API authorization verified.
- [ ] Database backups configured.
- [ ] Rate limiting configured.
- [ ] Error logging configured.
- [ ] Mobile responsiveness verified.
- [ ] SEO metadata verified.

---

## 🚀 Future Enhancements

The following features can extend the platform beyond its current MVP functionality.

### E-Commerce Enhancements

- [ ] Razorpay payment integration.
- [ ] UPI payment support through a payment provider.
- [ ] Online payment verification.
- [ ] Discount coupons.
- [ ] Promotional offers.
- [ ] Wishlist functionality.
- [ ] Customer product reviews.
- [ ] Product ratings.
- [ ] Advanced product filtering.

### Bakery Operations

- [ ] Daily product availability management.
- [ ] Pre-order scheduling.
- [ ] Bulk order management.
- [ ] Custom cake ordering.
- [ ] Delivery area management.
- [ ] Delivery fee configuration.
- [ ] Low-stock notifications.
- [ ] Sales analytics.
- [ ] Daily sales reports.
- [ ] Monthly revenue reports.

### Customer Communication

- [ ] Email order confirmation.
- [ ] WhatsApp order notifications.
- [ ] Order status notifications.
- [ ] Password reset.
- [ ] Email verification.
- [ ] Promotional notifications.

### Mobile Application

- [ ] Android application.
- [ ] iOS application.
- [ ] Push notifications.
- [ ] Mobile-specific shopping experience.
- [ ] Secure mobile authentication.

---

## 📅 Project Roadmap

| Phase | Development Activity | Status |
|---|---|---|
| Phase 1 | Project initialization | Completed |
| Phase 2 | MongoDB integration | Implemented |
| Phase 3 | Customer storefront | Implemented |
| Phase 4 | Product and category APIs | Implemented |
| Phase 5 | Customer authentication | Implemented |
| Phase 6 | Shopping bag and checkout | Implemented |
| Phase 7 | Order management | Implemented |
| Phase 8 | Admin dashboard | Implemented |
| Phase 9 | Mobile API support | Implemented |
| Phase 10 | Online payment integration | Planned |
| Phase 11 | Email and WhatsApp notifications | Planned |
| Phase 12 | Production hardening | Pending |

*Update these statuses according to the actual implementation and testing results.*

---

## 💡 Development Guidelines

The project follows a clean and maintainable development approach.

### Coding Standards

- Use JavaScript instead of TypeScript.
- Follow consistent naming conventions.
- Build reusable React components.
- Keep API routes organized.
- Separate business logic from UI components.
- Use Mongoose models for database operations.
- Validate incoming API requests.
- Handle errors consistently.
- Avoid unnecessary code duplication.
- Keep sensitive information in environment variables.

### Git Workflow

Recommended branch structure:

```text
main
  |
  +--- feature/customer-storefront
  |
  +--- feature/admin-dashboard
  |
  +--- feature/product-management
  |
  +--- feature/order-tracking
  |
  +--- fix/api-validation
```

Use feature branches and pull requests for organized development.

---

## ⚠️ Current Project Limitations

The current implementation is an MVP and does not yet include every production integration.

The following features are not currently available:

- Razorpay online payments.
- Password reset.
- Email notifications.
- Cloud image uploads.
- Coupon management.
- Persistent distributed rate limiting.
- Token revocation.
- Advanced delivery management.
- Real-time WebSocket notifications.

The authentication rate limiter is process-local and is not sufficient for a distributed serverless production environment.

A shared rate-limit store and a suitable token revocation or refresh strategy should be implemented before production use.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your implementation.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

Example:

```bash
git checkout -b feature/new-feature

git add .

git commit -m "feat: add new feature"

git push origin feature/new-feature
```

---

## 👨‍💻 Author

**Sherlin A G**

Software Developer | Web & Mobile Application Development

Interested in building practical web applications, mobile solutions and AI-powered products using modern JavaScript technologies.

### Connect With Me

- Portfolio: https://sherlin-ag.vercel.app/
- GitHub: https://github.com/sherlinag
- LinkedIn: Add your LinkedIn profile URL.

---

## 📄 License

This project is developed for G Arasu Bakery.

Add an appropriate license before distributing or reusing the source code publicly.

---

<p align="center">
  <strong>G Arasu Bakery</strong>
  <br />
  Freshly Baked Happiness, Every Day! 🍰
  <br />
  Built with ❤️ using Next.js, JavaScript and MongoDB.
</p>
