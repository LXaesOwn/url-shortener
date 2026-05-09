CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    share_url VARCHAR(255) NOT NULL,
    stats_url VARCHAR(255) NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS click_statistics (
    id SERIAL PRIMARY KEY,
    url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    region VARCHAR(500),
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_url_id ON click_statistics(url_id);
CREATE INDEX IF NOT EXISTS idx_clicked_at ON click_statistics(clicked_at);