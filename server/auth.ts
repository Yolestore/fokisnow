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
      const { error: signUpError } = await supabase.auth.signUp({
        email: req.body.email,
        password: req.body.password,
        options: {
          data: {
            username: req.body.username,
            isAdmin: false,
            twoFactorEnabled: false
          }
        }
      });

      if (signUpError) {
        return res.status(400).json({ message: signUpError.message });
      }

      // Create user in our users table
      const { data: user, error: createError } = await supabase
        .from('users')
        .insert([{
          username: req.body.username,
          email: req.body.email,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.password,
      });

      if (error) {
        return res.status(401).json({ message: "Echèk otantifikasyon" });
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
  });

  // Admin-only middleware
  app.use("/api/admin/*", async (req, res, next) => {
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
  });
}