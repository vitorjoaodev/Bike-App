import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SEOHead from '../components/SEOHead';
import BlogHeader from '../components/blog/BlogHeader';
import BlogCard from '../components/blog/BlogCard';
import { blogPosts, blogPostSummaries } from '../data/mockBlogData';
import { BlogPost as BlogPostType } from '../data/mockBlogData';

// Função para converter o markdown para HTML (simples, apenas para demonstração)
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-5">$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    // New lines
    .replace(/\n/gim, '<br/>');
  
  // Wrap lists
  html = html.replace(/<li class="ml-4 mb-1">(.*)<\/li><br\/><li class="ml-4 mb-1">/gim, '<li class="ml-4 mb-1">$1</li><li class="ml-4 mb-1">');
  html = html.replace(/<li class="ml-4 mb-1">(.*)<\/li><br\/>/gim, '<li class="ml-4 mb-1">$1</li></ul><br/>');
  html = html.replace(/<br\/><li class="ml-4 mb-1">/gim, '<br/><ul><li class="ml-4 mb-1">');
  
  return html;
}

/**
 * Página de detalhe de um post do blog
 */
export default function BlogPost() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug;
  
  // Busca do post por slug (simulado com dados mock)
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      // Simula delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Busca no array local (seria uma chamada API)
      const foundPost = blogPosts.find(post => post.slug === slug);
      if (!foundPost) {
        throw new Error('Post não encontrado');
      }
      
      return foundPost;
    }
  });
  
  // Se o post não existir, redireciona para 404
  useEffect(() => {
    if (error) {
      setLocation('/404');
    }
  }, [error, setLocation]);
  
  // Posts relacionados (pela mesma categoria ou tags)
  const relatedPosts = post 
    ? blogPostSummaries
        .filter(p => 
          p.id !== post.id && 
          (p.category.id === post.category.id || 
           p.tags.some(tag => post.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];
  
  // Formata a data de publicação
  const formattedDate = post
    ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })
    : '';
  
  return (
    <>
      {post && (
        <SEOHead 
          title={`${post.title} | Blog BikeShare SP`}
          description={post.description}
          canonicalUrl={`/blog/${post.slug}`}
          ogType="article"
          ogImage={post.coverImage}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Navegação e cabeçalho */}
        <BlogHeader 
          showBackLink 
          backLinkText="Voltar para o blog" 
          backLinkUrl="/blog"
        />
        
        {/* Estado de carregamento */}
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          </div>
        ) : post ? (
          <div className="mx-auto max-w-4xl">
            {/* Header do artigo */}
            <div className="mb-8 text-center">
              {/* Categoria */}
              <div className="mb-3">
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-white">
                  {post.category.name}
                </span>
              </div>
              
              {/* Título */}
              <h1 className="mb-4 text-4xl font-bold leading-tight text-zinc-900 dark:text-white md:text-5xl">
                {post.title}
              </h1>
              
              {/* Metadados */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{post.readingTime} min de leitura</span>
              </div>
              
              {/* Descrição */}
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                {post.description}
              </p>
            </div>
            
            {/* Imagem de capa */}
            <div className="mb-12 overflow-hidden rounded-xl">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
            
            {/* Conteúdo */}
            <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
            </article>
            
            {/* Tags */}
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <a 
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Autor */}
            <div className="mx-auto mt-12 max-w-3xl rounded-xl bg-gray-50 p-6 dark:bg-zinc-800">
              <div className="flex items-start gap-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-white">
                    {post.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Posts relacionados */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
                  Artigos relacionados
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {relatedPosts.map(relatedPost => (
                    <BlogCard key={relatedPost.id} post={relatedPost} size="small" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}