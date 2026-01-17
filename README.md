# Planner

A visual content calendar for Instagram scheduling with multi-brand support.

## Features

- Multi-brand workspaces (switch between brands from the top nav)
- Monthly calendar view with drag-and-drop scheduling
- List view alternative for mobile/detailed viewing
- Post management: create, edit, delete posts
- Filter by category and status
- Mobile responsive (auto-switches to list view on mobile)
- Google Sheets backend (no database required)

## Setup

### 1. Google Cloud Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the **Google Sheets API**
4. Go to **APIs & Services > Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### 2. Google Sheet Setup

Create a new Google Sheet for each brand. The app will automatically create headers on first use:

| ID | Date | Time | Category | Caption | Image_URL | Status | Posted_At |

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `BRAND_1_*` - Brand configuration (see .env.example)

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Adding More Brands

Add new brand environment variables:

```env
BRAND_2_NAME=Second Brand
BRAND_2_SLUG=second-brand
BRAND_2_COLOR=#8B5CF6
BRAND_2_SHEET_ID=your-sheet-id
BRAND_2_INSTAGRAM=@secondbrand
BRAND_2_CATEGORIES=Category1,Category2
```

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- next-auth (Google OAuth)
- Google Sheets API
- @dnd-kit (drag and drop)
