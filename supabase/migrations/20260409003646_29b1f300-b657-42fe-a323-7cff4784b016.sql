
-- Add user_id column
ALTER TABLE public.checklist_items 
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove old sample data (no user assigned)
DELETE FROM public.checklist_items WHERE user_id IS NULL;

-- Make user_id NOT NULL going forward
ALTER TABLE public.checklist_items ALTER COLUMN user_id SET NOT NULL;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can read checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can update checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can insert checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can delete checklist items" ON public.checklist_items;

-- User-specific policies
CREATE POLICY "Users can view their own items"
  ON public.checklist_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON public.checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.checklist_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.checklist_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
