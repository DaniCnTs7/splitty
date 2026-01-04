// middleware.ts
import { auth } from '@/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Definimos las rutas públicas
  const isHomePage = nextUrl.pathname === '/'
  const isInvitePage = nextUrl.pathname.startsWith('/invite/')
  const isLoginPage = nextUrl.pathname === '/login'
  const isPublicRoute = isHomePage || isInvitePage || isLoginPage

  // Si no está logueado y la ruta NO es pública, redirigir a login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl))
  }
})

// El matcher indica qué rutas activan el middleware.
// Usamos este para que ignore archivos estáticos y la API interna.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
