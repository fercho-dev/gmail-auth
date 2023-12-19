import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/session";

export async function GET(req) {
  const user = await getUserSession();

  if (!user) {
    const loginUrl = new URL("/api/auth/signin", req.url);
    return NextResponse.redirect(loginUrl);
  } else {
    const token = user.access_token;
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread -label:spam -category:social -category:promotions&maxResults=10",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error getting the messages: ${response.status}`);
    }

    const data = await response.json();

    const messageDetails = await Promise.all(
      data.messages.map(async (message) => {
        const messageResponse = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!messageResponse.ok) {
          throw new Error(
            `Error getting details of the messages: ${messageResponse.status}`
          );
        }

        const messageData = await messageResponse.json();
        return {
          // id: message.id,
          subject: messageData.payload.headers.find(
            (header) => header.name === "Subject"
          ).value,
          body: messageData.snippet,
        };
      })
    );

    const combinedString = messageDetails
      .map((message) => {
        return `subject: ${message.subject} body: ${message.body}`;
      })
      .join("\n\n");

    return NextResponse.json({ messages: combinedString });
  }
}
