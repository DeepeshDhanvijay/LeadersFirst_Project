import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const website = await DatabaseService.getWebsite(params.id)

    if (!website) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      website
    })
  } catch (error: any) {
    console.error('Get website error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await DatabaseService.deleteWebsite(params.id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Website deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete website error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
