import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/creatsetup')
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage = req.nextUrl.pathname === '/creatsetup/login'
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  if (isAuthRoute || isLoginPage) {
    return NextResponse.next()
  }

  // Protect admin API routes — return 401
  if (isAdminApi && !req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Protect admin pages — redirect to login
  if (isAdminRoute && !req.auth) {
    const loginUrl = new URL('/creatsetup/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/creatsetup/:path*', '/api/admin/:path*'],
}
