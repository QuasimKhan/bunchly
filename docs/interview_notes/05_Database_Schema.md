# Bunchly - Database Schema Reference

## User Collection (`users`)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique ID. |
| `username` | String | Unique handle (e.g., "api"). Indexed for text search. |
| `email` | String | Unique email. Indexed. |
| `password` | String | Bcrypt hash. |
| `plan` | String | 'free' or 'pro'. Default: 'free'. |
| `appearance` | Object | Customization settings. |
| `appearance.bgType` | String | 'color', 'gradient', 'image'. |
| `subscription` | Object | Razorpay payment details. |
| `subscription.status` | String | 'active', 'expired'. |
| `flags` | Object | Admin flags (`isBanned`, `isStaff`). |
| `usage` | Object | Stats: `totalLinks`, `totalClicks`. |

## Link Collection (`links`)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to `users`. |
| `type` | String | 'classic' (button), 'header', 'music', 'video'. |
| `title` | String | Display text. |
| `url` | String | Destination URL. |
| `thumbnail` | String | Optional icon/image. |
| `isActive` | Boolean | Visibility toggle. |
| `order` | Number | Integer for sorting (Drag & Drop). |
| `clicks` | Number | Simple counter. |

## LinkClick Collection (`linkclicks`)

Used for granular analytics. High write volume.

| Field | Type | Description |
|-------|------|-------------|
| `linkId` | ObjectId | Reference to `links`. |
| `userId` | ObjectId | Reference to `users` (owner of the link). |
| `device` | String | 'Mobile', 'Desktop' (parsed from UserAgent). |
| `browser` | String | 'Chrome', 'Safari'. |
| `os` | String | 'iOS', 'Android', 'Windows'. |
| `country` | String | 'United States', 'India'. |
| `city` | String | 'New York', 'Mumbai'. |
| `referrer` | String | Where they came from (e.g., 'instagram.com'). |
| `timestamp` | Date | When the click happened. |

## Payment Collection (`payments`)

Transaction log.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Who paid. |
| `orderId` | String | Razorpay Order ID. |
| `paymentId` | String | Razorpay Payment ID. |
| `amount` | Number | Amount in currency subunits (e.g., paise). |
| `currency` | String | 'INR', 'USD'. |
| `status` | String | 'captured', 'failed'. |

## Report Collection (`reports`)

Trust & Safety.

| Field | Type | Description |
|-------|------|-------------|
| `reporterEmail` | String | Who is reporting. |
| `reportedUser` | ObjectId | Who is being reported. |
| `reason` | String | 'spam', 'scam', 'inappropriate'. |
| `status` | String | 'pending', 'resolved'. |
