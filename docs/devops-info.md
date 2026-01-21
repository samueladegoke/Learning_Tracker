# DevOps Information
Generated: 2025-12-10

## Environment Variables

### Backend
| Variable | Description | Required? | Default |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy connection string | Yes (Prod) | `sqlite:///./learning_tracker.db` |
| `PORT` | Service port | No | `8000` |

### Frontend
| Variable | Description | Required? | Default |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Backend API Base URL | Yes (Prod) | `http://localhost:8000` |

## CI/CD
- **Testing**: Playwright tests configured (`playwright.config.ts`).
- **Builds**: Vite build (`npm run build`).
- **Hooks**: Vercel and Render likely configured for Git push auto-deploy.

## Code/Infrastructure Notes
- **Vercel Compatibility**: `backend/app/main.py` contains Vercel-specific `root_path` configurations (`/api`), suggesting partial compatibility or migration remnants for Serverless deployment on Vercel. Current standard is Render.
