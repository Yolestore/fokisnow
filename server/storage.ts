import { supabase } from './client';
import { 
  users, posts, comments, media, categories,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type Media, type InsertMedia,
  type Category, type InsertCategory
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

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([insertUser])
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create user');
    return data as User;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update({ lastLogin: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Post;
  }

  async getPosts(category?: string): Promise<Post[]> {
    let query = supabase.from('posts').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return (data || []) as Post[];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create post');
    return data as Post;
  }

  async updatePost(id: number, postUpdate: Partial<Post>): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...postUpdate, updatedAt: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Post;
  }

  async deletePost(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('postId', postId);

    if (error) throw new Error(error.message);
    return (data || []) as Comment[];
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create comment');
    return data as Comment;
  }

  async approveComment(id: number): Promise<Comment | undefined> {
    const { data, error } = await supabase
      .from('comments')
      .update({ approved: true, updatedAt: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Media
  async getMedia(category?: string): Promise<Media[]> {
    let query = supabase.from('media').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return (data || []) as Media[];
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    const { data, error } = await supabase
      .from('media')
      .insert([media])
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create media');
    return data as Media;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    return !error;
  }
}

export const storage = new SupabaseStorage();