# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FotoShow is a React-based photo upload and printing service application. Users can upload photos, configure print specifications (size, type, color/sepia/B&W), and place orders for physical photo prints with delivery or pickup options.

## Tech Stack

- **Frontend Framework**: React 19.1.1 with Vite 7.1.2
- **Build Tool**: Vite using @vitejs/plugin-react-swc (SWC for Fast Refresh)
- **Routing**: React Router DOM v7
- **UI Framework**: Bootstrap 5.3.8 + React Bootstrap
- **Icons**: Lucide React + React Feather
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Alerts**: SweetAlert2 with React Content
- **Styling**: CSS modules + Bootstrap

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Architecture

### Application Structure

The app follows a context-based authentication pattern with React Router for navigation:

```
main.jsx → App.jsx (wraps with AuthProvider) → BrowserRouter → Navbar + PrincipalRoutes
```

### Key Directories

- `src/page/` - Full-page components (screens)
- `src/component/` - Reusable UI components
- `src/context/` - React Context providers (AuthContext)
- `src/routes/` - Route definitions (PrincipalRoutes.jsx)
- `src/helpers/` - Utility functions and API client
- `src/css/` - Custom stylesheets

### Authentication Flow

**AuthContext** (`src/context/AuthContext.jsx`) manages authentication state globally:
- Stores `isLoggedIn` (boolean) and `user` (object) in state
- Persists token and user data in localStorage
- Provides `login(token, userData)` and `logout()` methods
- Automatically checks localStorage on app load to restore session

**Token Management**:
- JWT tokens stored in localStorage under key `"token"`
- User data stored in localStorage under key `"user"` (JSON stringified)
- clientAxios interceptor automatically attaches token to all API requests via `Authorization: Bearer <token>` header
- 401 responses trigger automatic logout and redirect to `/login`

**Protected Routes Pattern**:
Components check for token presence in localStorage and redirect to `/login` if missing (see PhotoUploadApp.jsx:35-50 for example implementation using useEffect + Swal + navigate).

### API Integration

**Base API Client** (`src/helpers/clientAxios.jsx`):
- Axios instance with baseURL from `VITE_API_URL` environment variable (defaults to `http://localhost:8080`)
- All endpoints use `/api` prefix
- Request interceptor: Adds `Authorization: Bearer <token>` header from localStorage
- Response interceptor: Handles 401 errors by clearing localStorage and redirecting to `/login`

**Key API Endpoints**:
- `POST /api/usuarios/login` - Login (returns token, rolUsuario, msg)
- `POST /api/pedidos` - Create new order
- `POST /api/fotos/subir` - Upload photo (multipart/form-data with "foto" and "pedido" fields)
- `POST /api/pedidos/:id/finalizar` - Finalize order

### Photo Upload Workflow

The PhotoUploadApp component implements a multi-step order process:

1. **File Selection**: Drag-and-drop or file picker
   - Validates file type (JPEG, PNG, GIF, WebP)
   - Validates file size (max 10MB per file)
   - Max 10 files per order
   - Creates local preview URLs with `URL.createObjectURL()`

2. **Order Configuration Modal**: User specifies print options
   - Print size (10x15, 13x18, 15x21, 20x25, 20x30 cm) with per-photo pricing
   - Print type (color, sepia, black & white)
   - Delivery type (envio/shipping or retiro/pickup)
   - Shipping address (required if envio)
   - Contact phone (required)
   - Optional comments
   - Displays estimated total cost calculation

3. **Order Submission** (src/component/PhotoUploadApp.jsx:176-347):
   - Step 1: `POST /api/pedidos` creates order record
   - Step 2: Loop through files, `POST /api/fotos/subir` for each photo
   - Step 3: `POST /api/pedidos/:id/finalizar` confirms order completion
   - Extensive error handling with user-friendly Swal alerts

### Routing Structure

All routes defined in `src/routes/PrincipalRoutes.jsx`:

- `/` - HomeScreen (landing page with hero, features, stats)
- `/up-photo` - PhotoUploadApp (photo upload interface)
- `/register` - RegisterScreen
- `/login` - LoginScreen
- `/changepass` - ChangePassScreen (requires token in URL)
- `/recoverymail` - RecoveryPassMailScreen

Commented-out admin routes exist for future implementation (admin users, admin products, patients).

### Component Patterns

**Forms**: Use React Hook Form for validation
```jsx
const { register, handleSubmit, formState: { errors } } = useForm();
// Fields use {...register("fieldName", { required: true })}
// Errors displayed conditionally with {errors.fieldName && <p>...</p>}
```

**Navigation**: Use React Router hooks
```jsx
import { useNavigate, Link } from "react-router-dom";
const navigate = useNavigate();
// navigate("/path") or <Link to="/path">
```

**Alerts**: Use SweetAlert2 for user feedback
```jsx
import Swal from "sweetalert2";
// Swal.fire({ icon: "success", title: "...", text: "..." });
```

**Auth Context Usage**:
```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { isLoggedIn, user, login, logout } = useContext(AuthContext);
```

## Environment Variables

Create `.env` file in project root:

```
VITE_API_URL=http://localhost:8080
```

Access in code via `import.meta.env.VITE_API_URL`

## Important Notes

- The app uses Bootstrap 5's native JavaScript (bootstrap.bundle.min.js) for dropdowns, modals, etc.
- Custom CSS in `src/css/home.css` defines gradient styles and animations for landing page
- Photo previews should be cleaned up with `URL.revokeObjectURL()` when files are removed
- The navbar (NavBarApp.jsx) conditionally renders based on `isLoggedIn` state from AuthContext
- HomeScreen's "Comenzar Gratis" buttons check for token and route to `/up-photo` if logged in, `/login` otherwise
- Price calculation logic in PhotoUploadApp uses `tamaniosDisponibles` array (src/component/PhotoUploadApp.jsx:26-32)
- Register route path is inconsistent: NavBarApp links to `/registrarse` but PrincipalRoutes defines `/register`

## Common Gotchas

- Remember to check localStorage for token before allowing access to protected routes
- Always use clientAxios (not plain axios) to ensure token is attached to requests
- SWC compilation may behave differently than Babel - test thoroughly if adding JSX transforms
- Bootstrap dropdowns require the navbar-toggler to have correct `data-bs-toggle` and `data-bs-target` attributes
- Modal backgrounds need `style={{ backgroundColor: "rgba(0,0,0,0.5)" }}` for proper overlay effect
- File inputs should use `ref` and be hidden with `.d-none`, triggered via click handler on visible upload zone
