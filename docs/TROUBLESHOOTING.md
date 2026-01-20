# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Server Issues

#### Issue: Server won't start
```
Error: Port 3000 is already in use
```

**Solutions**:
```bash
# Option 1: Kill existing Node processes
taskkill /F /IM node.exe

# Option 2: Use a different port
$env:PORT=3001; npm run dev

# Option 3: Find and kill specific port
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

#### Issue: Module not found
```
Error: Cannot find module 'next'
```

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript errors
```
Error: Type 'X' is not assignable to type 'Y'
```

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P, type "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

---

### 🔴 API Issues

#### Issue: AI generation returns error
```json
{
  "success": false,
  "error": "Failed to generate code from AI model"
}
```

**Diagnosis**:
1. Check HuggingFace API status: https://status.huggingface.co
2. Verify API key in `.env.local`
3. Check terminal logs for detailed error

**Solutions**:

**If API key is invalid**:
```env
# Update .env.local with valid key
HUGGINGFACE_API_KEY=hf_your_valid_key_here
```

**If API is down**:
- System automatically uses fallback templates
- No action needed, templates are high-quality

**If rate limited**:
- Wait a few minutes
- HuggingFace free tier: ~100 requests/hour
- Consider upgrading or implementing caching

#### Issue: MongoDB connection fails
```
Error: MongoServerError: Authentication failed
```

**Solutions**:

**Check connection string**:
```env
# Verify in .env.local
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

**Check MongoDB Atlas**:
1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Add your IP address or use 0.0.0.0/0
4. Verify database user credentials

**Test connection**:
```bash
# In browser console
fetch('http://localhost:3000/api/websites')
  .then(r => r.json())
  .then(console.log)
```

#### Issue: CORS errors
```
Access to fetch blocked by CORS policy
```

**Solution**:
```typescript
// Add to app/api/generate/route.ts
export async function POST(request: NextRequest) {
  const response = NextResponse.json(data)
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}
```

---

### 🔴 Frontend Issues

#### Issue: Preview not displaying
```
iframe showing blank page
```

**Diagnosis**:
1. Check browser console (F12)
2. Look for iframe sandbox errors
3. Verify HTML is valid

**Solutions**:

**If HTML is invalid**:
- Click "Code" tab to view source
- Look for syntax errors
- Regenerate the website

**If iframe sandbox issue**:
```typescript
// In PreviewPanel.tsx, update sandbox attribute
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms"
  // ... other props
/>
```

#### Issue: Styles not loading
```
Website looks unstyled
```

**Solution**:
```typescript
// Verify Tailwind CDN in generated HTML
// lib/aiService.ts automatically adds this
if (!html.includes('tailwindcss')) {
  html = html.replace(
    '</head>',
    '  <script src="https://cdn.tailwindcss.com"></script>\n  </head>'
  )
}
```

#### Issue: Download button not working
```
Nothing happens when clicking download
```

**Solution**:
```typescript
// Check browser console for errors
// Verify code exists
if (!code) {
  alert('Generate a website first!')
  return
}

// Clear browser cache
// Ctrl+Shift+Delete -> Clear browsing data
```

---

### 🔴 Build Issues

#### Issue: Build fails on Vercel
```
Error: Build failed with exit code 1
```

**Common causes**:

1. **Missing environment variables**
   ```
   Solution: Add all env vars in Vercel dashboard
   - HUGGINGFACE_API_KEY
   - HUGGINGFACE_MODEL_URL
   - MONGODB_URI
   ```

2. **TypeScript errors**
   ```bash
   # Fix locally first
   npm run build
   
   # Check for type errors
   npx tsc --noEmit
   ```

3. **Dependency issues**
   ```bash
   # Update package-lock.json
   npm install
   git add package-lock.json
   git commit -m "Update dependencies"
   git push
   ```

#### Issue: Deployment succeeds but site doesn't work
```
500 Internal Server Error
```

**Check Vercel logs**:
1. Go to Vercel dashboard
2. Click on your project
3. Click "Functions" tab
4. View error logs

**Common fixes**:
- Verify environment variables are set
- Check MongoDB network access whitelist
- Verify API endpoints are correct

---

### 🔴 Performance Issues

#### Issue: Slow generation times
```
AI takes 30+ seconds to respond
```

**Solutions**:

1. **Use fallback templates** (instant):
   - System auto-falls back on errors
   - Or manually trigger in `aiService.ts`

2. **Implement caching**:
   ```typescript
   // Add simple in-memory cache
   const cache = new Map()
   
   export async function generateWithCache(prompt: string) {
     if (cache.has(prompt)) {
       return cache.get(prompt)
     }
     
     const result = await generateWebsite({ prompt })
     cache.set(prompt, result)
     return result
   }
   ```

3. **Upgrade HuggingFace**:
   - Consider paid tier for faster responses
   - Or use OpenAI GPT-4 (faster but paid)

#### Issue: High memory usage
```
Next.js dev server using too much RAM
```

