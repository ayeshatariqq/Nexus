components/ → split by feature (chat, collaboration, entrepreneur, investor) and generic UI (ui/).

layout/ → houses DashboardLayout, Navbar, Sidebar, shared across multiple pages.

pages/ → each page is a routed view (auth flows, dashboards, profile, etc.).

context/ → app-wide state management (e.g., AuthContext).

data/ → static/mock data (requests, messages, users).

types/ → TypeScript type definitions for consistent typing across the project.

App.tsx → defines routing + wraps context providers.

main.tsx → bootstraps React app with Vite.

index.css → global theme/style layer.