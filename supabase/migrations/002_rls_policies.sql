-- RLS per anonimo (token) e admin

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subdimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reliability_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonimo: può creare e leggere solo la propria sessione
CREATE OR REPLACE FUNCTION current_session_token() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.headers', true)::json->>'x-ili-token', '');
$$ LANGUAGE sql STABLE;

CREATE POLICY assessments_anon_insert ON assessments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY assessments_anon_select ON assessments FOR SELECT TO anon USING (session_token = current_session_token());
CREATE POLICY assessments_anon_update ON assessments FOR UPDATE TO anon USING (session_token = current_session_token());

CREATE POLICY answers_anon_insert ON answers FOR INSERT TO anon WITH CHECK (EXISTS (
  SELECT 1 FROM assessments WHERE assessments.id = answers.assessment_id AND assessments.session_token = current_session_token()
));
CREATE POLICY answers_anon_update ON answers FOR UPDATE TO anon USING (EXISTS (
  SELECT 1 FROM assessments WHERE assessments.id = answers.assessment_id AND assessments.session_token = current_session_token()
));

-- Admin: tutto
CREATE POLICY admin_all_assessments ON assessments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_answers ON answers FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_area_scores ON area_scores FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_subdimensions ON subdimension_scores FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_reliability ON reliability_checks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_notes ON consultant_notes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
CREATE POLICY admin_all_audit ON audit_logs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid())
);