**Solutions**:
```bash
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

### 🔴 Database Issues

#### Issue: Saved websites not appearing
```
GET /api/websites returns empty array
```

**Diagnosis**:
```bash
# Test database connection
curl http://localhost:3000/api/websites
```

**Solutions**:

1. **Check MongoDB Atlas**:
   - Verify database `ai_website_generator` exists
   - Check `websites` collection
   - View documents in Atlas UI

2. **Test save functionality**:
   ```javascript
   // In browser console
   fetch('http://localhost:3000/api/generate', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
       prompt: 'Test website',
       saveToDatabase: true  // ← Make sure this is true
     })
   })
   .then(r => r.json())
   .then(console.log)
   ```

3. **Check database service**:
   ```typescript
   // Add logging in lib/database.ts
   console.log('Connecting to:', MONGODB_URI)
   console.log('Database:', DB_NAME)
   ```

#### Issue: Cannot delete websites
```
DELETE request fails
```

**Solution**:
```javascript
// Verify ObjectId format
const { ObjectId } = require('mongodb')

// ID must be valid 24-character hex string
if (!ObjectId.isValid(id)) {
  throw new Error('Invalid ID format')
}
```

---

### 🔴 Development Issues

#### Issue: Hot reload not working
```
Changes not reflecting in browser
```

**Solutions**:
```bash
# Option 1: Hard refresh
Ctrl + Shift + R

# Option 2: Clear Next.js cache
rm -rf .next
npm run dev

# Option 3: Disable cache in DevTools
F12 → Network tab → Check "Disable cache"
```

#### Issue: Environment variables not updating
```
.env.local changes not applied
```

**Solution**:
```bash
# Restart dev server (required for .env changes)
Ctrl+C (stop server)
npm run dev
```

---

### 🔴 Browser Issues

#### Issue: Blank white screen
```
Nothing appears after server starts
```

**Checklist**:
1. ✅ Server is running (check terminal)
2. ✅ No errors in terminal
3. ✅ Correct URL (http://localhost:3000)
4. ✅ Browser console shows no errors (F12)

**If still blank**:
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

#### Issue: Browser shows "Cannot GET /"
```
404 page not found
```

**Solution**:
- Verify `app/page.tsx` exists
- Check file is named correctly (lowercase)
- Restart dev server

---

### 🔴 Git Issues

#### Issue: Cannot push to GitHub
```
Error: failed to push some refs
```

**Solution**:
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main

# If conflicts
git status
# Resolve conflicts in files
git add .
git rebase --continue
git push
```

#### Issue: Sensitive data committed
```
.env.local accidentally committed
```

**Emergency fix**:
```bash
# Remove from git but keep locally
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
git push

# Rotate all secrets immediately!
# - Generate new HuggingFace API key
# - Change MongoDB password
# - Update .env.local
```

---

## Quick Diagnostics

### Check System Health

```bash
# 1. Check if server is running
curl http://localhost:3000

# 2. Check API endpoint
curl http://localhost:3000/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'

# 3. Check database connection
curl http://localhost:3000/api/websites

# 4. Check Node.js version
node --version  # Should be 18+

# 5. Check dependencies
npm list --depth=0
```

### Common Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid prompt or parameters |
| 404 | Not Found | Wrong URL or missing route |
| 500 | Server Error | AI API failure, DB connection issue |
| 503 | Service Unavailable | Server not running |

---

## Getting Help

### Debug Mode

Enable verbose logging:

```typescript
// In lib/aiService.ts
console.log('Prompt:', prompt)
console.log('API Response:', response.data)
console.log('Generated HTML length:', html.length)
```

### Check Logs

**Development**:
- Terminal shows all server logs
- Browser console (F12) shows client errors

**Production (Vercel)**:
- Dashboard → Functions → View Logs
- Real-time log streaming available

### Support Resources

1. **Documentation**:
   - `README.md` - Full overview
   - `QUICKSTART.md` - Quick start
   - `docs/API.md` - API reference
   - `docs/DEPLOYMENT.md` - Deployment guide

2. **External Docs**:
   - Next.js: https://nextjs.org/docs
   - HuggingFace: https://huggingface.co/docs
   - MongoDB: https://docs.mongodb.com
   - Tailwind: https://tailwindcss.com/docs

3. **Status Pages**:
   - HuggingFace: https://status.huggingface.co
   - MongoDB Atlas: https://status.mongodb.com
   - Vercel: https://www.vercel-status.com

---

## Emergency Resets

### Nuclear Option: Complete Reset

```bash
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Remove generated files
rm -rf .next
rm -rf node_modules
rm package-lock.json

# 3. Reinstall
npm install

# 4. Restart
npm run dev
```

### Reset Database

```javascript
// One-time script to clear all websites
const { MongoClient } = require('mongodb')

async function resetDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db('ai_website_generator')
  await db.collection('websites').deleteMany({})
  console.log('Database reset complete')
  await client.close()
}

resetDatabase()
```

---

## Prevention Tips

✅ **Always**:
- Keep `.env.local` backed up
- Test locally before deploying
- Read error messages carefully
- Check logs first

❌ **Never**:
- Commit `.env.local` to git
- Ignore TypeScript errors
- Skip testing after changes
- Deploy without building locally first

---

**Still stuck? Check the logs and error messages - they usually contain the solution!** 🔍
