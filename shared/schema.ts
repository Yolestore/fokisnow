import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(true),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  type: text("type").notNull().default('article'), // 'article', 'video', 'podcast'
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  keywords: text("keywords").array(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: text("type").notNull(), // 'image', 'video', 'podcast', 'pdf'
  description: text("description"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  postId: integer("post_id").references(() => posts.id),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references((): ReturnType<typeof serial> => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email format"),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Category = typeof categories.$inferSelect;