import { db } from "./db";
import { 
  users, posts, comments, media, categories,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type Media, type InsertMedia,
  type Category, type InsertCategory
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;

  // Posts
  getPost(id: number): Promise<Post | undefined>;
  getPosts(category?: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Comments
  getComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: number): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;

  // Media
  getMedia(category?: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPosts(category?: string): Promise<Post[]> {
    let query = db.select().from(posts).where(eq(posts.published, true));

    if (category) {
      query = query.where(eq(posts.category, category));
    }

    return await query;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    if (!newPost) throw new Error('Failed to create post');
    return newPost;
  }

  async updatePost(id: number, postUpdate: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set({ ...postUpdate, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return !!deleted;
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    if (!newComment) throw new Error('Failed to create comment');
    return newComment;
  }

  async approveComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db
      .update(comments)
      .set({ approved: true, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    return !!deleted;
  }

  // Media
  async getMedia(category?: string): Promise<Media[]> {
    let query = db.select().from(media);

    if (category) {
      query = query.where(eq(media.category, category));
    }

    return await query;
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaItem).returning();
    if (!newMedia) throw new Error('Failed to create media');
    return newMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(media)
      .where(eq(media.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();