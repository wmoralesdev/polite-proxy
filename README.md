# Polite Proxy

A secure live feedback demo where users submit text, and an AI Edge Function acts as mandatory middleware to rewrite text into a polite version before it touches the database.

## 🎯 Core Concept

**Client has ZERO write permissions.** All writes happen server-side via Supabase Edge Functions using the Secret API key. This demonstrates strict Row Level Security (RLS) policies and server-side AI processing.

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Prerequisites

- Node.js 18+ and pnpm
- A Supabase project
- An OpenAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables (see ENV_SETUP.md)
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migration in Supabase SQL Editor
# (see supabase/migrations/20240101000000_create_messages_table.sql)

# Deploy Edge Function
supabase functions deploy submit-message

# Set Edge Function secrets
supabase secrets set SECRET_KEY=your_secret_key
supabase secrets set OPENAI_API_KEY=your_key

# Start development server
pnpm dev
```

## 📁 Project Structure

```
polite-proxy/
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── auth/callback/        # OAuth callback handler
│   └── globals.css           # Hazard theme styles
├── lib/
│   └── supabase/             # Supabase client utilities
├── supabase/
│   ├── functions/
│   │   └── submit-message/   # Edge Function (AI + DB write)
│   └── migrations/           # Database schema
├── components/ui/            # shadcn/ui components
└── middleware.ts             # Auth session management
```

## 🏗️ Architecture

### Database Schema

- **Table**: `messages`
  - Stores AI-rewritten polite messages
  - RLS: Read-only for clients, write-only via Edge Function

### Security Model

- ✅ **SELECT**: Allowed for authenticated/anon (public feed)
- ❌ **INSERT/UPDATE/DELETE**: DENIED for all client roles
- ✅ **Edge Function**: Uses secret key to bypass RLS

### Data Flow

1. User authenticates via Google OAuth
2. User types message → Frontend calls Edge Function
3. Edge Function:
   - Validates JWT
   - Sends to OpenAI for rewriting
   - Inserts polite message (secret key)
4. Realtime broadcasts to all clients
5. UI updates automatically

## 🎨 Features

- **Hazard-themed UI**: Bold, industrial design with toxic green/yellow palette
- **Real-time Updates**: Supabase Realtime for instant message sync
- **AI Filtering**: OpenAI-powered text sanitization
- **Zero Client Writes**: Strict RLS enforcement

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables reference

## 🔒 Security Notes

- ⚠️ **NEVER** expose `SECRET_KEY` to the client
- Secret key bypasses RLS - intentional for Edge Functions (modern replacement for service_role)
- All client operations use publishable key with strict RLS
- Edge Functions authenticate users via JWT

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres, Realtime, Edge Functions)
- **AI**: OpenAI API (gpt-4o-mini)
- **Auth**: Supabase Auth (Google OAuth)
