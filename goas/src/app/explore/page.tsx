import Link from "next/link";
import { agents } from "@/config/agents";

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      {/* Header with tape decoration */}
      <header className="bg-card border-b-[3px] border-pencil px-6 py-4 flex items-center justify-between relative">
        <h1 className="text-2xl font-heading text-pencil">Goas</h1>
        <Link
          href="/cards"
          className="btn-hand px-4 py-2 text-lg"
        >
          我的 Cards
        </Link>
        {/* Decorative squiggly line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%204%22%3E%3Cpath%20d%3D%22M0%2C2%20Q5%2C0%2010%2C2%20T20%2C2%22%20stroke%3D%22%232d2d2d%22%20fill%3D%22none%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-repeat-x translate-y-full"></div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title section with hand-drawn decoration */}
        <div className="relative mb-12">
          <h2 className="text-4xl md:text-5xl font-heading text-pencil mb-3 inline-block">
            欢迎来到 Goas
            <span className="inline-block ml-2 text-ink-red animate-bounce-gentle" style={{ "--rotation": "10deg" } as React.CSSProperties}>!</span>
          </h2>
          <p className="text-xl text-muted-foreground font-body">选择一个 Agent 开始你的创意之旅</p>

          {/* Decorative arrow pointing down */}
          <svg className="hidden md:block absolute -right-16 top-8 w-20 h-20 text-pencil" viewBox="0 0 100 100" fill="none">
            <path d="M20,20 Q50,30 60,70" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
            <path d="M55,60 L60,70 L50,68" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Agent cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Link
              key={agent.id}
              href={`/agent/${agent.id}`}
              className="card-hand p-6 group hover:shadow-hand transition-all duration-100"
              style={{
                transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                borderRadius: index % 3 === 0
                  ? "var(--wobbly-md)"
                  : index % 3 === 1
                    ? "185px 35px 175px 35px / 35px 175px 35px 185px"
                    : "165px 45px 185px 25px / 25px 195px 25px 175px"
              }}
            >
              {/* Icon with organic shape background */}
              <div
                className="w-16 h-16 flex items-center justify-center text-3xl mb-4 bg-postit border-2 border-pencil"
                style={{ borderRadius: "var(--wobbly-circle)" }}
              >
                {agent.icon}
              </div>

              <h3 className="font-heading text-xl text-pencil mb-2 group-hover:text-ink-red transition-colors">
                {agent.name}
              </h3>
              <p className="text-base text-muted-foreground font-body leading-relaxed">
                {agent.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-4 text-ink-blue font-body text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                点击进入
                <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block fixed bottom-8 right-8 w-24 h-24 border-2 border-dashed border-muted rounded-full animate-bounce-gentle opacity-30"></div>
      </main>
    </div>
  );
}
