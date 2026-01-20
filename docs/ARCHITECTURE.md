# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                          │
│                      (Frontend + API)                           │
│                                                                 │
│  ┌──────────────────────┐       ┌──────────────────────┐      │
│  │   Frontend Layer     │       │    API Layer         │      │
│  │                      │       │                      │      │
│  │  ┌────────────────┐  │       │  ┌────────────────┐ │      │
│  │  │ Home Page      │  │       │  │ /api/generate  │ │      │
│  │  │ (page.tsx)     │  │◄──────┼──┤ route.ts       │ │      │
│  │  └────────────────┘  │       │  └────────────────┘ │      │
│  │                      │       │                      │      │
│  │  ┌────────────────┐  │       │  ┌────────────────┐ │      │
│  │  │ WebsiteGen     │  │       │  │ /api/websites  │ │      │
│  │  │ Component      │──┼───────┼─►│ route.ts       │ │      │
│  │  └────────────────┘  │       │  └────────────────┘ │      │
│  │                      │       │                      │      │
│  │  ┌────────────────┐  │       │  ┌────────────────┐ │      │
│  │  │ PreviewPanel   │  │       │  │ /api/websites  │ │      │
│  │  │ Component      │◄─┼───────┼──┤ /[id]/route.ts │ │      │
│  │  └────────────────┘  │       │  └────────────────┘ │      │
│  └──────────────────────┘       └──────────┬───────────┘      │
└─────────────────────────────────────────────┼──────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌──────────────────┐
        │   AI Service      │    │ Database Service  │    │  Fallback System │
        │  (aiService.ts)   │    │  (database.ts)    │    │  (Templates)     │
        └─────────┬─────────┘    └─────────┬─────────┘    └──────────────────┘
                  │                        │
                  ▼                        ▼
    ┌─────────────────────────┐  ┌────────────────────┐
    │   HuggingFace API       │  │   MongoDB Atlas    │
    │   CodeLlama-7b-Instruct │  │   Cloud Database   │
    └─────────────────────────┘  └────────────────────┘
```

## Component Architecture

### Frontend Components

```
app/page.tsx (Main Page)
│
├─► WebsiteGenerator.tsx
│   │
│   ├─► Text Input (Prompt)
│   ├─► Website Type Selector
│   ├─► Example Prompts
│   ├─► Save Checkbox
│   └─► Generate Button
│
└─► PreviewPanel.tsx
    │
    ├─► Tab Switcher (Preview/Code)
    ├─► Live Preview (iframe)
    ├─► Code Display
    ├─► Copy Button
    └─► Download Button
```

## API Flow

### Website Generation Flow

```
1. User Input
   │
   └─► User enters prompt: "Create a portfolio website"
        User selects type: "portfolio"
        User clicks "Generate"
   
2. Frontend Processing
   │
   └─► WebsiteGenerator.tsx handles click
        Calls POST /api/generate
        Shows loading state
   
3. API Route Handler
   │
   └─► app/api/generate/route.ts
        Validates input
        Extracts prompt and type
   
4. AI Service
   │
   ├─► Primary Path: HuggingFace API
   │   │
   │   ├─► Constructs system prompt
   │   ├─► Calls CodeLlama model
   │   ├─► Receives generated HTML
   │   └─► Parses and cleans code
   │
   └─► Fallback Path: Templates
       │
       ├─► Detects website type
       ├─► Loads pre-built template
       └─► Returns high-quality HTML
   
5. Database (Optional)
   │
   └─► If saveToDatabase = true
        DatabaseService.saveWebsite()
        Stores in MongoDB
   
6. Response
   │
   └─► Returns { success, html, css, websiteId }
   
7. Frontend Display
   │
   └─► PreviewPanel receives code
        Updates iframe srcDoc
        Enables download/copy
```

## Data Flow Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ Enters Prompt
       │
       ▼
┌──────────────────────┐
│  WebsiteGenerator    │
│  Component           │
│  - Captures input    │
│  - Validates data    │
│  - Calls API         │
└──────┬───────────────┘
       │ POST /api/generate
       │ { prompt, type, save }
       │
       ▼
┌──────────────────────┐
│  API Route Handler   │
│  - Receives request  │
│  - Validates params  │
│  - Calls AI Service  │
└──────┬───────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  AI Service  │  │  Database    │
│              │  │  Service     │
│ - HuggingFace│  │              │
│ - Fallback   │  │ - MongoDB    │
│ - Parse HTML │  │ - CRUD Ops   │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │ Returns
                │ { html, css, id }
                │
                ▼
┌──────────────────────┐
│  PreviewPanel        │
│  Component           │
│  - Displays iframe   │
│  - Shows code        │
│  - Enable download   │
└──────┬───────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│ Views Site  │
└─────────────┘
```

