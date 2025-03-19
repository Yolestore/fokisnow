import { 
  users, posts, comments, media,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type Media, type InsertMedia
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private media: Map<number, Media>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.media = new Map();
    this.currentIds = { users: 1, posts: 1, comments: 1, media: 1 };
    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const defaultAdmin: InsertUser = {
      username: "admin",
      password: "admin123", // This should be changed in production
      email: "admin@fokis.com",
      twoFactorEnabled: false,
      isAdmin: true
    };
    const admin = await this.createUser(defaultAdmin);
    // Update admin flag
    const updatedAdmin = { ...admin, isAdmin: true };
    this.users.set(admin.id, updatedAdmin);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      isAdmin: false,
      createdAt: now,
      lastLogin: null,
      twoFactorEnabled: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPosts(category?: string): Promise<Post[]> {
    const posts = Array.from(this.posts.values());
    return category 
      ? posts.filter(post => post.category === category)
      : posts;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentIds.posts++;
    const now = new Date();
    const post: Post = { 
      ...insertPost, 
      id, 
      published: true,
      views: 0,
      createdAt: now,
      updatedAt: null,
      type: 'article',
      keywords: [],
      seoTitle: null,
      seoDescription: null
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, postUpdate: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const updatedPost = { 
      ...post, 
      ...postUpdate,
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentIds.comments++;
    const now = new Date();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      approved: false,
      createdAt: now,
      updatedAt: null
    };
    this.comments.set(id, comment);
    return comment;
  }

  async approveComment(id: number): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const updatedComment = { 
      ...comment, 
      approved: true,
      updatedAt: new Date()
    };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Media
  async getMedia(category?: string): Promise<Media[]> {
    const media = Array.from(this.media.values());
    return category
      ? media.filter(m => m.category === category)
      : media;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = this.currentIds.media++;
    const now = new Date();
    const media: Media = { 
      ...insertMedia, 
      id,
      createdAt: now
    };
    this.media.set(id, media);
    return media;
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.media.delete(id);
  }
}

export const storage = new MemStorage();