# Technology Stack
Generated: 2025-12-10

## Part 1: Frontend (Web)
| Category | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | React (Vite) | ^18.2.0 | Core UI library, fast build tool |
| **Language** | JavaScript/TypeScript | ESNext | Modern web development |
| **Styling** | TailwindCSS | ^3.3.5 | Utility-first CSS framework |
| **UI Library** | Lucide React | ^0.556.0 | Iconography |
| **Animation** | Framer Motion | ^12.23.25 | Complex UI transitions |
| **Runtime** | Pyodide | ^0.27.5 | Python execution in browser |
| **Routing** | React Router DOM | ^6.20.0 | Client-side routing |
| **Testing** | Playwright | ^1.57.0 | End-to-End testing |

## Part 2: Backend (API)
| Category | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | FastAPI | 0.104.1 | High-performance Python API |
| **Language** | Python | 3.10+ | Backend logic |
| **ORM** | SQLAlchemy | 2.0.23 | Database abstraction |
| **Validation** | Pydantic | 2.5.2 | Data validation and settings |
| **Database** | PostgreSQL | (Prod) | Production data store (Supabase) |
| **Database** | SQLite | (Dev) | Local development data store |
| **Migration** | Alembic | >=1.13.0 | Schema version control |
| **Adapter** | Mangum | 0.17.0 | ASGI handling for Serverless/Vercel |

## Part 3: Utilities (Scripts)
| Category | Technology | Description |
| :--- | :--- | :--- |
| **ETL** | Python | Content extraction and data seeding scripts |
| **Migration** | Python | Custom data migration logic |
