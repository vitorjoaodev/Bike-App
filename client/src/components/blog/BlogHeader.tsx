import React from 'react';
import { Link } from 'wouter';

interface BlogHeaderProps {
  title?: string;
  description?: string;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkUrl?: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title = 'Blog',
  description = 'Artigos sobre ciclovias, saúde, mobilidade urbana e ciclismo em São Paulo',
  showBackLink = false,
  backLinkText = 'Voltar para o blog',
  backLinkUrl = '/blog'
}) => {
  return (
    <header className="mb-12 border-b border-gray-200 pb-8 dark:border-gray-700">
      {/* Breadcrumb / Voltar link */}
      {showBackLink && (
        <div className="mb-6">
          <Link to={backLinkUrl}>
            <span className="flex items-center text-sm font-medium text-secondary hover:underline">
              <span className="material-icons mr-1 text-sm">arrow_back</span>
              {backLinkText}
            </span>
          </Link>
        </div>
      )}
      
      {/* Título do blog */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
          {title}
        </h1>
        
        {/* Descrição */}
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </header>
  );
};

export default BlogHeader;