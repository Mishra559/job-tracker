# 🚀 JobTrackr — Full-Stack Job Application Tracker

A production-grade full-stack web application to manage and track your job applications.
Built with **Spring Boot** (backend) + **React + Vite** (frontend) + **MySQL** (database).

---

## 📁 Project Structure

```
job-tracker/
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/jobtracker/
│       │   ├── JobTrackerApplication.java      # Entry point
│       │   ├── controller/
│       │   │   └── JobApplicationController.java
│       │   ├── service/
│       │   │   └── JobApplicationService.java
│       │   ├── repository/
│       │   │   └── JobApplicationRepository.java
│       │   ├── entity/
│       │   │   └── JobApplication.java         # JPA entity
│       │   ├── dto/
│       │   │   └── JobApplicationDto.java      # Request/Response DTOs
│       │   └── exception/
│       │       ├── GlobalExceptionHandler.java
│       │       └── ResourceNotFoundException.java
│       └── resources/
│           └── application.properties
│
└── frontend/                         # React + Vite application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # Router & route definitions
        ├── index.css                 # Tailwind + global styles
        ├── utils/
        │   ├── api.js                # Axios client + API methods
        │   └── constants.js          # Status config, formatters
        └── components/
            ├── layout/
            │   ├── Layout.jsx        # Page shell
            │   └── Sidebar.jsx       # Navigation sidebar
            ├── ui/
            │   ├── StatusBadge.jsx   # Colored status pill
            │   └── ConfirmModal.jsx  # Delete confirmation dialog
            ├── dashboard/
            │   └── Dashboard.jsx     # Stats + charts page
            └── jobs/
                ├── JobList.jsx       # Table with search/filter/pagination
                └── JobForm.jsx       # Create/edit form
```

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router v6         |
| Styling    | Tailwind CSS, custom CSS variables      |
| Charts     | Recharts                                |
| Backend    | Spring Boot 3, Spring Data JPA, Lombok  |
| Database   | MySQL 8+, Hibernate (auto DDL)          |
| API        | REST (JSON), Axios (frontend)           |

---

## ⚙️ Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8+** running locally

---

## 🗄️ Database Setup

```sql
-- Connect to MySQL and create the database
CREATE DATABASE IF NOT EXISTS job_tracker_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

The schema (table, columns, indexes) is **auto-generated** by Hibernate on first startup
via `spring.jpa.hibernate.ddl-auto=update`.

---

## 🔧 Backend Setup & Run

### 1. Configure database credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_tracker_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2. Build and run

```bash
cd backend

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**

---

## 🎨 Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts at **http://localhost:3000**

> The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8080`.

---

## 🌐 REST API Reference

Base URL: `http://localhost:8080/api`

### Job Applications

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| POST   | `/jobs`                      | Create a new job application         |
| GET    | `/jobs`                      | List all applications (paginated)    |
| GET    | `/jobs/{id}`                 | Get a single application             |
| PUT    | `/jobs/{id}`                 | Update an application                |
| DELETE | `/jobs/{id}`                 | Delete an application                |
| GET    | `/jobs/dashboard/stats`      | Get dashboard summary statistics     |
| GET    | `/jobs/dashboard/recent`     | Get 5 most recent applications       |

### GET /api/jobs — Query Parameters

| Param     | Type   | Default           | Description                              |
|-----------|--------|-------------------|------------------------------------------|
| `search`  | string | `""`              | Search by company name or job title      |
| `status`  | enum   | (all)             | `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED` |
| `page`    | int    | `0`               | Zero-based page index                    |
| `size`    | int    | `10`              | Page size                                |
| `sortBy`  | string | `applicationDate` | Field to sort by                         |
| `sortDir` | string | `desc`            | `asc` or `desc`                          |

### Example: Create a Job Application

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Google",
    "jobTitle": "Senior Software Engineer",
    "location": "Mountain View, CA (Remote)",
    "status": "APPLIED",
    "applicationDate": "2024-01-15",
    "notes": "Applied via LinkedIn. Recruiter: Sarah J."
  }'
```

**Response** `201 Created`:
```json
{
  "id": 1,
  "companyName": "Google",
  "jobTitle": "Senior Software Engineer",
  "location": "Mountain View, CA (Remote)",
  "status": "APPLIED",
  "applicationDate": "2024-01-15",
  "notes": "Applied via LinkedIn. Recruiter: Sarah J.",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Example: Get Paginated Applications

```bash
curl "http://localhost:8080/api/jobs?search=google&status=APPLIED&page=0&size=5&sortBy=applicationDate&sortDir=desc"
```

### Example: Update Status to Interview

```bash
curl -X PUT http://localhost:8080/api/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Google",
    "jobTitle": "Senior Software Engineer",
    "location": "Mountain View, CA",
    "status": "INTERVIEW",
    "applicationDate": "2024-01-15",
    "notes": "Interview scheduled for Jan 20 at 2pm PST."
  }'
```

### Example: Dashboard Stats

```bash
curl http://localhost:8080/api/jobs/dashboard/stats
```

**Response**:
```json
{
  "totalApplications": 24,
  "applied": 12,
  "interview": 6,
  "offer": 2,
  "rejected": 4
}
```

### Example: Delete

```bash
curl -X DELETE http://localhost:8080/api/jobs/1
# Returns 204 No Content
```

---

## 📊 Features

### ✅ Core CRUD
- Create, read, update, delete job applications
- Form validation (frontend + backend)
- Optimistic error feedback with toast notifications

### 🔍 Search & Filter
- Real-time search by company name or job title (debounced 300ms)
- Filter by application status
- Sort by application date, company name, or date added (asc/desc)
- Paginated results (10 per page)

### 📈 Dashboard
- Total applications count
- Applications by status (bar chart + donut chart)
- 5 most recent applications list
- Color-coded stat cards per status

### 🎨 UI/UX
- Dark-mode first design with Syne + DM Sans typography
- Animated page transitions (fade-up)
- Responsive layout (sidebar + main area)
- Status badges (Applied=cyan, Interview=violet, Offer=emerald, Rejected=rose)
- Hover-reveal action buttons in table
- Confirm modal for destructive actions

---

## 🏗️ Architecture Overview

```
Browser
  │
  ▼
React (Vite, port 3000)
  │  Axios /api/* →  proxied by Vite dev server
  ▼
Spring Boot (port 8080)
  ├── Controller  ← validates HTTP requests, delegates to Service
  ├── Service     ← business logic, maps entity ↔ DTO
  ├── Repository  ← Spring Data JPA / custom JPQL queries
  └── Entity      ← JPA-managed, maps to MySQL table
         │
         ▼
     MySQL (job_tracker_db.job_applications)
```

---

## 🔒 Production Checklist

Before deploying to production:

1. **Restrict CORS** — replace `@CrossOrigin(origins = "*")` with your actual frontend URL
2. **Change DDL mode** — set `spring.jpa.hibernate.ddl-auto=validate` to prevent accidental schema changes
3. **Externalize secrets** — use environment variables or Spring Cloud Config for DB credentials
4. **Add authentication** — integrate Spring Security with JWT or OAuth2
5. **Build frontend** — run `npm run build` and serve from Spring Boot's `static/` folder or a CDN
6. **Enable HTTPS** — configure SSL in Spring Boot or via a reverse proxy (nginx)
