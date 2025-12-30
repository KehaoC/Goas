import Link from "next/link";
import { agents } from "@/config/agents";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Goas</h1>
        <Link href="/cards" className="text-sm text-gray-600 hover:text-gray-900">
          我的 Cards
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">欢迎来到 Goas</h2>
        <p className="text-gray-600 mb-8">选择一个 Agent 开始</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agent/${agent.id}`}
              className="bg-white rounded-lg border p-6 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="text-3xl mb-3">{agent.icon}</div>
              <h3 className="font-medium text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
