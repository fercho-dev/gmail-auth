import { NextResponse } from 'next/server';
import { headers } from "next/headers";

const SPOTIFY_ME_ENDPOINT = "https://api.spotify.com/v1/me";

const getToken = (authToken) => {

  if (!authToken) {
    throw new Error("No authorization header provided");
  }

  // Bearer eyJhbGciOiJIUzI1(...)
  const [type, token] = authToken.split(" ");

  if (type !== "Bearer") {
    throw new Error("Authorization type must be Bearer");
  }

  return token;
};

export async function GET(req) {
  const headersList = headers();
  const authToken = headersList.get("authorization");
  const token = getToken(authToken);
  try {
    const res = await fetch(SPOTIFY_ME_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    return NextResponse.json({ json })
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
