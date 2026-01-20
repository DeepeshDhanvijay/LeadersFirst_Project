import axios from 'axios'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
const MODEL_URL = process.env.HUGGINGFACE_MODEL_URL || 'https://router.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf'

export interface GenerateWebsiteRequest {
  prompt: string
  websiteType?: string
}

export interface GenerateWebsiteResponse {
  html: string
  css: string
  success: boolean
  error?: string
}

export class AIService {
  private static async queryHuggingFace(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        MODEL_URL,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      )

      if (response.data && Array.isArray(response.data) && response.data[0]?.generated_text) {
        return response.data[0].generated_text
      }

      return response.data?.generated_text || JSON.stringify(response.data)
    } catch (error: any) {
      console.error('HuggingFace API Error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.error || 'Failed to generate code from AI model')
    }
  }

  static async generateWebsite(request: GenerateWebsiteRequest): Promise<GenerateWebsiteResponse> {
    const { prompt, websiteType } = request

    const systemPrompt = `You are an expert web developer. Generate a complete, modern, responsive website based on the user's requirements.
    
User Request: ${prompt}
Website Type: ${websiteType || 'general'}

Generate ONLY valid HTML code with inline CSS using Tailwind CSS classes. The HTML should be:
1. Complete and ready to render
2. Fully responsive (mobile, tablet, desktop)
3. Modern and visually appealing
4. Include semantic HTML5 tags
5. Use Tailwind CSS classes for styling
6. Include realistic content relevant to the request

Return ONLY the HTML code, nothing else. Start with <!DOCTYPE html> and end with </html>.`

    try {
      const generatedCode = await this.queryHuggingFace(systemPrompt)
      
      // Extract HTML from the response
      let html = generatedCode
      
      // Try to extract HTML if it's wrapped in code blocks
      const htmlMatch = generatedCode.match(/```html\s*([\s\S]*?)\s*```/) || 
                        generatedCode.match(/```\s*(<!DOCTYPE[\s\S]*?<\/html>)\s*```/)
      
      if (htmlMatch) {
        html = htmlMatch[1]
      } else if (generatedCode.includes('<!DOCTYPE') || generatedCode.includes('<html')) {
        // Extract from <!DOCTYPE to </html>
        const startIdx = generatedCode.indexOf('<!DOCTYPE')
        const endIdx = generatedCode.lastIndexOf('</html>') + 7
        if (startIdx !== -1 && endIdx > startIdx) {
          html = generatedCode.substring(startIdx, endIdx)
        }
      }

      // Ensure Tailwind CSS CDN is included if not present
      if (!html.includes('tailwindcss')) {
        html = html.replace(
          '</head>',
          '  <script src="https://cdn.tailwindcss.com"></script>\n  </head>'
        )
      }

      return {
        html: html.trim(),
        css: '', // CSS is inline with Tailwind
        success: true
      }
    } catch (error: any) {
      console.error('AI Generation Error:', error)
      return {
        html: '',
        css: '',
        success: false,
        error: error.message
      }
    }
  }

  static generateFallbackWebsite(prompt: string, websiteType?: string): string {
    const templates: Record<string, string> = {
      portfolio: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <nav class="bg-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="text-2xl font-bold text-blue-600">Portfolio</div>
        <div class="hidden md:flex space-x-6">
          <a href="#about" class="text-gray-700 hover:text-blue-600">About</a>
          <a href="#work" class="text-gray-700 hover:text-blue-600">Work</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600">Contact</a>
        </div>
      </div>
    </div>
  </nav>

  <section class="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold mb-4">Welcome to My Portfolio</h1>
      <p class="text-xl mb-8">Showcasing creativity and innovation</p>
      <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">View My Work</button>
    </div>
  </section>

  <section id="about" class="py-20">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-8 text-center">About Me</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold mb-4">My Story</h3>
          <p class="text-gray-600">Passionate about creating beautiful and functional designs that make a difference.</p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold mb-4">Skills</h3>
          <div class="flex flex-wrap gap-2">
            <span class="bg-blue-100 text-blue-600 px-4 py-2 rounded-full">Design</span>
            <span class="bg-purple-100 text-purple-600 px-4 py-2 rounded-full">Development</span>
            <span class="bg-green-100 text-green-600 px-4 py-2 rounded-full">Photography</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="work" class="py-20 bg-gray-100">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center">My Work</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Project One</h3>
            <p class="text-gray-600">A stunning visual experience</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Project Two</h3>
            <p class="text-gray-600">Innovation meets design</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Project Three</h3>
            <p class="text-gray-600">Creative solutions</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="py-20">
    <div class="max-w-2xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-8 text-center">Get In Touch</h2>
      <form class="bg-white p-8 rounded-lg shadow-md">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Name</label>
          <input type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Message</label>
          <textarea rows="4" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Send Message</button>
      </form>
    </div>
  </section>

  <footer class="bg-gray-800 text-white py-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p>&copy; 2026 Portfolio. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`,
      
      ecommerce: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Commerce Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="text-2xl font-bold text-indigo-600">ShopNow</div>
        <div class="hidden md:flex space-x-8">
          <a href="#" class="text-gray-700 hover:text-indigo-600">Home</a>
          <a href="#" class="text-gray-700 hover:text-indigo-600">Shop</a>
          <a href="#" class="text-gray-700 hover:text-indigo-600">About</a>
          <a href="#" class="text-gray-700 hover:text-indigo-600">Contact</a>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-gray-700 hover:text-indigo-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <section class="relative h-96 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">Welcome to Our Store</h1>
        <p class="text-xl mb-8">Discover amazing handcrafted products</p>
        <button class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Shop Now</button>
      </div>
    </div>
  </section>

  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8 text-center">Featured Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-pink-200 to-pink-400"></div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">Handmade Necklace</h3>
            <p class="text-gray-600 mb-2">Beautiful handcrafted jewelry</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-indigo-600">$49.99</span>
              <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-blue-200 to-blue-400"></div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">Artisan Bracelet</h3>
            <p class="text-gray-600 mb-2">Unique design, premium quality</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-indigo-600">$39.99</span>
              <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-purple-200 to-purple-400"></div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">Silver Earrings</h3>
            <p class="text-gray-600 mb-2">Elegant and timeless</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-indigo-600">$59.99</span>
              <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-green-200 to-green-400"></div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">Designer Ring</h3>
            <p class="text-gray-600 mb-2">Exclusive collection</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-indigo-600">$89.99</span>
              <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 bg-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div class="p-6">
          <div class="text-4xl mb-4">🚚</div>
          <h3 class="text-xl font-bold mb-2">Free Shipping</h3>
          <p class="text-gray-600">On orders over $50</p>
        </div>
        <div class="p-6">
          <div class="text-4xl mb-4">🔒</div>
          <h3 class="text-xl font-bold mb-2">Secure Payment</h3>
          <p class="text-gray-600">100% secure transactions</p>
        </div>
        <div class="p-6">
          <div class="text-4xl mb-4">💎</div>
          <h3 class="text-xl font-bold mb-2">Premium Quality</h3>
          <p class="text-gray-600">Handcrafted with care</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="bg-gray-800 text-white py-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h4 class="text-xl font-bold mb-4">ShopNow</h4>
          <p class="text-gray-400">Your trusted source for handmade jewelry</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">Shop</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-white">Necklaces</a></li>
            <li><a href="#" class="hover:text-white">Bracelets</a></li>
            <li><a href="#" class="hover:text-white">Earrings</a></li>
            <li><a href="#" class="hover:text-white">Rings</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Company</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-white">About Us</a></li>
            <li><a href="#" class="hover:text-white">Contact</a></li>
            <li><a href="#" class="hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">FB</a>
            <a href="#" class="text-gray-400 hover:text-white">IG</a>
            <a href="#" class="text-gray-400 hover:text-white">TW</a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2026 ShopNow. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`
    }

    // Detect website type from prompt
    const detectedType = prompt.toLowerCase().includes('portfolio') || prompt.toLowerCase().includes('photographer') ? 'portfolio' :
                         prompt.toLowerCase().includes('ecommerce') || prompt.toLowerCase().includes('shop') || prompt.toLowerCase().includes('store') ? 'ecommerce' :
                         websiteType?.toLowerCase() || 'portfolio'

    return templates[detectedType] || templates.portfolio
  }
}
