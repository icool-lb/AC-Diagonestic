
CREATE TABLE IF NOT EXISTS faults (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  technology TEXT NOT NULL,
  series TEXT NOT NULL,
  model_family TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  diagnostic_level TEXT NOT NULL,
  source_key TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  confidence TEXT NOT NULL,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_faults_brand ON faults(brand);
CREATE INDEX IF NOT EXISTS idx_faults_code ON faults(code);
CREATE INDEX IF NOT EXISTS idx_faults_series ON faults(series);
