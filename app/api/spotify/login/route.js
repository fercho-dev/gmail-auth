import querystring from "node:querystring";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
import { NextResponse } from 'next/server';

export async function GET(req) {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
  ];

  const query = querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join(" "),
    redirect_uri: process.env.REDIRECT_URI,
  });

  const loginUrl = new URL(`${SPOTIFY_AUTH_URL}?${query}`);
  return NextResponse.redirect(loginUrl);
}
