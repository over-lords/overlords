import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  "https://ioufjmuccbjlnhvvrcss.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdWZqbXVjY2JqbG5odnZyY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTc5NTgsImV4cCI6MjA3ODk3Mzk1OH0.98nzhFtS7HvYb8lmcm0gt_zTLN7N8V5Vqs0g8zwRm3g"
);