-- Milestone 3: schema database Supabase

-- Utenti amministratori/consulenti
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'consultant')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assessment
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  sector TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  years_in_business TEXT NOT NULL,
  employees TEXT NOT NULL,
  revenue_band TEXT NOT NULL,
  referring_consultant TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  privacy_version TEXT NOT NULL,
  privacy_consented_at TIMESTAMPTZ,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  active_ms BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'archived')),
  ili NUMERIC(6,2),
  dependency_index NUMERIC(6,2),
  ili_level TEXT,
  bottleneck TEXT,
  iar NUMERIC(6,2),
  iar_status TEXT,
  followup_status TEXT NOT NULL DEFAULT 'new' CHECK (followup_status IN ('new', 'to_analyze', 'meeting_scheduled', 'delivered', 'follow_up')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_token ON assessments(session_token);
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- Risposte
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  raw_value TEXT NOT NULL,
  normalized_value NUMERIC(6,2),
  changed_count INTEGER NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_assessment ON answers(assessment_id);

-- Punteggi per area
CREATE TABLE IF NOT EXISTS area_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  score NUMERIC(6,2) NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, area)
);

CREATE INDEX IF NOT EXISTS idx_area_scores_assessment ON area_scores(assessment_id);

-- Punteggi per sottodimensione
CREATE TABLE IF NOT EXISTS subdimension_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  subdimension TEXT NOT NULL,
  score NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, area, subdimension)
);

CREATE INDEX IF NOT EXISTS idx_subdimension_scores_assessment ON subdimension_scores(assessment_id);

-- Controllo attendibilità
CREATE TABLE IF NOT EXISTS reliability_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  score NUMERIC(6,2) NOT NULL,
  alerts JSONB,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, component)
);

CREATE INDEX IF NOT EXISTS idx_reliability_assessment ON reliability_checks(assessment_id);

-- Note consulente
CREATE TABLE IF NOT EXISTS consultant_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
  notes TEXT,
  priority_90 JSONB,
  follow_up_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultant_notes_assessment ON consultant_notes(assessment_id);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
