# African Healthpreneurship Hub Backend

This is the backend API for the African Healthpreneurship Hub (AHH) web portal, built with FastAPI and PostgreSQL.

## Overview

The backend provides authentication services for users including entrepreneurs, mentors, investors, and admins. It handles user registration, login, and JWT-based authentication.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **ASGI Server**: Uvicorn
- **Validation**: Pydantic

## Prerequisites

- Python 3.8+
- PostgreSQL database
- Virtual environment (recommended)

## Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd ahh_web/backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the `backend/` directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ahh_db
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION=3600
   ```

5. **Create the database**:
   - Create a PostgreSQL database named `ahh_db`
   - The application will automatically create tables on startup

6. **Run the application**:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

When you visit `http://localhost:8000`, you'll see a welcome message with links to the API documentation.

## API Documentation

### Endpoints

#### Authentication

- **POST /auth/signup**
  - Register a new user
  - Request body: `UserCreate` schema
  - Response: `UserResponse` schema

- **POST /auth/login**
  - Login with email and password
  - Request body: `UserLogin` schema
  - Response: JWT access token and user data

### Data Models

#### UserCreate
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "entrepreneur|mentor|investor|admin"
}
```

#### UserLogin
```json
{
  "email": "string",
  "password": "string"
}
```

#### UserResponse
```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "role": "string"
}
```

## Testing with Swagger UI

FastAPI provides automatic interactive API documentation:

1. Start the server as described above
2. Open your browser and go to `http://localhost:8000/docs`
3. You'll see the Swagger UI with all endpoints
4. Click on an endpoint to expand it
5. Click "Try it out" to test the endpoint
6. Fill in the request data and click "Execute"

### Example: Testing Signup

1. Go to `http://localhost:8000/docs`
2. Find the `/auth/signup` endpoint under "auth" tag
3. Click "Try it out"
4. In the request body, enter:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securepassword",
     "role": "entrepreneur"
   }
   ```
5. Click "Execute"
6. Check the response

### Example: Testing Login

1. Use the same Swagger UI
2. Find `/auth/login`
3. Try it out with:
   ```json
   {
     "email": "john@example.com",
     "password": "securepassword"
   }
   ```
4. Execute and note the returned JWT token

## Database Schema

The application uses a single `users` table with the following structure:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_users_email ON users (email);
```

## Development

- The app uses auto-reload during development (`--reload` flag)
- Database tables are created automatically on startup
- Environment variables are loaded from `.env` file
- JWT tokens expire after 1 hour by default

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Email uniqueness is enforced
- CORS is not configured (add if needed for frontend integration)

## Contributing

1. Follow the setup instructions above
2. Make changes to the code
3. Test using Swagger UI
4. Ensure all endpoints work as expected