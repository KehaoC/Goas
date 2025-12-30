import Link from "next/link";

// Placeholder - will be replaced with actual data fetching
async function getCards() {
  return [];
}

export default async function CardsPage() {
  const cards = await getCards();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-gray-600 hover:text-gray-900">
            ← 返回
          </Link>
          <h1 className="text-xl font-semibold">我的 Cards</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">还没有保存任何 Card</h2>
            <p className="text-gray-500 mb-6">在与 AI 对话时，可以将有价值的内容保存为 Card</p>
            <Link
              href="/explore"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              开始探索
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card: { id: string; title: string; content: string; sourceAgent: string }) => (
              <div key={card.id} className="bg-white rounded-lg border p-4">
                <h3 className="font-medium">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{card.content}</p>
                <div className="text-xs text-gray-400 mt-2">来源: {card.sourceAgent}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
