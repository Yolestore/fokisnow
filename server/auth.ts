import { Express } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fokis-secret-key';

export function setupAuth(app: Express) {
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      console.log('Registration attempt with:', { ...req.body, password: '[REDACTED]' });
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        console.log('User already exists:', email);
        return res.status(400).json({ message: "Itilizatè sa deja egziste" });
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
        twoFactorEnabled: false,
      }).returning();

      console.log('Created new user:', { ...newUser, password: '[REDACTED]' });

      // Generate JWT token
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

      res.status(201).json({ user: newUser, token });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      console.log('Login attempt with:', { ...req.body, password: '[REDACTED]' });
      const { email, password } = req.body;

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email));
      console.log('Found user:', user ? { ...user, password: '[REDACTED]' } : 'Not found');

      if (!user) {
        return res.status(401).json({ message: "Imel oswa modpas pa kòrèk" });
      }

      // Verify password
      const isValid = await compare(password, user.password);
      console.log('Password validation:', isValid ? 'success' : 'failed');

      if (!isValid) {
        return res.status(401).json({ message: "Imel oswa modpas pa kòrèk" });
      }

      // Update last login
      await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({ user, token });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get current user endpoint
  app.get("/api/user", async (req, res) => {
    try {
      console.log('Getting current user, headers:', req.headers);
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token pa jwenn" });
      }

      const token = authHeader.split(' ')[1];
      console.log('Token:', token);

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      console.log('Decoded token:', decoded);

      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      console.log('Found user:', user ? { ...user, password: '[REDACTED]' } : 'Not found');

      if (!user) {
        return res.status(404).json({ message: "Itilizatè pa jwenn" });
      }

      res.json(user);
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(401).json({ message: "Token envalid" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    res.json({ message: "Dekonekte avèk siksè" });
  });
}