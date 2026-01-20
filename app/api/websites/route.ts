import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const websites = await DatabaseService.getAllWebsites(limit)

    return NextResponse.json({
      success: true,
      websites
    })
  } catch (error: any) {
    console.error('Get websites error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
