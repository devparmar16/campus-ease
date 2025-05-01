import { createClient } from '@supabase/supabase-js'

// Read from .env (Vite prefixes must be `VITE_`)
const supabaseUrl = "https://pjgxfrxroitqvqevxeku.supabase.co";
const supabaseAnonKey =" eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ3hmcnhyb2l0cXZxZXZ4ZWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzY2MjAsImV4cCI6MjA1OTQxMjYyMH0.gG8kIkT7KzZ_7ykwRgYryycXvj_e7TF_xEMlFIZVp90";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
