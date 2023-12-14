import querystring from "node:querystring";
import { NextResponse } from 'next/server';

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const encode = (str) => Buffer.from(str).toString("base64url")

export async function GET(req) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const clientAuth = encode(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${clientAuth}`,
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    })
  };

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, options);
    const data = await response.json();

    return NextResponse.json(data);

    // let res = NextResponse.next()
    // res.cookies.set('access_token', data.access_token, {
    //   path: '/',
    //   httpOnly: true
    // });

    // const loginUrl = new URL(`http://localhost:3000/spotifyhome`);
    // return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error(error);
  }
}
