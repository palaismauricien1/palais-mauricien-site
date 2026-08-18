-- ============================================================
--  ACTIVER LE TEMPS RÉEL sur site_config (Palais Mauricien)
--  À exécuter UNE SEULE FOIS dans Supabase → SQL Editor.
--  Permet la mise à jour instantanée du site public quand
--  l'admin modifie le menu / les plats du jour / les portions.
--  (Sans ça, le site se met quand même à jour, mais toutes
--   les 60 s via le polling de secours + au retour sur l'onglet.)
-- ============================================================

alter publication supabase_realtime add table public.site_config;

-- Vérification (doit lister site_config) :
--   select tablename from pg_publication_tables
--   where pubname = 'supabase_realtime';
