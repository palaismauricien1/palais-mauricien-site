-- ============================================================
-- FIX RLS — table visits (Palais Mauricien)
-- À exécuter UNE FOIS dans Supabase Studio → SQL Editor
-- ============================================================
-- Problème détecté lors de l'audit du 2026-05-03 :
--   - INSERT anonyme dans `visits` → bloqué par RLS
--   - SELECT anonyme dans `visits` → renvoie []
-- Conséquence : le compteur de visites du dashboard admin
-- affiche toujours 0, et aucune visite n'est enregistrée.
--
-- Correctif : autoriser tout le monde (anon + authentifié) à
-- INSÉRER une visite, et autoriser uniquement les admins
-- authentifiés à LIRE les statistiques.
-- ============================================================

-- 1) Activer RLS si pas déjà actif (no-op si déjà activé)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- 2) Supprimer d'éventuelles policies existantes (idempotent)
DROP POLICY IF EXISTS "visits_insert_public" ON public.visits;
DROP POLICY IF EXISTS "visits_select_admin"  ON public.visits;

-- 3) Tout le monde peut INSÉRER une visite (anon + auth)
CREATE POLICY "visits_insert_public"
ON public.visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4) Seuls les utilisateurs authentifiés peuvent LIRE
--    (le dashboard admin est appelé après login Supabase Auth)
CREATE POLICY "visits_select_admin"
ON public.visits
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- VÉRIFICATION (optionnel) — exécuter après les CREATE POLICY
-- ============================================================
-- SELECT polname, cmd, roles, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'visits';
