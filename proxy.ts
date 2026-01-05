import { auth } from '@/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isHomePage = nextUrl.pathname === '/'
  const isInvitePage = nextUrl.pathname.startsWith('/invite/')
  const isLoginPage = nextUrl.pathname === '/login'
  const isPublicRoute = isHomePage || isInvitePage || isLoginPage

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
