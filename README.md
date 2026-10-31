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

Visit `/` for the responsive bakery website. It reads the live menu and categories from the same API routes used by mobile clients. Customers can search and filter the catalog, keep a local shopping bag, register or sign in, place COD orders for delivery or pickup, and view their order history. Product listings are empty until the admin adds products; no example pricing or inventory is presented as real store data.

The website's mobile layout is responsive; native apps can call the same `/api/*` endpoints on the deployed host. Browser checkout stores its short-lived bearer token in session storage. Native applications should use OS-provided secure token storage.

## Sample Nagercoil sweets and snacks

Run `npm run seed:demo-products` to add sample listings such as banana chips, tapioca chips, mixture, kai murukku, thattai, ribbon pakoda, adhirasam, Mysore pak, coconut burfi, ellu urundai, nei appam, and milk peda. The seed can be rerun safely.

These are clearly marked `isDemo: true`, include illustrative prices and inventory only, display “Ask for today's price” in the storefront, and cannot be purchased. Confirm actual products, prices, and stock with the bakery before publishing them. An admin must update a demo product with verified `pricePaise` and `stock` and explicitly set `isDemo: false` in the same `PATCH /api/admin/products/:id` request before it becomes orderable.

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
