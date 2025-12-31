import { Card, getCards } from '@/services/card';
import { useState, useEffect } from 'react'
export default function CardsLibrary() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchCards() {
        setLoading(true);
        const data = await getCards({ limit: 50 });
        setCards(data);
        setLoading(false);
      }
      fetchCards();
    }, []);
  
    return (
      <div className="p-6 min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-14 h-14 flex items-center justify-center text-3xl bg-ink-blue/10 border-2 border-ink-blue"
            style={{ borderRadius: "var(--wobbly-circle)" }}
          >
            📁
          </div>
          <div>
            <h1 className="text-3xl font-heading text-pencil">卡片库</h1>
            <p className="text-muted-foreground font-body">保存的灵感与素材</p>
          </div>
        </div>
  
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border-2 border-pencil/30 p-4 animate-pulse"
                style={{ borderRadius: "var(--wobbly-md)" }}
              >
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted/50 rounded w-full mb-2" />
                <div className="h-4 bg-muted/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="inline-block p-8 bg-ink-blue/5 border-2 border-dashed border-ink-blue/30 mb-6"
              style={{ borderRadius: "var(--wobbly-md)" }}
            >
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-xl font-heading text-pencil mb-2">还没有保存任何卡片</h2>
              <p className="text-muted-foreground font-body max-w-sm mx-auto">
                在使用其他功能时，可以将有价值的内容保存为卡片，方便后续查阅
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="bg-card border-2 border-pencil overflow-hidden hover:shadow-hand transition-all duration-100 cursor-pointer group"
                style={{
                  borderRadius: "var(--wobbly-md)",
                  boxShadow: "var(--shadow-soft)",
                  transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`
                }}
              >
                {card.imageUrl && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-heading text-lg text-pencil mb-2 group-hover:text-ink-blue transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm line-clamp-3 mb-3">
                    {card.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span
                      className="px-2 py-0.5 bg-secondary border border-pencil/30"
                      style={{ borderRadius: "var(--wobbly-sm)" }}
                    >
                      {card.sourceAgent}
                    </span>
                    <span>{card.createdAt ? new Date(card.createdAt).toLocaleDateString('zh-CN') : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }