import { Session } from "next-auth";

// Basic TypeScript types for the project
export type ReactChildren = {
  children: React.ReactNode;
};

export type ClassNameProps = {
  className?: string;
};

export type BasicComponentProps = ReactChildren & ClassNameProps;

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published";
  category?: string;
  tags?: string[];
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  likeCount?: number;
  viewCount?: number;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  description?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPublished?: boolean;
  status?: "draft" | "published";
  scheduledPublishAt?: string | Date | null;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
}

// Comment Types
export interface Comment {
  _id: string;
  blogId: string;
  author: string;
  email: string;
  content: string;
  createdAt: Date;
  status: "pending" | "approved" | "spam";
  parentCommentId?: string;
}

export interface CommentFormData {
  blogId: string;
  author: string;
  email: string;
  content: string;
  parentCommentId?: string;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Subscriber Types
export interface Subscriber {
  _id: string;
  email: string;
  preferences?: {
    categories?: string[];
    frequency?: "daily" | "weekly" | "monthly";
  };
  createdAt: Date;
  status: "active" | "unsubscribed";
}

export interface SubscriberFormData {
  email: string;
  categories?: string[];
  frequency?: "daily" | "weekly" | "monthly";
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search Types
export interface SearchResult {
  type: "blog" | "service" | "page" | "resource" | "byte";
  id: string;
  slug?: string;
  _id?: string;
  title: string;
  headline?: string;
  description?: string;
  url?: string;
  category?: string;
  body?: string;
}

export interface SearchResponse extends ApiResponse<{ results: SearchResult[] }> {}

// Newsletter Types
export interface Newsletter {
  _id: string;
  subject: string;
  content: string;
  sentAt?: Date;
  status: "draft" | "sent" | "scheduled";
  recipients?: number;
}

// Service Types
export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price?: number;
  category: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface Analytics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  date: Date;
}

// Social Share Types
export interface SharePlatform {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export interface ShareStats {
  platform: string;
  count: number;
}

// Animation Types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export interface SlideAnimationProps extends AnimationProps {
  distance?: number;
}

export interface HoverCardProps extends AnimationProps {
  scale?: number;
}

export interface StaggerContainerProps extends AnimationProps {
  staggerDelay?: number;
}

export interface StaggerItemProps extends AnimationProps {
  index?: number;
}

// Navigation Types
export interface NavLink {
  href: string;
  label: string;
  delay?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "select" | "checkbox" | "radio";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitText?: string;
  loadingText?: string;
}

// Command Palette Types
export interface CommandItem {
  id?: string;
  title?: string;
  label?: string;
  description?: string;
  icon?: string | React.ReactNode;
  action?: () => void;
  href?: string;
  shortcut?: string;
  category?: string;
}

// AI Generation Types
export interface AIGenerationOptions {
  topic?: string;
  outline?: string;
  url?: string;
  tone?: "professional" | "casual" | "formal" | "friendly";
  length?: "short" | "medium" | "long";
  keywords?: string[];
}

export interface AIResponse extends ApiResponse {
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Image Types
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
}

// Cookie Consent Types
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Error Types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

// Hook Types
export interface UseDebounceResult<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}
