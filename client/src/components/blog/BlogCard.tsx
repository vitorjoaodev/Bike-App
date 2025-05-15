import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogPostSummary } from '../../data/mockBlogData';
import { Link } from 'wouter';

interface BlogCardProps {
  post: BlogPostSummary;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'featured';
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  size = 'medium',
  variant = 'default'
}) => {
  const isFeatured = variant === 'featured';
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  
  // Formatando a data de publicação
  const formattedDate = format(
    new Date(post.publishedAt), 
    "d 'de' MMMM, yyyy", 
    { locale: ptBR }
  );
  
  return (
    <article 
      className={`group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg
        ${isSmall ? 'h-72' : isLarge ? 'h-[500px]' : 'h-96'}
        ${isFeatured ? 'bg-secondary' : 'bg-white dark:bg-zinc-800'}
      `}
    >
      {/* Imagem de capa */}
      <div className={`relative overflow-hidden ${isSmall ? 'h-40' : isLarge ? 'h-80' : 'h-56'}`}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge de categoria */}
        <div className="absolute left-4 top-4 z-10">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            isFeatured ? 'bg-white text-secondary' : 'bg-secondary text-white'
          }`}>
            {post.category.name}
          </span>
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-5">
        {/* Metadata */}
        <div className="mb-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{post.readingTime} min de leitura</span>
        </div>
        
        {/* Título */}
        <h3 className={`mb-2 line-clamp-2 font-bold leading-tight 
          ${isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl'}
          ${isFeatured ? 'text-white' : 'text-zinc-800 dark:text-white'}`}
        >
          {post.title}
        </h3>
        
        {/* Descrição */}
        {!isSmall && (
          <p className={`mb-4 line-clamp-2 text-sm 
            ${isFeatured ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}
          >
            {post.description}
          </p>
        )}
        
        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className={`text-sm font-medium 
              ${isFeatured ? 'text-white' : 'text-zinc-800 dark:text-white'}`}
            >
              {post.author.name}
            </span>
          </div>
          
          {/* Link para leitura */}
          <Link to={`/blog/${post.slug}`}>
            <span className={`text-sm font-medium hover:underline 
              ${isFeatured ? 'text-white' : 'text-secondary'}`}
            >
              Ler mais
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;