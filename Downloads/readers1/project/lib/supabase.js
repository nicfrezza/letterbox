// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl= 'https://amibtygfptvjdnmzaqpy.supabase.co';
const supabaseAnonKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaWJ0eWdmcHR2amRubXphcXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDA0NjIsImV4cCI6MjA1MzgxNjQ2Mn0.RIRldlCCSJG7joOernnUquM0MMf235LRhXyRGFj1XcQ';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
  }
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
