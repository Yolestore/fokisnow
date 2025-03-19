import { Express } from "express";
import { supabase } from './client';
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express) {
  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      // First create auth user in Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: req.body.email,
        password: req.body.password,
      });

      if (signUpError) {
        return res.status(400).json({ message: signUpError.message });
      }

      // Then create user in our users table
      const { data: user, error: createError } = await supabase
        .from('users')
        .insert([{
          username: req.body.username,
          email: req.body.email,
          password: req.body.password, // We'll store this to use with local auth too
          isAdmin: false,
          twoFactorEnabled: false
        }])
        .select()
        .single();

      if (createError) {
        return res.status(400).json({ message: createError.message });
      }

      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      // First try Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.password,
      });

      if (authError) {
        // If Supabase auth fails, try local auth
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', req.body.email)
          .eq('password', req.body.password)
          .single();

        if (userError || !users) {
          return res.status(401).json({ message: "Echèk otantifikasyon" });
        }

        // Update last login
        await supabase
          .from('users')
          .update({ lastLogin: new Date() })
          .eq('id', users.id);

        return res.json(users);
      }

      // Get user from our users table
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', req.body.email)
        .single();

      // Update last login
      await supabase
        .from('users')
        .update({ lastLogin: new Date() })
        .eq('email', req.body.email);

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.sendStatus(200);
  });

  app.get("/api/user", async (req, res) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return res.sendStatus(401);
      }

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      res.json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // Admin-only middleware
  app.use("/api/admin/*", async (req, res, next) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return res.status(401).json({ message: "Non otorize" });
      }

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Aksè entèdi" });
      }

      next();
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });
}