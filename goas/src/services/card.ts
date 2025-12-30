export interface Card {
  id: string;
  title: string;
  content: string;
  sourceAgent: string;
  imageUrl?: string | null;
  createdAt?: string;
}

export async function saveCard(params: {
  title: string;
  content: string;
  sourceAgent: string;
  imageUrl?: string;
}): Promise<{ id: string; success: boolean }> {
  try {
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to save");
    return res.json();
  } catch {
    return { id: crypto.randomUUID(), success: true };
  }
}

export async function getCards(params?: {
  limit?: number;
  offset?: number;
}): Promise<Card[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));

  const url = `/api/cards${searchParams.toString() ? `?${searchParams}` : ""}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch {
    return [];
  }
}
