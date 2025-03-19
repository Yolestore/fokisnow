import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertMediaSchema } from "@shared/schema";

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  const user = await storage.getUserByUsername(req.session?.username);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      req.session.username = user.username;
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.username = user.username;
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.username) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserByUsername(req.session.username);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user });
  });

  // Posts
  app.get("/api/posts", async (req, res) => {
    const { category } = req.query;
    const posts = await storage.getPosts(category as string | undefined);
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPost(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.post("/api/posts", isAdmin, async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.patch("/api/posts/:id", isAdmin, async (req, res) => {
    try {
      const post = await storage.updatePost(parseInt(req.params.id), req.body);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.delete("/api/posts/:id", isAdmin, async (req, res) => {
    const success = await storage.deletePost(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  });

  // Comments
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.getComments(parseInt(req.params.postId));
    res.json(comments);
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  app.patch("/api/comments/:id/approve", isAdmin, async (req, res) => {
    const comment = await storage.approveComment(parseInt(req.params.id));
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  });

  app.delete("/api/comments/:id", isAdmin, async (req, res) => {
    const success = await storage.deleteComment(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  });

  // Media
  app.get("/api/media", async (req, res) => {
    const { category } = req.query;
    const media = await storage.getMedia(category as string | undefined);
    res.json(media);
  });

  app.post("/api/media", isAdmin, async (req, res) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.json(media);
    } catch (error) {
      res.status(400).json({ message: "Invalid media data" });
    }
  });

  app.delete("/api/media/:id", isAdmin, async (req, res) => {
    const success = await storage.deleteMedia(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Media not found" });
    }
    res.json({ message: "Media deleted successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}