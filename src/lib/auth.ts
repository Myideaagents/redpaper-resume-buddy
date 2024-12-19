import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txbvgwrqqznojrpxurss.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YnZnd3JxcXpub2pycHh1cnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTYzMzgsImV4cCI6MjA1MDE5MjMzOH0.w_hIg7wpquswUsqExgVWk71QUEOSqpn51apsG3ATWrg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};