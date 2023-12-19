import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge'

export async function POST(req) {
  const { messages } = await req.json()

  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    stream: true,
  });

  const stream = OpenAIStream(initialResponse);

  return new StreamingTextResponse(stream);
}
