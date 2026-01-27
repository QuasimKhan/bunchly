# Database Schema Reference

Bunchly uses **MongoDB** with **Mongoose** schema validation.

## User Model (`User.js`)

| Field | Type | Description |
|---|---|---|
| `username` | String (Unique) | The public handle. |
| `email` | String (Unique) | Login email. |
| `password` | String | Bcrypt hash (select: false). |
| `plan` | Enum | `'free'`, `'pro'`. |
| `subscription` | Object | Stores Razorpay `orderId`, `paymentId`, `status`. |
| `appearance` | Object | Customization (colors, gradients, images). |
| `flags` | Object | System flags (`isBanned`, `isStaff`). |

### Appearance Object
```javascript
appearance: {
    theme: String, // 'custom', 'minimal', etc.
    bgType: String, // 'color', 'gradient', 'image'
    bgColor: String,
    bgGradient: String,
    bgImage: String,
    buttonStyle: String, // 'fill', 'outline', 'soft'
    fontFamily: String
}
```

## Link Model (`Link.js`)

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Owner. |
| `title` | String | Button text. |
| `url` | String | Destination. |
| `type` | String | `'classic'`, `'header'`, `'music'`, `'video'`. |
| `isActive` | Boolean | Toggle visibility. |
| `clicks` | Number | Simple counter. |
| `order` | Number | Sort order. |

## LinkClick Model (`LinkClick.js`)

High-volume collection for detailed analytics.

| Field | Type | Description |
|---|---|---|
| `linkId` | ObjectId | Reference to Link. |
| `timestamp` | Date | Time of click. |
| `ip` | String | Anonymized IP. |
| `country` | String | GeoIP lookup result. |
| `city` | String | GeoIP lookup result. |
| `device` | String | 'Mobile', 'Desktop'. |
| `os` | String | 'iOS', 'Windows'. |
| `referrer` | String | Source URL (e.g., Instagram). |
