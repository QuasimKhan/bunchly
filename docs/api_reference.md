# API Reference

Base URL: `http://localhost:5000/api`

## Authentication

### `POST /auth/register`
Create a new user account.
- **Body**: `{ name, email, password, username }`
- **Response**: `201 Created`

### `POST /auth/login`
Log in with credentials.
- **Body**: `{ email, password }`
- **Response**: `200 OK` (Set-Cookie header: `connect.sid`)

### `POST /auth/logout`
End the current session.

### `GET /auth/me`
Get current user context.
- **Headers**: `Cookie: connect.sid=...`
- **Response**: `{ user: { _id, name, email, ... } }`

---

## User & Profile

### `PUT /user/profile`
Update basic info.
- **Body**: `{ name, bio, image }`

### `PUT /user/appearance`
Update theme and customization settings.
- **Body**: 
```json
{
  "theme": "custom",
  "bgType": "color",
  "bgColor": "#ffffff",
  "buttonStyle": "fill"
}
```

### `GET /user/public/:username`
Get public profile data (Read-only).
- **Public access**.
- **Response**: `{ user: { username, bio, image, appearance }, links: [...] }`

---

## Links

### `GET /links`
Get all links for the current user.

### `POST /links`
Create a new link.
- **Body**: `{ title, url, type? }`

### `PUT /links/:id`
Update a link.
- **Body**: `{ title, url, isActive, order }`

### `DELETE /links/:id`
Delete a link.

---

## Analytics

### `GET /analytics/dashboard`
Get aggregated stats for the dashboard charts.
- **Query**: `?range=7d` (default)

### `POST /analytics/click`
Record a click on a link.
- **Body**: `{ linkId }`
- **Notes**: Usually called from the public profile page.

---

## Payments

### `POST /payment/create-order`
Initiate a Razorpay order.
- **Body**: `{ plan: "pro" }`
- **Response**: `{ orderId, amount, currency, key }`

### `POST /payment/verify`
Verify usage after payment.
- **Body**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
