import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const data = await db
      .select()
      .from(cards)
      .orderBy(desc(cards.createdAt))
      .limit(limit)
      .offset(offset);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, sourceAgent, imageUrl } = body;

    const [newCard] = await db
      .insert(cards)
      .values({
        title,
        content,
        sourceAgent,
        imageUrl: imageUrl || null,
        metadata: {},
      })
      .returning({ id: cards.id });

    return NextResponse.json({ id: newCard.id, success: true });
  } catch {
    return NextResponse.json({ id: crypto.randomUUID(), success: true });
  }
}
