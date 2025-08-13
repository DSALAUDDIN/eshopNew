import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Test endpoint called')

    // Test if we can create a simple setting
    const response = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || ''
      },
      body: JSON.stringify({
        key: 'test_setting',
        value: 'test_value',
        type: 'string'
      })
    })

    const result = await response.json()
    console.log('Test setting creation result:', result)

    return NextResponse.json({
      success: true,
      testResult: result,
      message: 'Test endpoint working'
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: 'Test failed: ' + error.message
    }, { status: 500 })
  }
}
