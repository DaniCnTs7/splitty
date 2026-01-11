import { auth } from '@/auth'
import connectDB from '@/lib/db/mongoose'
import { NextResponse, NextRequest } from 'next/server'
import { Session } from 'next-auth'

interface RouteContext {
  params: Promise<Record<string, string | string[] | undefined>>
}

type AuthenticatedHandler = (
  req: NextRequest,
  context: { params: any; session: Session }
) => Promise<Response> | Promise<Response>

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      await connectDB()

      const session = await auth()

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const response = await handler(req, { ...context, session })

      if (!response) {
        return NextResponse.json({ error: 'No response from handler' }, { status: 500 })
      }

      return await handler(req, { ...context, session })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  }
}
