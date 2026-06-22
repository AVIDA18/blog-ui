# Changelog — Avida Creates Frontend

All changes made to the Avida Creates frontend project.

---

## 2026-06-22 — Complete Frontend Implementation

### New Infrastructure

- **`src/api/api.js`** — Centralized fetch wrapper that reads `VITE_API_URL` from `.env`, automatically attaches JWT auth headers, handles JSON/FormData bodies, and throws descriptive errors on non-OK responses.

- **`src/context/AuthContext.jsx`** — React context providing global authentication state. Reads JWT token from `localStorage` on mount, parses the payload to extract `id`, `username`, and `role` claims. Exposes `login(token)`, `logout()`, `isAuthenticated`, and `isAdmin`.

- **`src/context/useAuth.js`** — Custom hook for consuming `AuthContext` with a guard against usage outside the provider.

### Updated Global Styles

- **`src/index.css`** — CSS custom properties for colors, spacing, shadows, and typography. Utility classes: `.btn`, `.card`, `.form-input`, `.form-group`, `.badge`, `.spinner`, `.alert`, `.empty-state`. Responsive breakpoints at 768px.

- **`src/App.css`** — All component-specific styles including navbar, hero, blog grid, pagination, single article, comments, categories grid, auth cards, dashboard layout, data tables, blog editor, todo list, like button, search results, and footer.

### New Pages

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| **Login** | `/login` | Anonymous | Email/password form, calls `POST /api/Auth/login`, stores JWT, redirects to home |
| **SignUp** | `/signup` | Anonymous | Registration form (username, email, password, website, profile image), calls `POST /api/Auth/SignUp` with FormData, redirects to login |
| **VerifyEmail** | `/verify-email?token=` | Anonymous | Handles email verification link from backend, calls `GET /api/Auth/verify-email`, shows success/error |
| **Dashboard** | `/dashboard` | Authenticated | Multi-tab admin panel: Blog Manager, Category Manager, User Manager, My Tasks |
| **BlogEditor** | `/editor/:id` | Admin only | Create/edit blog posts with image upload, category selection, date picker, author override |
| **Search** | `/search?q=` | Anonymous | Displays search results from `GET /api/Blog/searchBlogs` |

### New Components

| Component | Description |
|-----------|-------------|
| **Footer** | Simple sticky footer |
| **LikeButton** | Like/unlike toggle with live count, calls `GET/POST/DELETE /api/bloglike` |
| **ProtectedRoute** | Route guard that redirects unauthenticated users to `/login`, optionally enforces `adminOnly` |

### Rebuilt Components

- **Nav** — Responsive sticky navbar with mobile hamburger menu, auth-aware links (Login/Signup vs Dashboard/Logout), active link highlighting, admin badge
- **Header** — Hero section with gradient background and search input
- **Search** — Full search results page with loading/empty/error states
- **Comment** — Comment listing with edit/delete perms (owner or admin), toggle visibility, login prompt for guests
- **Home** — Paginated blog grid (9 per page) with image cards, category badges, author, date, excerpt; smart pagination controls
- **Categories** — Category cards linking to filtered articles
- **SingleArticle** — Full article view with image gallery, category link, author, source, like button, comment section
- **ArticlesByFilter** — Category-filtered blog grid

### Admin Dashboard Features

- **Blog Manager** — List all blogs in a table, edit (navigates to editor), delete with confirmation
- **Category Manager** — List, create, edit, delete categories via inline form
- **User Manager** — List all users with role/verified status, toggle role between User/Admin
- **My Tasks (ToDo)** — Full CRUD for personal tasks, mark complete with checkbox, edit/delete per task

### Bug Fixes / Improvements

- Fixed login field from `email` to `username` to match backend expectations
- Replaced hardcoded `http://localhost:5092` with `VITE_API_URL` env variable throughout
- Removed hardcoded JWT token from Comment component
- Added `AuthContext` for consistent auth state management
- Added proper error handling with user-friendly messages
- Added loading spinners for all async operations
- Fixed all ESLint errors and warnings
- Added route protection for authenticated/admin-only pages
- Upgraded `index.html` title to "Avida Creates - Modern Blog Platform"

