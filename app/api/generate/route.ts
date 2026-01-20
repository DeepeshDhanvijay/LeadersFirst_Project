import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/aiService'
import { DatabaseService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, websiteType, saveToDatabase } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate website using AI
    const result = await AIService.generateWebsite({ prompt, websiteType })

    // If AI generation fails, use fallback template
    if (!result.success || !result.html) {
      console.log('AI generation failed, using fallback template')
      result.html = AIService.generateFallbackWebsite(prompt, websiteType)
      result.success = true
      result.error = undefined
    }

    // Optionally save to database
    let websiteId: string | undefined
    if (saveToDatabase && result.success) {
      try {
        websiteId = await DatabaseService.saveWebsite({
          title: `Generated Website - ${new Date().toLocaleString()}`,
          description: prompt,
          prompt,
          websiteType: websiteType || 'general',
          htmlCode: result.html,
          cssCode: result.css
        })
      } catch (dbError) {
        console.error('Database save error:', dbError)
        // Don't fail the request if database save fails
      }
    }

    return NextResponse.json({
      success: true,
      html: result.html,
      css: result.css,
      websiteId
    })

  } catch (error: any) {
    console.error('Generate API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate website',
        fallback: true
      },
      { status: 500 }
    )
  }
}
