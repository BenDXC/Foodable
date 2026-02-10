# Foodable Backend API

A comprehensive Express.js backend API built with TypeScript, featuring robust error handling, JWT authentication, and security best practices.

## Features

### 🔒 Security
- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Protection against brute force attacks
- **Input Sanitization** - XSS prevention
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with configurable rounds

### 🚀 Performance
- **Connection Pooling** - Efficient database connections
- **Compression** - Response compression
- **Async/Await** - Modern asynchronous patterns
- **Error Handling** - Comprehensive error handling with custom error classes

### 📝 Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Structured Architecture** - Organized routes, controllers, middleware
- **Logging** - Winston logger with file rotation

### 🔧 Developer Experience
- **Hot Reload** - Nodemon for development
- **Environment Variables** - Dotenv configuration
- **Validation** - Express-validator for request validation
- **API Versioning** - Versioned endpoints

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts      # Database connection and pooling
│   └── index.ts         # Environment configuration
├── controllers/         # Route controllers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── donation.controller.ts
│   └── health.controller.ts
├── middleware/           # Express middleware
│   ├── auth.ts          # JWT authentication
│   ├── errorHandler.ts  # Error handling + async wrapper
│   ├── security.ts      # Helmet, CORS, rate limiting, XSS
│   ├── validation.ts    # Request validation (express-validator)
│   └── requestId.ts     # Request ID tracking
├── routes/              # API routes
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── donation.routes.ts
│   └── index.ts         # Route aggregator + health endpoints
├── types/               # TypeScript type definitions
│   ├── index.ts
│   └── express.d.ts
├── utils/               # Utility functions
│   ├── logger.ts        # Winston logger
│   ├── response.ts      # Response helpers
│   └── constants.ts     # Shared constants
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## Prerequisites

- Node.js >= 16.x
- MySQL >= 5.7
- npm or yarn

## Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - Database credentials
   - JWT secrets (use strong random strings in production)
   - CORS allowed origins
   - Other settings

4. **Set up the database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE foodable;
   ```
   
   Tables will be created automatically on first run.

## Usage

### Development Mode

```bash
npm run dev
```

The server will start with hot reload enabled at `http://localhost:8080`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/profile` | Get user profile | Yes |
| POST | `/api/v1/auth/change-password` | Change password | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users (paginated) | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| GET | `/api/v1/users/email?email=` | Get user by email | Yes |
| PUT | `/api/v1/users/profile` | Update profile | Yes |
| DELETE | `/api/v1/users/account` | Delete account | Yes |

### Donations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/donations` | Create donation | Yes |
| GET | `/api/v1/donations` | Get all donations (paginated) | Yes |
| GET | `/api/v1/donations/my-donations` | Get user's donations | Yes |
| GET | `/api/v1/donations/:id` | Get donation by ID | Yes |
| PUT | `/api/v1/donations/:id` | Update donation | Yes (owner) |
| DELETE | `/api/v1/donations/:id` | Delete donation | Yes (owner) |

## Request/Response Examples

### Register User

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
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

### Login

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

### Create Donation

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "item_name": "Canned Beans",
    "item_quantity": 5,
    "dietary_preference": "vegan",
    "expiry_date": "2024-12-31"
  }'
```

**Response:**
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
    "status": "pending"
  }
}
```

## Error Handling

The API uses a comprehensive error handling system with custom error classes:

- `BadRequestError` (400) - Invalid request data
- `UnauthorizedError` (401) - Authentication required/failed
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflict (e.g., duplicate email)
- `ValidationError` (422) - Validation failed
- `InternalServerError` (500) - Server error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "errors": [] // For validation errors
}
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **JWT Secrets**: Use strong, random strings in production
3. **Database Passwords**: Use strong passwords
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Configure appropriate limits for your use case
6. **Input Validation**: All inputs are validated and sanitized
7. **SQL Injection**: Using parameterized queries
8. **XSS Prevention**: Input sanitization and security headers

## Database Schema

### donator (users)
- `id` - INT (Primary Key)
- `username` - VARCHAR(255)
- `email` - VARCHAR(255) (Unique)
- `password` - VARCHAR(255) (Hashed)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### donations
- `id` - INT (Primary Key)
- `user_id` - INT (Foreign Key)
- `item_name` - VARCHAR(255)
- `item_quantity` - INT
- `dietary_preference` - ENUM
- `expiry_date` - DATE
- `image_url` - VARCHAR(500)
- `status` - ENUM
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### refresh_tokens
- `id` - INT (Primary Key)
- `user_id` - INT (Foreign Key)
- `token` - VARCHAR(500)
- `expires_at` - TIMESTAMP
- `created_at` - TIMESTAMP

## Logging

Logs are stored in the `logs/` directory:
- `app.log` - All logs
- `error.log` - Error logs only

Log levels: error, warn, info, http, debug

## Environment Variables

See `.env.example` for all available configuration options.

## Contributing

1. Create a new branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
