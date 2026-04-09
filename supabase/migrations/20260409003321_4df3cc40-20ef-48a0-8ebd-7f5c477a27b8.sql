
CREATE POLICY "Anyone can insert checklist items"
  ON public.checklist_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete checklist items"
  ON public.checklist_items FOR DELETE
  TO anon, authenticated
  USING (true);
