import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session')?.value

  if (!userSession && (request.nextUrl.pathname.startsWith('/booking') || request.nextUrl.pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (userSession) {
    try {
      const userData = JSON.parse(decodeURIComponent(userSession))
      const response = NextResponse.next()
      response.headers.set('x-user-id', userData.id)
      return response
    } catch (error) {
      console.error('Error parsing user session:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/booking/:path*', '/profile/:path*']
}
