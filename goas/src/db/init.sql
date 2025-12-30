-- Goas Database Initialization

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source_agent VARCHAR(100) NOT NULL,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at DESC);

-- Hotspots table
CREATE TABLE IF NOT EXISTS hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('competitor', 'trending', 'ip', 'meme')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    source_url TEXT,
    heat_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotspots_category ON hotspots(category);
CREATE INDEX IF NOT EXISTS idx_hotspots_date ON hotspots(date DESC);

-- Threads table (for chat history)
CREATE TABLE IF NOT EXISTS threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    context_key VARCHAR(255) NOT NULL,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threads_agent_id ON threads(agent_id);
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_cards_updated') THEN
        CREATE TRIGGER trg_cards_updated BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hotspots_updated') THEN
        CREATE TRIGGER trg_hotspots_updated BEFORE UPDATE ON hotspots FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_threads_updated') THEN
        CREATE TRIGGER trg_threads_updated BEFORE UPDATE ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
END $$;

-- Seed data
INSERT INTO hotspots (category, title, description, heat_score) VALUES
    ('competitor', '某品牌新品发布会', '某知名品牌发布2025年春季新品系列', 95),
    ('competitor', '竞品价格调整', '主要竞争对手宣布全线产品降价10%', 88),
    ('trending', '微博热搜TOP1', '今日最热话题，引发全网讨论', 100),
    ('trending', '抖音热榜第一', '短视频平台最火挑战', 96),
    ('ip', '新晋顶流IP', '某新剧播出后话题持续霸榜', 92),
    ('ip', '经典IP联名', '经典动漫与潮牌联名', 89),
    ('meme', '今日最火表情包', '魔性表情包席卷社交平台', 94),
    ('meme', '网络流行语', '本周最火网络用语', 87)
ON CONFLICT DO NOTHING;
