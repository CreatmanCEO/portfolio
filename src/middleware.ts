import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/creatsetup')
  const isLoginPage = req.nextUrl.pathname === '/creatsetup/login'
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  // Don't protect auth API routes or login page
  if (isAuthRoute || isLoginPage) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminRoute && !req.auth) {
    const loginUrl = new URL('/creatsetup/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/creatsetup/:path*'],
}
