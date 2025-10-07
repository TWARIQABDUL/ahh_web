# African Healthpreneurship Hub Backend API

This is the comprehensive backend API for the African Healthpreneurship Hub (AHH) web portal, built with FastAPI and PostgreSQL. The API provides complete CRUD operations for users, ventures, resources, applications, milestones, mentor matching, messaging functionality, program management, and administrative features.

## 🚀 Quick Start

### Prerequisites
- Python 3.12
- PostgreSQL database
- Virtual environment (recommended)

### Installation & Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file with:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION=3600
   ```

5. **Start the server**:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

6. **Access API**:
   - **API Base**: `http://localhost:8001`
   - **Interactive Docs**: `http://localhost:8001/docs`
   - **Alternative Docs**: `http://localhost:8001/redoc`

## 📋 API Endpoints Overview

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | User login with JWT | ❌ |

### 👥 User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | ✅ |
| PUT | `/users/me` | Update current user profile | ✅ |
| GET | `/users/{user_id}` | Get user by ID | ✅ |
| GET | `/users/` | Get all users (admin) | ✅ |

### 🚀 Venture Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ventures/` | Create new venture | ✅ |
| GET | `/ventures/` | Get user's ventures | ✅ |
| GET | `/ventures/{venture_id}` | Get specific venture | ✅ |
| PUT | `/ventures/{venture_id}` | Update venture | ✅ |
| DELETE | `/ventures/{venture_id}` | Delete venture | ✅ |

### 📋 Milestone Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/milestones/` | Create milestone | ✅ |
| GET | `/milestones/venture/{venture_id}` | Get venture milestones | ✅ |
| GET | `/milestones/{milestone_id}` | Get specific milestone | ✅ |
| PUT | `/milestones/{milestone_id}` | Update milestone | ✅ |
| DELETE | `/milestones/{milestone_id}` | Delete milestone | ✅ |

### 📚 Resource Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/resources/categories/` | Create resource category | ✅ |
| GET | `/resources/categories/` | Get all categories | ❌ |
| POST | `/resources/` | Create resource | ✅ |
| GET | `/resources/` | Get all resources | ❌ |
| GET | `/resources/{resource_id}` | Get specific resource | ❌ |
| PUT | `/resources/{resource_id}` | Update resource | ✅ |
| DELETE | `/resources/{resource_id}` | Delete resource | ✅ |

### 📝 Application Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/applications/` | Submit application | ✅ |
| GET | `/applications/` | Get user's applications | ✅ |
| GET | `/applications/{application_id}` | Get specific application | ✅ |
| PUT | `/applications/{application_id}` | Update application status | ✅ |

### 🤝 Mentor Matching

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/mentor-matches/` | Create mentor match | ✅ |
| GET | `/mentor-matches/` | Get user's matches | ✅ |
| GET | `/mentor-matches/{match_id}` | Get specific match | ✅ |
| PUT | `/mentor-matches/{match_id}` | Update match status | ✅ |
| DELETE | `/mentor-matches/{match_id}` | Delete match | ✅ |

### 💬 Messaging

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/messages/` | Send message | ✅ |
| GET | `/messages/` | Get user's messages | ✅ |
| GET | `/messages/conversation/{other_user_id}` | Get conversation | ✅ |
| GET | `/messages/{message_id}` | Get specific message | ✅ |
| PUT | `/messages/{message_id}` | Mark message as read | ✅ |
| DELETE | `/messages/{message_id}` | Delete message | ✅ |

### 🎓 Program Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/programs/` | Create new program (Admin only) | ✅ (Admin) |
| GET | `/programs/` | Get all active programs | ❌ |
| GET | `/programs/{program_id}` | Get specific program | ❌ |
| PUT | `/programs/{program_id}` | Update program (Admin only) | ✅ (Admin) |
| DELETE | `/programs/{program_id}` | Delete program (Admin only) | ✅ (Admin) |

### 🛠️ Admin Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard/metrics` | Get platform metrics | ✅ (Admin) |
| GET | `/admin/users` | Get all users | ✅ (Admin) |
| PUT | `/admin/users/{user_id}` | Update any user | ✅ (Admin) |
| DELETE | `/admin/users/{user_id}` | Deactivate user | ✅ (Admin) |
| GET | `/admin/applications` | Get all applications | ✅ (Admin) |
| PUT | `/admin/applications/{application_id}/review` | Review application | ✅ (Admin) |

## 📝 Detailed API Documentation

### 🔐 Authentication

#### POST `/auth/signup` - User Registration
**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "Member",
  "profile_details": "Experienced healthcare entrepreneur"
}
```

**Available Roles:**
- `"Admin"` - System administrator
- `"Mentor"` - Experienced healthcare professional
- `"Member"` - Healthcare entrepreneur/startup founder

**Response (201):**
```json
{
  "user_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Member",
  "profile_details": "Experienced healthcare entrepreneur",
  "created_at": "2025-09-22T13:45:51.471884"
}
```

#### POST `/auth/login` - User Login
**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "Member",
    "profile_details": "Experienced healthcare entrepreneur",
    "created_at": "2025-09-22T13:45:51.471884"
  }
}
```

