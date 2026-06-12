# App Directory (`src/app/`)

## Purpose
This directory contains the Next.js App Router - the **delivery mechanism** for your application. It should remain THIN and only handle HTTP concerns.

## What Goes Here
- **Route Handlers** (`page.tsx`): UI pages and views
- **Layouts** (`layout.tsx`): Shared layout wrappers
- **API Routes** (`api/`): REST API endpoints
- **Providers** (`providers/`): React context providers
- **Global Styles** (`globals.css`): Global CSS styles

## What Does NOT Go Here
- Business logic → Move to `src/lib/` or `src/services/`
- Reusable components → Move to `src/components/`
- Types → Move to `src/types/`
- Hooks → Move to `src/hooks/`

## Route Structure
```
app/
├── page.tsx              # Landing/Home page (Auth form)
├── layout.tsx            # Root layout with providers
├── globals.css           # Global Tailwind CSS styles
├── providers/
│   └── AuthProvider.tsx  # Authentication context provider
├── api/
│   └── admin/
│       └── users/route.ts # API endpoint for user management
├── admin/
│   ├── page.tsx          # Admin dashboard
│   ├── layout.tsx        # Admin layout wrapper
│   ├── students/         # Student management pages
│   ├── staff/            # Staff management pages
│   ├── exams/            # Exam management pages
│   ├── fees/             # Fee management pages
│   └── academic/         # Academic settings pages
├── about/                # Public about page
└── contact/             # Public contact page
```

## Import Guidelines
Use path aliases for all imports:
```tsx
// Correct
import { Button } from '@components/ui';
import { useAuth } from '@app/providers/AuthProvider';

// Incorrect
import { Button } from '../../components/ui';
```
