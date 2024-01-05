import { getUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json({ });
  } else {
    return NextResponse.json({name: user.name, image: user.image});
  }
}