### 👥 User Management

#### GET `/users/me` - Get Current User Profile
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "user_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Member",
  "profile_details": "Experienced healthcare entrepreneur",
  "created_at": "2025-09-22T13:45:51.471884"
}
```

#### PUT `/users/me` - Update Current User Profile
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "first_name": "Johnny",
  "profile_details": "Updated profile information"
}
```

### 🚀 Venture Management

#### POST `/ventures/` - Create Venture
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "venture_name": "HealthTech Startup",
  "description": "A telemedicine platform for rural areas"
}
```

**Response (201):**
```json
{
  "venture_id": 1,
  "member_id": 1,
  "venture_name": "HealthTech Startup",
  "description": "A telemedicine platform for rural areas",
  "created_at": "2025-09-22T13:48:31.200496",
  "member": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "Member",
    "profile_details": null,
    "created_at": "2025-09-22T13:45:51.471884"
  }
}
```

#### GET `/ventures/` - Get User's Ventures
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "venture_id": 1,
    "member_id": 1,
    "venture_name": "HealthTech Startup",
    "description": "A telemedicine platform for rural areas",
    "created_at": "2025-09-22T13:48:31.200496"
  }
]
```

### 📋 Milestone Management

#### POST `/milestones/` - Create Milestone
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "venture_id": 1,
  "title": "Complete MVP",
  "description": "Develop and test the minimum viable product",
  "due_date": "2024-12-31"
}
```

**Response (201):**
```json
{
  "milestone_id": 1,
  "venture_id": 1,
  "title": "Complete MVP",
  "description": "Develop and test the minimum viable product",
  "status": "not_started",
  "due_date": "2024-12-31"
}
```

### 📚 Resource Management

#### POST `/resources/categories/` - Create Resource Category
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "category_name": "Funding Resources"
}
```

**Response (201):**
```json
{
  "category_id": 1,
  "category_name": "Funding Resources"
}
```

#### POST `/resources/` - Create Resource
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "category_id": 1,
  "title": "Startup Funding Guide",
  "description": "Comprehensive guide to funding options for healthcare startups",
  "url": "https://example.com/funding-guide"
}
```

**Response (201):**
```json
{
  "resource_id": 1,
  "category_id": 1,
  "uploaded_by_id": 1,
  "title": "Startup Funding Guide",
  "description": "Comprehensive guide to funding options for healthcare startups",
  "url": "https://example.com/funding-guide",
  "created_at": "2025-09-22T13:49:38.507430"
}
```

### 📝 Application Management

#### POST `/applications/` - Submit Application
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "venture_id": 1
}
```

**Response (201):**
```json
{
  "application_id": 1,
  "venture_id": 1,
  "status": "submitted",
  "submission_date": "2025-09-22T13:51:30.394698"
}
```

### 🤝 Mentor Matching

#### POST `/mentor-matches/` - Create Mentor Match
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "mentor_id": 2,
  "member_id": 1
}
```

**Response (201):**
```json
{
  "match_id": 1,
  "mentor_id": 2,
  "member_id": 1,
  "status": "pending",
  "created_at": "2025-09-22T13:50:38.917402"
}
```

### 💬 Messaging

#### POST `/messages/` - Send Message
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "receiver_id": 2,
  "content": "Hi Jane, I would like to discuss my HealthTech Startup venture with you."
}
```

**Response (201):**
```json
{
  "message_id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Hi Jane, I would like to discuss my HealthTech Startup venture with you.",
  "sent_at": "2025-09-22T13:51:04.942713",
  "is_read": false
}
```

## 🧪 Testing Guide

### Using cURL

1. **Register a user**:
   ```bash
   curl -X POST "http://localhost:8001/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{"first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "password123", "role": "Member"}'
   ```

2. **Login and get token**:
   ```bash
   TOKEN=$(curl -X POST "http://localhost:8001/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "john@example.com", "password": "password123"}' \
     | jq -r '.access_token')
   ```

3. **Use token for authenticated requests**:
   ```bash
   curl -X GET "http://localhost:8001/users/me" \
     -H "Authorization: Bearer $TOKEN"
   ```

### Using Swagger UI

1. Start the server and visit `http://localhost:8001/docs`
2. Register/Login to get JWT token
3. Click "Authorize" button and enter: `Bearer {your_token}`
4. Test any endpoint with the interactive interface

## 📊 Data Models & Enums

### User Roles
- `"Admin"` - System administrator with full access to manage platform
- `"Mentor"` - Experienced user who provides guidance to members
- `"Member"` - Regular user who creates ventures and applies to programs

### Application Status
- `"submitted"` - Initial application state
- `"reviewing"` - Under review
- `"approved"` - Application accepted
- `"rejected"` - Application denied

### Match Status
- `"pending"` - Awaiting response
- `"accepted"` - Match confirmed
- `"declined"` - Match rejected

### Milestone Status
- `"not_started"` - Not yet begun
- `"in_progress"` - Currently working
- `"completed"` - Finished

### 🎓 Program Management