## Database Schema

```
MongoDB Database: ai_website_generator
│
└─► Collection: websites
    │
    └─► Document Structure:
        {
          _id: ObjectId("507f1f77bcf86cd799439011"),
          title: "Generated Website - 1/20/2026",
          description: "Portfolio for photographer",
          prompt: "Create a portfolio website...",
          websiteType: "portfolio",
          htmlCode: "<!DOCTYPE html>...",
          cssCode: "",
          createdAt: ISODate("2026-01-20T10:00:00Z"),
          updatedAt: ISODate("2026-01-20T10:00:00Z")
        }
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│                                         │
│  React 19 + TypeScript                  │
│  Tailwind CSS 4                         │
│  Next.js App Router                     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          APPLICATION LAYER              │
│                                         │
│  Next.js API Routes                     │
│  Server Components                      │
│  Client Components                      │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          BUSINESS LOGIC LAYER           │
│                                         │
│  AI Service (lib/aiService.ts)          │
│  Database Service (lib/database.ts)     │
│  Fallback Templates                     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          INTEGRATION LAYER              │
│                                         │
│  HuggingFace API (Axios)                │
│  MongoDB Driver                         │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          EXTERNAL SERVICES              │
│                                         │
│  HuggingFace (CodeLlama-7b)             │
│  MongoDB Atlas                          │
└─────────────────────────────────────────┘
```

## Request/Response Cycle

### Generate Website Request

```
Client Request:
POST /api/generate
Content-Type: application/json

{
  "prompt": "Create a portfolio website for a photographer",
  "websiteType": "portfolio",
  "saveToDatabase": true
}

       ↓

Server Processing:
1. Validate input
2. Create AI prompt
3. Call HuggingFace API
4. Parse response
5. Inject Tailwind CDN
6. Save to MongoDB (optional)

       ↓

Server Response:
Status: 200 OK
Content-Type: application/json

{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "css": "",
  "websiteId": "507f1f77bcf86cd799439011"
}
```

## Error Handling Flow

```
User Action
    │
    ▼
API Request
    │
    ├─► Success Path
    │   │
    │   └─► Return generated HTML
    │
    └─► Error Path
        │
        ├─► AI API Fails
        │   │
        │   └─► Use Fallback Template
        │       │
        │       └─► Return Template HTML
        │
        ├─► Database Fails
        │   │
        │   └─► Log Error
        │       │
        │       └─► Continue (non-critical)
        │
        └─► Validation Fails
            │
            └─► Return 400 Error
                │
                └─► Display Error Message
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│          Environment Variables          │
│         (.env.local - gitignored)       │
│                                         │
│  - HUGGINGFACE_API_KEY                  │
│  - MONGODB_URI                          │
│  - Other secrets                        │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Server-Side Only Access         │
│       (Never exposed to client)         │
│                                         │
│  API Routes access env vars             │
│  Services use encrypted connections     │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
GitHub Repository
       │
       │ Push
       │
       ▼
Vercel Platform
       │
       ├─► Build Process
       │   │
       │   ├─► Install dependencies
       │   ├─► TypeScript compilation
       │   ├─► Next.js build
       │   └─► Optimize assets
       │
       ├─► Environment Setup
       │   │
       │   └─► Inject environment variables
       │
       └─► Deploy
           │
           └─► Edge Network
               │
               ├─► United States
               ├─► Europe
               ├─► Asia
               └─► Other regions
```

## Scalability Considerations

```
Current Architecture (Free Tier)
┌─────────────────────────────────┐
│  Vercel: 100GB bandwidth/month  │
│  MongoDB: 512MB storage         │
│  HuggingFace: ~100 req/hour     │
└─────────────────────────────────┘

       │
       │ Growth Path
       │
       ▼

Future Architecture (Scaled)
┌─────────────────────────────────┐
│  Vercel Pro: Unlimited          │
│  MongoDB Dedicated: 10GB+       │
│  HuggingFace Pro: 1000 req/hr   │
│  Redis Cache: Response caching  │
│  CDN: Static asset delivery     │
└─────────────────────────────────┘
```

## System Dependencies

```
Node.js (Runtime)
    │
    ├─► next (Framework)
    ├─► react (UI Library)
    ├─► react-dom (DOM Rendering)
    ├─► typescript (Type System)
    ├─► tailwindcss (Styling)
    ├─► @tailwindcss/postcss (PostCSS Plugin)
    ├─► postcss (CSS Processing)
    ├─► mongodb (Database Driver)
    └─► axios (HTTP Client)
```

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Error resilience
- ✅ Security
- ✅ Maintainability
- ✅ Performance optimization
