import React from 'react';
import { Link } from 'wouter';

/**
 * Botão de blog para ser adicionado ao menu de navegação principal
 */
const BlogButton: React.FC = () => {
  return (
    <Link
      to="/blog"
      className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
    >
      <span className="material-icons text-sm">article</span>
      Blog
      <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-200 text-[10px] font-bold text-green-800 dark:bg-green-700 dark:text-green-100">
        6
      </span>
    </Link>
  );
};

export default BlogButton;