#### POST `/programs/` - Create Program (Admin Only)
**Headers:** `Authorization: Bearer {admin_token}`

**Request Body:**
```json
{
  "title": "Healthcare Innovation Accelerator",
  "description": "A 6-month program for early-stage healthcare startups",
  "requirements": "Must have a healthcare-focused venture with initial prototype",
  "benefits": "Mentorship, funding opportunities, and networking events",
  "duration": "6 months",
  "application_deadline": "2024-12-31T23:59:59Z"
}
```

**Response (201):**
```json
{
  "program_id": 1,
  "title": "Healthcare Innovation Accelerator",
  "description": "A 6-month program for early-stage healthcare startups",
  "requirements": "Must have a healthcare-focused venture with initial prototype",
  "benefits": "Mentorship, funding opportunities, and networking events",
  "duration": "6 months",
  "application_deadline": "2024-12-31T23:59:59Z",
  "is_active": 1,
  "created_by": 1,
  "created_at": "2025-10-02T10:00:00Z",
  "updated_at": "2025-10-02T10:00:00Z"
}
```

#### GET `/programs/` - Get All Active Programs
**Response (200):**
```json
[
  {
    "program_id": 1,
    "title": "Healthcare Innovation Accelerator",
    "description": "A 6-month program for early-stage healthcare startups",
    "requirements": "Must have a healthcare-focused venture with initial prototype",
    "benefits": "Mentorship, funding opportunities, and networking events",
    "duration": "6 months",
    "application_deadline": "2024-12-31T23:59:59Z",
    "is_active": 1,
    "created_by": 1,
    "created_at": "2025-10-02T10:00:00Z",
    "updated_at": "2025-10-02T10:00:00Z"
  }
]
```

### 🛠️ Admin Management

#### GET `/admin/dashboard/metrics` - Get Platform Metrics
**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "users": {
    "total": 150,
    "admins": 2,
    "mentors": 25,
    "members": 123
  },
  "ventures": {
    "total": 87
  },
  "applications": {
    "total": 45,
    "pending": 12,
    "approved": 28
  },
  "mentor_matches": {
    "total": 34,
    "active": 28
  },
  "programs": {
    "total": 5,
    "active": 4
  },
  "resources": {
    "total": 156
  }
}
```

#### POST `/applications/` - Submit Application (Updated)
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "venture_id": 1,
  "program_id": 1
}
```

**Response (201):**
```json
{
  "application_id": 1,
  "venture_id": 1,
  "program_id": 1,
  "status": "submitted",
  "submission_date": "2025-10-02T10:00:00Z",
  "reviewed_by": null,
  "reviewed_at": null
}
```

## 🗄️ Database Schema

The application uses 9 main tables with proper relationships and constraints:

- **users**: User accounts and profiles (with Admin, Mentor, Member roles)
- **ventures**: Project/venture information
- **programs**: Available programs for ventures to apply to
- **resourcecategories**: Resource categorization
- **resources**: Shared resources and documents
- **applications**: Venture applications to programs
- **milestones**: Project milestones
- **mentormatches**: Mentor-member relationships
- **messages**: Direct messaging between users

## � User Stories Implementation

### As a Member/Mentee
- ✅ Log in to access dashboard
- ✅ View resource center for learning and growth
- ✅ Apply to available programs
- ✅ Create and manage venture profiles
- ✅ View application status (pending, approved, rejected)
- ✅ Send mentorship requests to mentors

### As a Mentor
- ✅ Log in to access mentor dashboard
- ✅ View and respond to mentee requests
- ✅ Post resources (articles, links, guides)
- ✅ View mentee profiles and ventures
- ✅ Manage own profile and expertise

### As a System Admin
- ✅ Secure admin login with role-based access
- ✅ View comprehensive platform metrics
- ✅ Manage users (view, update, deactivate accounts)
- ✅ Manage programs (create, edit, remove)
- ✅ Review and approve/reject applications

## �🔒 Security Features

- **JWT Authentication**: Bearer token required for protected endpoints
- **Password Hashing**: bcrypt encryption for passwords
- **Role-based Access Control**: Three-tier access (Admin, Mentor, Member)
- **Admin-only Operations**: Program management and user administration
- **Input Validation**: Pydantic models ensure data integrity
- **SQL Injection Protection**: SQLAlchemy ORM prevents injection attacks

## 🚀 Production Deployment

1. Set production environment variables
2. Use a production ASGI server (Gunicorn + Uvicorn workers)
3. Configure CORS for frontend integration
4. Set up database connection pooling
5. Enable HTTPS/SSL certificates
6. Configure logging and monitoring

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**: Ensure virtual environment is activated
2. **Database connection errors**: Check DATABASE_URL in .env file
3. **Authentication errors**: Verify JWT token format and expiration
4. **Enum validation errors**: Use exact enum values as specified

### Debug Mode

Run with `--reload` flag for automatic code reloading during development.

## 📞 Support

For API integration questions or issues:
1. Check the interactive documentation at `/docs`
2. Review the request/response examples above
3. Test endpoints using the provided cURL commands
4. Check server logs for detailed error messages