// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://txbvgwrqqznojrpxurss.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YnZnd3JxcXpub2pycHh1cnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTYzMzgsImV4cCI6MjA1MDE5MjMzOH0.w_hIg7wpquswUsqExgVWk71QUEOSqpn51apsG3ATWrg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);