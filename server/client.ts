import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
}

export const supabase = createClient(supabaseUrl!, supabaseKey!);


// Basic login function (replace with more robust authentication)
export async function login(email, password) {
  try {
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return null; // Or throw the error, depending on your error handling
    }

    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}