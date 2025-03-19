import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyjwjrzfgattftdncrua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5andqcnpmZ2F0dGZ0ZG5jcnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODM2MDMsImV4cCI6MjA1NzU1OTYwM30.mzV-1qPLpFWl3_h2WZU9kSNsJ3d_utqye8A3rO6SoSo';

export const supabase = createClient(supabaseUrl, supabaseKey);
