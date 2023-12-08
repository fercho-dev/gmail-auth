import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session'

export async function GET(req) {
  const user = await getUserSession()
  if(!user) {
    return NextResponse.error(new Error('Not authorized'), { status: 401 });
  } else {
    return NextResponse.json({ token: user.access_token, token_type: 'Bearer', scope: 'read' });
  }
}
