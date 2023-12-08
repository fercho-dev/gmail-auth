import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session'

export async function GET(req) {
  const user = await getUserSession()
  if(!user) {
    // const loginUrl = new URL('/api/auth/signin', req.url);
    // return NextResponse.redirect(loginUrl);
    // return error
    return NextResponse.error(new Error('Not authorized'), { status: 401 });
  } else {
    const userId = user.email;
    const data = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages?maxResults=3`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    })
      .then(res => res.json())
    return NextResponse.json({ data });
  }
}
