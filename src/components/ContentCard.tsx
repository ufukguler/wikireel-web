import React from 'react';
import { WikiItem } from '../services/wikipedia';
import { ArticleContent } from './ArticleContent';

interface ContentCardProps {
  item: WikiItem;
  index: number;
  currentIndex: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  return (
    <article className="position-relative w-100 h-100" itemScope itemType="http://schema.org/Article">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": item.title,
          "description": item.extract,
          "image": item.imageUrl,
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Organization",
            "name": "Wikipedia"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Wikipedia"
          }
        })}
      </script>
      <div
        className="w-100 h-100 content-card-image"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundColor: '#000',
          position: 'relative',
          minHeight: '100%'
        }}
        itemProp="image"
      >
        <ArticleContent item={item} />
      </div>
    </article>
  );
};