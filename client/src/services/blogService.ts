import { BlogPost, BlogPostSummary, Category } from '../../shared/types/blog';
import { apiRequest } from '../lib/queryClient';

/**
 * Serviço para gerenciar as operações do blog
 */
export const blogService = {
  /**
   * Busca todos os posts do blog (resumo)
   */
  getAllPosts: async (): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest('/api/blog/posts');
    } catch (error) {
      console.error('Erro ao buscar posts do blog:', error);
      return [];
    }
  },

  /**
   * Busca um post específico pelo slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      return await apiRequest(`/api/blog/posts/${slug}`);
    } catch (error) {
      console.error(`Erro ao buscar post com slug ${slug}:`, error);
      return null;
    }
  },

  /**
   * Busca posts em destaque
   */
  getFeaturedPosts: async (): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest('/api/blog/featured');
    } catch (error) {
      console.error('Erro ao buscar posts em destaque:', error);
      return [];
    }
  },

  /**
   * Busca posts por categoria
   */
  getPostsByCategory: async (categorySlug: string): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest(`/api/blog/category/${categorySlug}`);
    } catch (error) {
      console.error(`Erro ao buscar posts da categoria ${categorySlug}:`, error);
      return [];
    }
  },

  /**
   * Busca posts por tag
   */
  getPostsByTag: async (tag: string): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest(`/api/blog/tag/${tag}`);
    } catch (error) {
      console.error(`Erro ao buscar posts com tag ${tag}:`, error);
      return [];
    }
  },

  /**
   * Busca todas as categorias
   */
  getAllCategories: async (): Promise<Category[]> => {
    try {
      return await apiRequest('/api/blog/categories');
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  /**
   * Busca posts recentes
   */
  getRecentPosts: async (limit: number = 3): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest(`/api/blog/recent?limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar posts recentes:', error);
      return [];
    }
  },

  /**
   * Buscar posts relacionados a um post específico
   */
  getRelatedPosts: async (postId: string, limit: number = 3): Promise<BlogPostSummary[]> => {
    try {
      return await apiRequest(`/api/blog/related/${postId}?limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar posts relacionados:', error);
      return [];
    }
  }
};