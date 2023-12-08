import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';

function base64urlToBase64(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  const pad = base64.length % 4;
  if (pad) {
      if (pad === 1) {
          throw new Error('Longitud de string base64url inválida');
      }
      base64 += new Array(5 - pad).join('=');
  }

  return base64;
}

function decodeBase64urlToText(base64url) {
  const base64 = base64urlToBase64(base64url);
  const decoded = atob(base64);
  return decoded;
}

const fetchMessageById = (id, userId, accessToken) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}?format=full`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Error al recuperar el mensaje con ID: ${id}`);
    }
    return response.json();
  });
};

export async function GET(request) {
  const user = await getUserSession()
  if(!user) {
    const loginUrl = new URL('/api/auth/signin', req.url);
    return NextResponse.redirect(loginUrl);
  } else {
    const maxRes = request.nextUrl.searchParams.get('maxResults') || 2;
    const labelIds = request.nextUrl.searchParams.get('labelIds') || ['UNREAD'];

    const userId = user.email;
    const data = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages?maxResults=${maxRes}&labelIds=${labelIds.join(', ')}`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`
      }
    })
      .then(res => res.json())
      .catch(err => {
        return NextResponse.json({ error: err.message });
      });

    if(data.error) {
      return NextResponse.json({ error: data.error });
    }
    
    const ids = data.messages.map(mes => mes.id)

    const results = await Promise.allSettled(ids.map(id => fetchMessageById(id, userId, user.access_token)));

    const successfulMessages = results
      .filter(result => result.status === 'fulfilled')
      .map(result => {
        const header = result.value.payload.headers.filter(head => head.name === 'Subject')
        const snippet = result.value.snippet
        const body = result.value.payload.body.size === 0 ? '' : decodeBase64urlToText(result.value.payload.body.data)
        return { header, snippet, body }
      });

    return NextResponse.json({ messages: successfulMessages });
  }
}
