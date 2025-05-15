import React from 'react';
import { BlogPostSummary } from '../../data/mockBlogData';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: BlogPostSummary[];
  layout?: 'default' | 'featured';
  columns?: 1 | 2 | 3 | 4;
}

const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  layout = 'default',
  columns = 3
}) => {
  // Se não houver posts, mostra mensagem
  if (!posts || posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Nenhum artigo encontrado.
        </p>
      </div>
    );
  }

  // Layout especial para destaque (primeiro post grande, demais em grid)
  if (layout === 'featured' && posts.length > 3) {
    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
      <div className="space-y-12">
        {/* Post em destaque */}
        <div className="w-full">
          <BlogCard post={featuredPost} size="large" variant="featured" />
        </div>

        {/* Grid de posts restantes */}
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${columns}`}>
          {remainingPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  }

  // Layout padrão (grid uniforme)
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;