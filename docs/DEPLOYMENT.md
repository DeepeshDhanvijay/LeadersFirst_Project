# Deployment Guide

This guide covers deploying your AI Website Generator to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- API keys ready (HuggingFace, MongoDB)
- Node.js 18+ installed locally

## Environment Variables

Your application requires these environment variables:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
HUGGINGFACE_MODEL_URL=https://router.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf
MONGODB_URI=your_mongodb_connection_string_here
```

⚠️ **Never commit these values to git!**

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add the environment variables listed above
7. Click **Deploy**

Your app will be live at: `https://your-project.vercel.app`

## Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Select your GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Click **Deploy site**

## Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables in the **Variables** tab
6. Deploy automatically starts

## Custom Server Deployment

For VPS/dedicated servers:

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Start production server
npm start
```

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "ai-website-generator" -- start
pm2 save
pm2 startup
```

## Post-Deployment Checklist

- [ ] Test website generation functionality
- [ ] Verify database connection
- [ ] Check API rate limits
- [ ] Monitor error logs
- [ ] Set up domain (if applicable)
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS if needed

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check Node.js version (18+ required)
- Verify environment variables are set

### API Errors
- Confirm HuggingFace API key is valid
- Check MongoDB connection string
- Review API rate limits

### Performance Issues
- Enable caching
- Use CDN for static assets
- Monitor database queries

## Security Best Practices

1. **Never commit secrets** - Use `.env.local` and add to `.gitignore`
2. **Rotate API keys** regularly
3. **Enable rate limiting** on API routes
4. **Use HTTPS** in production
5. **Validate user inputs** on both client and server
6. **Monitor for vulnerabilities** with `npm audit`

## Scaling Considerations

- Use serverless functions for API routes
- Implement caching (Redis/Vercel Edge Cache)
- Use CDN for static assets
- Consider MongoDB Atlas auto-scaling
- Monitor with analytics (Vercel Analytics, Google Analytics)

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Review platform-specific documentation
- Check the TROUBLESHOOTING.md file
