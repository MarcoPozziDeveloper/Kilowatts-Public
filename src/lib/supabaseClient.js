//develop
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://tvkfihwxjylyknspasmk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2a2ZpaHd4anlseWtuc3Bhc21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTkxNDcsImV4cCI6MjA2OTM3NTE0N30.aaBGR2UdZxSv6hHCX-a7j4DZ4R5S68KiOfkJgj8iSyo"
);
