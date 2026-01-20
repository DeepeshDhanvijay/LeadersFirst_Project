# API Documentation

## Overview

The AI Website Generator provides RESTful API endpoints for website generation, storage, and retrieval.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

## Authentication

Currently, no authentication is required. For production use, consider implementing API keys or OAuth.

## Endpoints

### 1. Generate Website

**Endpoint**: `POST /api/generate`

**Description**: Generate a website from a natural language prompt using AI.

**Request Body**:
```json
{
  "prompt": "string (required) - Description of the website to generate",
  "websiteType": "string (optional) - Type: general|portfolio|ecommerce|blog|landing|business",
  "saveToDatabase": "boolean (optional) - Whether to save to MongoDB (default: false)"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a modern portfolio website for a UX designer",
    "websiteType": "portfolio",
    "saveToDatabase": true
  }'
```

**Success Response** (200):
```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "css": "",
  "websiteId": "507f1f77bcf86cd799439011"
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Error message",
  "fallback": true
}
```

---

### 2. List All Websites

**Endpoint**: `GET /api/websites`

**Description**: Retrieve all saved websites from the database.

**Query Parameters**:
- `limit` (optional): Maximum number of results (default: 50, max: 100)

**Example Request**:
```bash
curl http://localhost:3000/api/websites?limit=10
```

**Success Response** (200):
```json
{
  "success": true,
  "websites": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Generated Website - 1/20/2026",
      "description": "Create a portfolio...",
      "prompt": "Create a portfolio website for a UX designer",
      "websiteType": "portfolio",
      "htmlCode": "<!DOCTYPE html>...",
      "cssCode": "",
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Website

**Endpoint**: `GET /api/websites/:id`

**Description**: Retrieve a specific website by its ID.

**Path Parameters**:
- `id` (required): MongoDB ObjectId of the website

**Example Request**:
```bash
curl http://localhost:3000/api/websites/507f1f77bcf86cd799439011
```

**Success Response** (200):
```json
{
  "success": true,
  "website": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Generated Website",
    "htmlCode": "<!DOCTYPE html>...",
    "prompt": "Create a portfolio website",
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Website not found"
}
```

---

### 4. Delete Website

**Endpoint**: `DELETE /api/websites/:id`

**Description**: Delete a website by its ID.

**Path Parameters**:
- `id` (required): MongoDB ObjectId of the website

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/websites/507f1f77bcf86cd799439011
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Website deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Website not found"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Invalid parameters |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error - AI or database failure |

## Rate Limits

- HuggingFace free tier: ~100 requests/hour
- Consider implementing client-side rate limiting for production

## Data Models

### Website Schema

```typescript
interface Website {
  _id: string                // MongoDB ObjectId
  title: string              // Display title
  description: string        // Short description
  prompt: string             // Original user prompt
  websiteType: string        // Type of website
  htmlCode: string           // Generated HTML
  cssCode: string            // Generated CSS (usually empty with Tailwind)
  createdAt: Date           // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function generateWebsite(prompt) {
  try {
    const response = await axios.post('http://localhost:3000/api/generate', {
      prompt,
      websiteType: 'portfolio',
      saveToDatabase: true
    });
    
    console.log('Generated:', response.data.html);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

generateWebsite('Create a portfolio for a photographer');
```

### Python

```python
import requests

def generate_website(prompt):
    response = requests.post(
        'http://localhost:3000/api/generate',
        json={
            'prompt': prompt,
            'websiteType': 'ecommerce',
            'saveToDatabase': True
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print('Generated:', data['html'][:100])
        return data
    else:
        print('Error:', response.json())

generate_website('Build an e-commerce site for jewelry')
```

### cURL

```bash
# Generate website
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a landing page","websiteType":"landing","saveToDatabase":true}'

# List websites
curl http://localhost:3000/api/websites?limit=5

# Get specific website
curl http://localhost:3000/api/websites/507f1f77bcf86cd799439011

# Delete website
curl -X DELETE http://localhost:3000/api/websites/507f1f77bcf86cd799439011
```

## Best Practices

1. **Descriptive Prompts**: Be specific about layout, colors, sections
2. **Error Handling**: Always handle both success and error responses
3. **Fallback Logic**: System provides templates when AI fails
4. **Save Selectively**: Only save to database when needed to conserve storage
5. **Pagination**: Use limit parameter for large datasets

## Future Enhancements

- [ ] Authentication and user accounts
- [ ] API key management
- [ ] Webhook support for async generation
- [ ] Batch generation endpoint
- [ ] Custom template upload
- [ ] A/B testing support
- [ ] Analytics integration
