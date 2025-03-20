import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertMediaSchema, users } from "@shared/schema";
import { setupAuth } from "./auth";
import { db } from "./db";
import * as jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import helmet from 'helmet';
import path from 'path';
import express from 'express';

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  next(); // Remove auth check temporarily
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup security headers with YouTube allowed
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
        connectSrc: ["'self'", "https:", "http:"],
        fontSrc: ["'self'", "data:", "https:", "http:"],
        mediaSrc: ["'self'", "https:", "http:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }));

  // API Routes
  setupAuth(app);

  // Posts
  app.get("/api/posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getPosts(category as string | undefined);
      res.json(posts);
    } catch (error: any) {
      console.error('Error getting posts:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Atik pa jwenn" });
      }
      res.json(post);
    } catch (error: any) {
      console.error('Error getting post:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/posts", isAdmin, async (req, res) => {
    try {
      console.log('Creating post with data:', req.body);
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      console.log('Created post:', post);
      res.json(post);
    } catch (error: any) {
      console.error('Error creating post:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/posts/:id", isAdmin, async (req, res) => {
    try {
      const post = await storage.updatePost(parseInt(req.params.id), req.body);
      if (!post) {
        return res.status(404).json({ message: "Atik pa jwenn" });
      }
      res.json(post);
    } catch (error: any) {
      console.error('Error updating post:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/posts/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deletePost(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Atik pa jwenn" });
      }
      res.json({ message: "Atik efase avèk siksè" });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Comments
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(parseInt(req.params.postId));
      res.json(comments);
    } catch (error: any) {
      console.error('Error getting comments:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/comments/:id/approve", isAdmin, async (req, res) => {
    try {
      const comment = await storage.approveComment(parseInt(req.params.id));
      if (!comment) {
        return res.status(404).json({ message: "Kòmantè pa jwenn" });
      }
      res.json(comment);
    } catch (error: any) {
      console.error('Error approving comment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/comments/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteComment(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Kòmantè pa jwenn" });
      }
      res.json({ message: "Kòmantè efase avèk siksè" });
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Media
  app.get("/api/media", async (req, res) => {
    try {
      const { category } = req.query;
      const media = await storage.getMedia(category as string | undefined);
      res.json(media);
    } catch (error: any) {
      console.error('Error getting media:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/media", isAdmin, async (req, res) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.json(media);
    } catch (error: any) {
      console.error('Error creating media:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Media Interactions
  app.get("/api/media/:id/likes", async (req, res) => {
    try {
      const count = await storage.getMediaLikes(parseInt(req.params.id));
      res.json({ count });
    } catch (error: any) {
      console.error('Error getting media likes:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/media/:id/like", async (req, res) => {
    try {
      await storage.likeMedia(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error liking media:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/media/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getMediaComments(parseInt(req.params.id));
      res.json(comments);
    } catch (error: any) {
      console.error('Error getting media comments:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/media/:id/comments", async (req, res) => {
    try {
      const comment = await storage.createMediaComment(parseInt(req.params.id), req.body.text);
      res.json(comment);
    } catch (error: any) {
      console.error('Error creating media comment:', error);
      res.status(500).json({ message: error.message });
    }
  });


  // Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      // TODO: Add email to newsletter list
      // This is where you'd integrate with your email service

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/media/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteMedia(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Medya pa jwenn" });
      }
      res.json({ message: "Medya efase avèk siksè" });
    } catch (error: any) {
      console.error('Error deleting media:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Serve static files from the frontend build
  app.use(express.static(path.join(process.cwd(), 'dist/public')));

  // Catch-all route to serve index.html for client-side routing
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}