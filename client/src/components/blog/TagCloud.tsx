import React from 'react';
import { Link } from 'wouter';

interface TagCloudProps {
  tags: string[];
  currentTag?: string;
  onTagClick?: (tag: string) => void;
}

const TagCloud: React.FC<TagCloudProps> = ({ 
  tags, 
  currentTag, 
  onTagClick 
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Função para lidar com clique na tag
  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Tópicos Populares
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = currentTag === tag;
          
          return onTagClick ? (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`rounded-full px-3 py-1 text-sm transition-colors 
                ${isActive 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600'
                }`}
            >
              {tag}
            </button>
          ) : (
            <Link 
              key={tag}
              to={`/blog/tag/${encodeURIComponent(tag)}`}
              className={`rounded-full px-3 py-1 text-sm transition-colors 
                ${isActive 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600'
                }`}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TagCloud;