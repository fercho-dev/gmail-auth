import { NextResponse } from 'next/server';
import { headers } from "next/headers";

const SPOTIFY_ME_ENDPOINT = "https://api.spotify.com/v1/me";

export async function GET(req) {
  const headersList = headers();
  const authToken = headersList.get("authorization");
  try {
    const res = await fetch(SPOTIFY_ME_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    return NextResponse.json({ json })
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
