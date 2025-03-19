import { Express } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fokis-secret-key';

export function setupAuth(app: Express) {
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
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

      // Generate JWT token
      const token = sign({ userId: newUser.id }, JWT_SECRET);

      res.status(201).json({ user: newUser, token });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user) {
        return res.status(401).json({ message: "Imel oswa modpas pa kòrèk" });
      }

      // Verify password
      const isValid = await compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Imel oswa modpas pa kòrèk" });
      }

      // Update last login
      await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const token = sign({ userId: user.id }, JWT_SECRET);

      res.json({ user, token });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get current user endpoint
  app.get("/api/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token pa jwenn" });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verify(token, JWT_SECRET) as { userId: number };

      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
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

  // Admin-only middleware (retained as it's independent of the auth method)
  app.use("/api/admin/*", async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token pa jwenn" });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verify(token, JWT_SECRET) as { userId: number };

      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));

      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Aksè entèdi" });
      }

      next();
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });
}