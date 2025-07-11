import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qjwscxnabeccmwamkzft.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqd3NjeG5hYmVjY213YW1remZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODA3OTcsImV4cCI6MjA2NzY1Njc5N30.ijJmDr-OjrX2fJ7ah9_RMS1OSyLSTM7VP4Ydq_2QutU"
);
