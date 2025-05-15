import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/SEOHead';
import BlogHeader from '../components/blog/BlogHeader';
import BlogGrid from '../components/blog/BlogGrid';
import TagCloud from '../components/blog/TagCloud';
import { blogPostSummaries, allTags, categories } from '../data/mockBlogData';
import { BlogPostSummary } from '../../shared/types/blog';

/**
 * Página principal do blog
 */
export default function Blog() {
  // Estado para filtros
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulação de chamada à API com React Query (usando mock data por enquanto)
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', activeTag, activeCategory, searchQuery],
    queryFn: async () => {
      // Simula um delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aplicando filtros nos dados simulados
      let filteredPosts = [...blogPostSummaries];
      
      if (activeTag) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags.includes(activeTag)
        );
      }
      
      if (activeCategory) {
        filteredPosts = filteredPosts.filter(post => 
          post.category.slug === activeCategory
        );
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(query) || 
          post.description.toLowerCase().includes(query)
        );
      }
      
      return filteredPosts;
    },
    initialData: blogPostSummaries
  });
  
  // Handler para filtrar por tag
  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };
  
  // Handler para filtrar por categoria
  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(activeCategory === categorySlug ? null : categorySlug);
  };
  
  // Handler para pesquisa
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    setSearchQuery(query);
  };
  
  // Separando posts em destaque
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
      <SEOHead 
        title="Blog BikeShare SP | Ciclovias, Saúde e Mobilidade Urbana"
        description="Artigos, dicas e informações sobre ciclismo urbano, saúde, mobilidade sustentável e as melhores ciclovias de São Paulo."
        canonicalUrl="/blog"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho do blog */}
        <BlogHeader />
        
        {/* Barra de pesquisa */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex">
            <input 
              type="text" 
              name="query"
              placeholder="Buscar por artigos..." 
              className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:border-secondary focus:outline-none dark:border-gray-600 dark:bg-zinc-800"
              defaultValue={searchQuery}
            />
            <button 
              type="submit" 
              className="rounded-r-lg bg-secondary px-4 py-2 text-white"
            >
              <span className="material-icons">search</span>
            </button>
          </form>
        </div>
        
        {/* Filtros e Tags */}
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_250px]">
          <div>
            {/* Categorias */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      activeCategory === category.slug
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-zinc-700"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>
            </div>
            
            {/* Tag Cloud */}
            <TagCloud 
              tags={allTags} 
              currentTag={activeTag || undefined} 
              onTagClick={handleTagClick} 
            />
          </div>
          
          {/* Sidebar com informações adicionais */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-800">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
              Sobre o Blog
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              O Blog BikeShare SP é dedicado a promover a cultura ciclística em São Paulo, 
              trazendo informações úteis sobre ciclovias, dicas de saúde, 
              mobilidade urbana e muito mais.
            </p>
            <div className="rounded-lg bg-secondary bg-opacity-10 p-3">
              <h4 className="mb-2 font-medium text-secondary">Quer contribuir?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Tem uma história para compartilhar ou quer sugerir um tema? 
                Entre em contato conosco pelo e-mail blog@bikesharesp.com
              </p>
            </div>
          </div>
        </div>
        
        {/* Estado de carregamento */}
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Mensagem quando não há resultados */}
            {posts.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm dark:bg-zinc-800">
                <span className="material-icons mb-4 text-5xl text-gray-400">search_off</span>
                <h3 className="mb-2 text-xl font-semibold">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tente ajustar seus filtros ou termos de busca para encontrar o que procura.
                </p>
                <button
                  onClick={() => {
                    setActiveTag(null);
                    setActiveCategory(null);
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-lg bg-secondary px-4 py-2 text-white"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <>
                {/* Posts em destaque */}
                {featuredPosts.length > 0 && (
                  <div className="mb-16">
                    <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                      Destaques
                    </h2>
                    <BlogGrid posts={featuredPosts} layout="featured" columns={2} />
                  </div>
                )}
                
                {/* Posts regulares */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                    {activeTag || activeCategory || searchQuery ? 'Resultados' : 'Últimos artigos'}
                  </h2>
                  <BlogGrid posts={regularPosts} columns={3} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}