# BlogApi

A RESTful ASP.NET Core Web API (`.NET 8.0`) for a blog platform with JWT-based authentication, email verification, and personal task management.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **ASP.NET Core 8.0** (C#) | Web API framework |
| **Entity Framework Core 9.0** | ORM (SQL Server) |
| **SQL Server** | Database |
| **JWT Bearer** (`Microsoft.AspNetCore.Authentication.JwtBearer`) | Authentication |
| **BCrypt.Net-Next** | Password hashing |
| **Swashbuckle / OpenAPI** | Swagger UI |
| **Serilog** | Structured file logging |

---

## Project Structure

```
BlogAPIs/
├── Controllers/          # API endpoint definitions
├── Models/               # Entity classes (EF Core)
├── Data/                 # DbContext + entity configuration
├── DTOs/                 # Request/response data transfer objects
├── Services/             # Business logic (logging, files, email)
├── Helper/               # Utilities (slug generation, image helper)
├── Properties/           # launchSettings.json
├── wwwroot/              # Static files (profile images, blog uploads)
├── Program.cs            # Entry point, DI, middleware pipeline
└── BlogApi.csproj        # Project file with dependencies
```

---

## API Endpoints

All controllers follow the route convention `api/[controller]`.

### Auth (`api/auth`)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/SignUp` | Anonymous | Register a new user (username, password, email, website, profile image). Sends email verification. |
| GET | `/api/auth/verify-email?token=` | Anonymous | Verify email confirmation token |
| POST | `/api/auth/login` | Anonymous | Authenticate user, return JWT token |

### User (`api/user`) — Admin only

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/user/getUsers` | Admin | List all users |
| POST | `/api/user/ModifyUserRole` | Admin | Toggle user role between User/Admin |

### Blog (`api/blog`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/blog/getBlogs` | Anonymous | Paginated blog listing (filters: `categorySlug`, `authorId`) |
| GET | `/api/blog/getBlogsByTitleSlug/{slug}` | Anonymous | Single blog by URL slug |
| GET | `/api/blog/searchBlogs` | Anonymous | Search blogs by title/content/date |
| POST | `/api/blog/postBlogs` | Admin | Create blog post (supports image uploads) |
| PUT | `/api/blog/EditBlogs/{id}` | Admin | Update blog post (author must match) |
| DELETE | `/api/blog/DeleteBlogs/{id}` | Admin | Delete blog post (author must match, cascades to comments/likes/images) |

### BlogCategory (`api/blogcategory`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/blogcategory/listBlogCategories` | Anonymous | List all categories |
| POST | `/api/blogcategory/addBlogCategory` | Admin | Create category |
| PUT | `/api/blogcategory/EditBlogCategory/{id}` | Admin | Update category |
| DELETE | `/api/blogcategory/DeleteBlogCategory/{id}` | Admin | Delete category |

### BlogComment (`api/blogcomment`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/blogcomment/{blogId}/comments` | Anonymous | List comments for a blog |
| POST | `/api/blogcomment/AddBlogComment` | Authenticated | Add comment to blog |
| POST | `/api/blogcomment/EditBlogComment` | Authenticated | Edit a comment (owner or Admin) |
| DELETE | `/api/blogcomment/DeleteBlogComment/{commentId}` | Authenticated | Delete comment (owner or Admin) |

### BlogLike (`api/bloglike`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/bloglike/{blogId}/Likes` | Authenticated | List likes for a blog |
| POST | `/api/bloglike/AddBlogLike` | Authenticated | Add like/dislike to a blog |
| DELETE | `/api/bloglike/RemoveBlogLike/{blogId}` | Authenticated | Remove current user's like |

### ToDo (`api/todo`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/todo/ToDoLists` | Authenticated | List current user's tasks (incomplete first) |
| POST | `/api/todo/AddToDoTask` | Authenticated | Add a new task |
| POST | `/api/todo/EditToDoTask?taskId=` | Authenticated | Edit task (owner only) |
| POST | `/api/todo/CompleteToDoTask` | Authenticated | Mark task complete (owner only) |
| DELETE | `/api/todo/DeleteToDoTask` | Authenticated | Delete task (owner only) |

### Image (`api/image`) — Admin only

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/image/upload` | Admin | Upload single image |
| POST | `/api/image/upload-multiple` | Admin | Upload multiple images |

---

## Database Models

### Users
| Column | Type | Notes |
|---|---|---|
| Id | int | PK, auto-increment |
| UserName | string(30) | Unique index |
| PasswordHash | string | BCrypt hash |
| Email | string(50) | Unique index |
| Website | string(30)? | Nullable |
| ProfileImagePath | string? | Nullable |
| Role | string | Default `"User"` |
| EmailConfirmed | bool | Default `false` |
| EmailConfirmationToken | string(100)? | Nullable |
| EmailConfirmationTokenExpires | DateTime? | Nullable |

### Blogs
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| Title | string(600) | Required |
| Slug | string(600) | Unique index |
| Content | string | Required |
| CreatedAt | DateTime | Required |
| BlogDate | DateTime | Required |
| ActualAuthor | string? | Nullable (guest attribution) |
| Source | string? | Nullable |
| BlogCategoryId | int? | FK → BlogCategories (Restrict delete) |
| AuthorId | int | FK → Users (Restrict delete) |

### BlogCategories
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| CategoryName | string(200) | Unique index |
| Slug | string | Unique index |
| Description | string | Required |

### BlogComments
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| Comment | string(500) | Required |
| CommentedAt | DateTime | Required |
| BlogId | int | FK → Blogs (Cascade delete) |
| UserId | int | FK → Users (Cascade delete) |

### BlogLikes
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| Like | bool | Required |
| LikedAt | DateTime | Required |
| BlogId | int | FK → Blogs (Cascade delete) |
| UserId | int | FK → Users (Cascade delete) |
| Unique index | (BlogId, UserId) | One like per user per blog |

### BlogImages
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| BlogId | int | FK → Blogs (Cascade delete) |
| ImageUrl | string | Required |
| AltTxt | string(100)? | Nullable |
| CreatedAt | DateTime | Required |

### ToDos
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| Task | string | Required |
| TaskDateTime | DateTime | Required |
| TaskAssignedForDateTime | DateTime | Required |
| IsCompleted | bool | Required |
| EntryByUserId | int | FK → Users |

### ApiLogs
| Column | Type | Notes |
|---|---|---|
| Id | int | PK |
| Api | string | Endpoint path |
| Payload | string | Request payload (JSON) |
| Response | string | Response data (JSON) |
| UserId | int? | Nullable |
| Timestamp | DateTime | Default `DateTime.UtcNow` |

---

## Entity Relationships

```
User      1 ───< * Blog           (Author)
User      1 ───< * BlogComment
User      1 ───< * BlogLike
User      1 ───< * ToDo
BlogCategory 1 ───< * Blog
Blog      1 ───< * BlogComment     (Cascade)
Blog      1 ───< * BlogLike        (Cascade)
Blog      1 ───< * BlogImages      (Cascade)
```

---

## Authentication & Authorization

- **Authentication:** JWT Bearer tokens with claims (`id`, `username`, `role`).
- **Role-based authorization:** `[Authorize(Roles = "Admin")]` for admin endpoints, `[Authorize]` for authenticated endpoints.
- **Owner checks:** Blog/comment/task operations verify ownership via code in controllers.
- **Email verification:** Users must verify their email (via token link) before logging in. SMTP is configured and working (`appsettings.json` → `Email` section).

---

## Middleware Pipeline (Program.cs)

1. Swagger / SwaggerUI (development only)
2. HTTPS Redirection
3. Static Files (`wwwroot/`)
4. CORS (`AllowAll` — any origin/method/header)
5. Authentication (JWT)
6. Authorization
7. MapControllers

### Registered Services
- **IApiLogger / ApiLogger** — Logs API calls to `ApiLogs` table
- **IFileService / FileService** — File storage on disk
- **ImageHelper** — Bulk image upload wrapper
- **IEmailService / EmailService** — SMTP email sending

---

## File Storage

| Type | Path | Format |
|---|---|---|
| Profile images | `wwwroot/Profile/{guid}.{ext}` | `/Profile/{filename}` |
| Blog images | `wwwroot/uploads/blog-images/{guid}.{ext}` | `/uploads/blog-images/{filename}` |

Allowed formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`. Max size: 5 MB.

---

## Configuration (appsettings.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "logs/blogapi-.log",
          "rollingInterval": "Day"
        }
      }
    ]
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=BlogDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "ThisIsASecretKeyForJwtTokenGenerationMinimum32Chars!",
    "Issuer": "BlogApi",
    "Audience": "BlogApiUsers",
    "ExpiresInMinutes": "60"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "<your-email>",
    "SmtpPass": "<your-app-password>",
    "FromEmail": "<your-email>"
  },
  "App": {
    "BaseUrl": "http://localhost:5092"
  },
  "AllowedHosts": "*"
}
```

> **Note:** `appsettings.json` is gitignored for security. The `Email` section must be filled with real SMTP credentials before email verification works.

---

## Running the Project

```bash
# Restore dependencies
dotnet restore

# Apply EF Core migrations (migrations are not tracked in git)
dotnet ef database update

# Run the API
dotnet run
```

Default development URLs: `http://localhost:5092` (HTTP), `https://localhost:7246` (HTTPS). Swagger UI is available at the root when running in Development mode.
