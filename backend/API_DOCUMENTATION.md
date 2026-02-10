# Foodable API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [] // For validation errors
}
```

## Endpoints

### 1. Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- username: 3-50 characters, alphanumeric with underscores/hyphens
- email: Valid email format
- password: Min 8 chars, must contain uppercase, lowercase, and number

**Response (201):**
```json
{
  "success": true,
  "message": "Registration success: johndoe",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

**Note:** Token is also returned in the `Authorization` header as `Bearer <token>`

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_access_token"
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 2. Users

#### Get All Users
```http
GET /users?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User by Email
```http
GET /users/email?email=john@example.com
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "username": "newusername",
    "email": "newemail@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Delete Account
```http
DELETE /users/account
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 3. Donations

#### Create Donation
```http
POST /donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "item_name": "Canned Beans",
  "item_quantity": 5,
  "dietary_preference": "vegan",
  "expiry_date": "2024-12-31",
  "image_url": "https://example.com/image.jpg"
}
```

**Validation Rules:**
- item_name: 2-255 characters
- item_quantity: 1-1000
- dietary_preference: halal, non-halal, vegan, or vegetarian
- expiry_date: ISO 8601 format, cannot be in the past
- image_url: Valid URL (optional)

**Response (201):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "item_name": "Canned Beans",
    "item_quantity": 5,
    "dietary_preference": "vegan",
    "expiry_date": "2024-12-31",
    "image_url": "https://example.com/image.jpg",
    "status": "pending"
  }
}
```

#### Get All Donations
```http
GET /donations?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (pending, approved, claimed, expired)

**Response (200):**
```json
{
  "success": true,
  "message": "Donations retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "item_name": "Canned Beans",
      "item_quantity": 5,
      "dietary_preference": "vegan",
      "expiry_date": "2024-12-31",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get User's Donations
```http
GET /donations/my-donations?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User donations retrieved successfully",
  "data": [...],
  "pagination": {...}
}
```

#### Get Donation by ID
```http
GET /donations/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Donation retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "item_name": "Canned Beans",
    "item_quantity": 5,
    "dietary_preference": "vegan",
    "expiry_date": "2024-12-31",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Donation
```http
PUT /donations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "item_quantity": 10,
  "status": "approved"
}
```

**Note:** Only the donation owner can update their donations

**Response (200):**
```json
{
  "success": true,
  "message": "Donation updated successfully",
  "data": {...}
}
```

#### Delete Donation
```http
DELETE /donations/:id
Authorization: Bearer <token>
```

**Note:** Only the donation owner can delete their donations

**Response (200):**
```json
{
  "success": true,
  "message": "Donation deleted successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required/failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 422 | Validation Error - Invalid data format |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

### General API
- Window: 15 minutes
- Max Requests: 100 per window

### Authentication Endpoints
- Window: 15 minutes
- Max Requests: 5 per window
- Failed attempts only

## Testing with cURL

### Example: Complete Flow

1. **Register**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123"}'
```

2. **Login and Save Token**
```bash
TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}' \
  | jq -r '.data.token')
```

3. **Create Donation**
```bash
curl -X POST http://localhost:8080/api/v1/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"item_name":"Rice","item_quantity":10,"dietary_preference":"vegan","expiry_date":"2024-12-31"}'
```

4. **Get My Donations**
```bash
curl -X GET http://localhost:8080/api/v1/donations/my-donations \
  -H "Authorization: Bearer $TOKEN"
```

## Versioning

The API uses URL versioning. Current version: `v1`

Future versions will be accessible at `/api/v2`, etc.