### Project Files Created

```
src/
├── api/api.js                          (NEW)
├── context/AuthContext.jsx             (NEW)
├── context/useAuth.js                  (NEW)
├── context/authContext.js              (NEW, removed)
├── Components/
│   ├── Footer/Footer.jsx               (NEW)
│   ├── LikeButton/LikeButton.jsx       (NEW)
│   ├── ProtectedRoute/ProtectedRoute.jsx (NEW)
│   └── Search/Search.jsx               (REWRITTEN)
│   └── Nav/Nav.jsx                     (REWRITTEN)
│   └── Header/Header.jsx               (REWRITTEN)
│   └── Comment/Comment.jsx             (REWRITTEN)
├── Pages/
│   ├── Login/Login.jsx                 (NEW)
│   ├── SignUp/SignUp.jsx               (NEW)
│   ├── VerifyEmail/VerifyEmail.jsx     (NEW)
│   ├── Dashboard/Dashboard.jsx         (NEW)
│   ├── BlogEditor/BlogEditor.jsx       (NEW)
│   ├── Home/Home.jsx                   (REWRITTEN)
│   ├── Categories/Categories.jsx       (REWRITTEN)
│   ├── SingleArticle/SingleArticle.jsx (REWRITTEN)
│   ├── ArticlesByFilter/ArticlesByFilter.jsx (REWRITTEN)
├── index.css                           (REWRITTEN)
├── App.css                             (REWRITTEN)
├── App.jsx                             (REWRITTEN)
├── main.jsx                            (REWRITTEN)
index.html                              (UPDATED)
CHANGELOG.md                            (NEW)
```

### All API Endpoints Covered

| Backend Endpoint | Frontend Usage |
|---|---|
| `POST /api/Auth/SignUp` | SignUp page |
| `GET /api/Auth/verify-email` | VerifyEmail page |
| `POST /api/Auth/login` | Login page |
| `GET /api/User/getUsers` | Dashboard → User Manager |
| `POST /api/User/ModifyUserRole` | Dashboard → User Manager |
| `GET /api/Blog/getBlogs` | Home, ArticlesByFilter, Dashboard → Blog Manager |
| `GET /api/Blog/getBlogsByTitleSlug/{slug}` | SingleArticle |
| `GET /api/Blog/searchBlogs` | Search component |
| `POST /api/Blog/postBlogs` | BlogEditor |
| `PUT /api/Blog/EditBlogs/{id}` | BlogEditor |
| `DELETE /api/Blog/DeleteBlogs/{id}` | Dashboard → Blog Manager |
| `GET /api/BlogCategory/listBlogCategories` | Categories, Dashboard → Category Manager, BlogEditor |
| `POST /api/BlogCategory/addBlogCategory` | Dashboard → Category Manager |
| `PUT /api/BlogCategory/EditBlogCategory/{id}` | Dashboard → Category Manager |
| `DELETE /api/BlogCategory/DeleteBlogCategory/{id}` | Dashboard → Category Manager |
| `GET /api/BlogComment/{blogId}/comments` | Comment component |
| `POST /api/BlogComment/AddBlogComment` | Comment component |
| `POST /api/BlogComment/EditBlogComment` | Comment component |
| `DELETE /api/BlogComment/DeleteBlogComment/{commentId}` | Comment component |
| `GET /api/BlogLike/{blogId}/Likes` | LikeButton |
| `POST /api/BlogLike/AddBlogLike` | LikeButton |
| `DELETE /api/BlogLike/RemoveBlogLike/{blogId}` | LikeButton |
| `GET /api/ToDo/ToDoLists` | Dashboard → My Tasks |
| `POST /api/ToDo/AddToDoTask` | Dashboard → My Tasks |
| `POST /api/ToDo/EditToDoTask` | Dashboard → My Tasks |
| `POST /api/ToDo/CompleteToDoTask` | Dashboard → My Tasks |
| `DELETE /api/ToDo/DeleteToDoTask` | Dashboard → My Tasks |
