# AI Website Generator 🚀

A modern AI-powered website generator that transforms natural language descriptions into fully functional, responsive websites using CodeLlama AI model.

## 🌐 Live Demo

**[https://leaders-first-project.vercel.app/](https://leaders-first-project.vercel.app/)**

![AI Website Generator](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## 🌟 Features

- **Natural Language Processing**: Describe your website in plain English
- **AI-Powered Generation**: Uses CodeLlama-7b-Instruct model via HuggingFace API
- **Live Preview**: See your website in real-time before downloading
- **Responsive Design**: All generated websites work on desktop, tablet, and mobile
- **Multiple Templates**: Portfolio, E-commerce, Blog, Landing Page, and more
- **Database Storage**: Save and retrieve generated websites
- **Export Functionality**: Download HTML files instantly
- **Fallback System**: High-quality templates when AI is unavailable

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
┌────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
│   UI Components │ │ API Routes  │ │  Database Layer  │
│  - Generator    │ │ - /generate │ │  - MongoDB       │
│  - Preview      │ │ - /websites │ │  - Schemas       │
└─────────────────┘ └──────┬──────┘ └──────────────────┘
                            │
                    ┌───────▼────────┐
                    │  AI Service    │
                    │  - HuggingFace │
                    │  - CodeLlama   │
                    └────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- HuggingFace API key (free tier)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd LeadersFirst_Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables are already configured in `.env.local`**:
   - `HUGGINGFACE_API_KEY`: Your HuggingFace API key
   - `HUGGINGFACE_MODEL_URL`: CodeLlama model endpoint
   - `MONGODB_URI`: MongoDB connection string

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
LeadersFirst_Project/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # AI generation endpoint
│   │   └── websites/
│   │       ├── route.ts           # List all websites
│   │       └── [id]/route.ts      # Get/delete specific website
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── WebsiteGenerator.tsx       # Input form component
│   └── PreviewPanel.tsx           # Preview/code display
├── lib/
│   ├── aiService.ts               # HuggingFace integration
│   └── database.ts                # MongoDB operations
├── types/
│   └── env.d.ts                   # TypeScript definitions
├── .env.local                     # Environment variables
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## 🔌 API Endpoints

### POST /api/generate

Generate a website from a text prompt.

**Request Body**:
```json
{
  "prompt": "Create a portfolio website for a photographer",
  "websiteType": "portfolio",
  "saveToDatabase": true
}
```

**Response**:
```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "css": "",
  "websiteId": "507f1f77bcf86cd799439011"
}
```

### GET /api/websites

Retrieve all saved websites.

**Query Parameters**:
- `limit` (optional): Maximum number of results (default: 50)

**Response**:
```json
{
  "success": true,
  "websites": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Generated Website",
      "prompt": "Create a portfolio...",
      "websiteType": "portfolio",
      "htmlCode": "<!DOCTYPE html>...",
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

### GET /api/websites/[id]

Get a specific website by ID.

**Response**:
```json
{
  "success": true,
  "website": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Generated Website",
    "htmlCode": "<!DOCTYPE html>..."
  }
}
```

### DELETE /api/websites/[id]

Delete a website by ID.

**Response**:
```json
{
  "success": true,
  "message": "Website deleted successfully"
}
```

## 🤖 AI Model Integration

### HuggingFace CodeLlama-7b-Instruct

- **Model**: `codellama/CodeLlama-7b-Instruct-hf`
- **Provider**: HuggingFace Inference API
- **Tier**: Free (with rate limits)
- **Capabilities**: 
  - HTML/CSS/JavaScript generation
  - Understanding natural language requirements
  - Responsive design generation
  - Component-based architecture

### Fallback System

If the AI model is unavailable or fails:
1. System detects website type from prompt
2. Serves high-quality, pre-built templates
3. Templates include: Portfolio, E-commerce, Blog, Landing Page
4. All templates are fully responsive and production-ready

## 💾 Database Schema

### Websites Collection

```typescript
interface Website {
  _id: string
  title: string
  description: string
  prompt: string
  websiteType: string
  htmlCode: string
  cssCode: string
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 Supported Website Types

1. **Portfolio**: Personal showcases, artist/photographer portfolios
2. **E-commerce**: Online stores, product catalogs
3. **Blog**: Personal blogs, article platforms
4. **Landing Page**: Product launches, SaaS marketing
5. **Business**: Corporate websites, service providers
6. **General**: Flexible websites for any purpose

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 | React framework with App Router |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Language | TypeScript | Type-safe development |
| AI Model | CodeLlama-7b | Code generation via HuggingFace |
| Database | MongoDB Atlas | Cloud-hosted NoSQL database |
| Hosting | Vercel | Serverless deployment platform |
| HTTP Client | Axios | API requests |

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/postcss": "^4.0.0",
    "mongodb": "^6.0.0",
    "axios": "^1.6.0"
  }
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `HUGGINGFACE_API_KEY`
     - `HUGGINGFACE_MODEL_URL`
     - `MONGODB_URI`

3. **Deploy**:
   - Vercel automatically deploys on push
   - Custom domain support available

### Environment Variables for Production

Ensure these are set in your Vercel dashboard:

```env
HUGGINGFACE_API_KEY=hf_your_api_key
HUGGINGFACE_MODEL_URL=https://router.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
```

## 🎯 Usage Examples

### Example 1: Photographer Portfolio

**Prompt**: 
> "Create a portfolio website for a photographer with a hero section, gallery grid, about section, and contact form. Use elegant black and white design."

**Result**: Modern portfolio with image galleries, responsive layout, and contact functionality.

### Example 2: E-commerce Store

**Prompt**:
> "Build an e-commerce site for handmade jewelry. Include product cards with prices, shopping cart icon, featured products section, and footer with social links."

**Result**: Full e-commerce layout with product showcase, pricing, and navigation.

### Example 3: SaaS Landing Page

**Prompt**:
> "Design a modern landing page for a project management SaaS. Include hero with CTA, features section with icons, pricing tiers, and testimonials."

**Result**: Professional landing page optimized for conversions.

## 🔧 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📊 Performance Considerations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use Next.js Image component for production
- **API Caching**: Consider implementing Redis for AI response caching
- **Rate Limiting**: HuggingFace free tier has limits; implement request queuing
- **Database Indexing**: MongoDB indexes on `createdAt` and `websiteType`

## 🐛 Troubleshooting

### Issue: AI Model Times Out

**Solution**: 
- Check HuggingFace API status
- Verify API key is valid
- System will automatically use fallback templates

### Issue: MongoDB Connection Fails

**Solution**:
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure IP address is whitelisted

### Issue: Build Fails on Vercel

**Solution**:
- Check all environment variables are set
- Verify Node.js version compatibility
- Review build logs for specific errors

## 🤝 Contributing

This project was built as part of the LeadersFirst internship program. For contributions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Model Selection Rationale

### Why CodeLlama-7b-Instruct?

1. **Open Source**: Free to use via HuggingFace
2. **Specialized**: Trained specifically for code generation
3. **Instruction Following**: Optimized for prompt-based tasks
4. **Size**: 7B parameters - balance between quality and speed
5. **Accessibility**: Available on free HuggingFace tier

### Alternative Models Considered

- **GPT-4**: Excellent quality but requires paid OpenAI API
- **Claude**: Great for complex tasks but paid tier needed
- **Llama 2**: General purpose, less specialized for code
- **StarCoder**: Strong for code but larger model size

## 📄 License

This project is developed for educational purposes as part of the LeadersFirst internship program.

## 🙏 Acknowledgments

- HuggingFace for free AI model access
- MongoDB Atlas for free database tier
- Vercel for hosting platform
- Tailwind CSS for styling framework
- Next.js team for excellent framework

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team
- Check documentation at `/docs`

---

**Built with ❤️ for LeadersFirst Project**

*Last Updated: January 20, 2026*
