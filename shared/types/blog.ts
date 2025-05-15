export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  author: Author;
  category: Category;
  publishedAt: string;
  readingTime: number; // em minutos
  tags: string[];
  featured?: boolean;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  author: Author;
  category: Category;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
}