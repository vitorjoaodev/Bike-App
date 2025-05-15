import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
}

/**
 * Componente para gerenciar as tags SEO do site
 */
const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logo-social.png',
  ogImageAlt = 'BikeShare SP Logo',
  twitterCard = 'summary_large_image'
}) => {
  // URL base do site
  const siteUrl = 'https://bikesharesp.com'; // Substitua pelo URL real
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Tags básicas de SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph tags para compartilhamento em redes sociais */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="BikeShare SP" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      {/* Outras meta tags importantes */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content="#27AE60" />
      
      {/* Structured data para SEO avançado (formato JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'BikeShare SP',
          'url': siteUrl,
          'description': 'Aluguel de bicicletas na cidade de São Paulo com tecnologia avançada de rastreamento.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;