import Link from "next/link";

// Placeholder - will be replaced with actual data fetching
async function getCards() {
  return [];
}

export default async function CardsPage() {
  const cards = await getCards();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b-[3px] border-pencil px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="btn-hand-secondary px-4 py-2 text-lg flex items-center gap-2"
          >
            <span>←</span>
            <span>返回</span>
          </Link>
          <h1 className="text-2xl font-heading text-pencil">我的 Cards</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {cards.length === 0 ? (
          <div className="text-center py-16">
            {/* Empty state with hand-drawn style */}
            <div
              className="inline-block p-8 bg-postit border-2 border-pencil shadow-hand mb-8 tape"
              style={{ borderRadius: "var(--wobbly-md)", transform: "rotate(-2deg)" }}
            >
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-heading text-pencil mb-3">还没有保存任何 Card</h2>
              <p className="text-lg text-muted-foreground font-body max-w-sm mx-auto">
                在与 AI 对话时，可以将有价值的内容保存为 Card
              </p>
            </div>

            <Link
              href="/explore"
              className="btn-hand px-6 py-3 text-xl inline-block"
            >
              开始探索
            </Link>

            {/* Decorative arrow */}
            <svg className="hidden md:inline-block ml-4 w-16 h-8 text-pencil" viewBox="0 0 64 32" fill="none">
              <path d="M5,16 Q30,5 55,16" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" fill="none"/>
              <path d="M48,12 L55,16 L48,20" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        ) : (
          <div className="grid gap-6">
            {cards.map((card: { id: string; title: string; content: string; sourceAgent: string }, index: number) => (
              <div
                key={card.id}
                className="card-hand p-6 hover:shadow-hand transition-all duration-100"
                style={{
                  transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
                  borderRadius: index % 2 === 0
                    ? "var(--wobbly-md)"
                    : "175px 35px 185px 25px / 25px 195px 25px 185px"
                }}
              >
                <h3 className="font-heading text-xl text-pencil mb-2">{card.title}</h3>
                <p className="text-base text-muted-foreground font-body line-clamp-2 mb-3">
                  {card.content}
                </p>

                {/* Source tag with postit style */}
                <div
                  className="inline-block px-3 py-1 bg-postit border border-pencil text-sm font-body"
                  style={{ borderRadius: "var(--wobbly-sm)", transform: "rotate(1deg)" }}
                >
                  来源: {card.sourceAgent}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
