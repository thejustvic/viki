import {createAdmin} from '@/utils/supabase-utils/supabase-server-admin'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabaseAdmin = createAdmin()
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  const {
    data: {user},
    error
  } = await supabaseAdmin.auth.admin.getUserById(id ?? '')

  return NextResponse.json(error ?? user)
}
