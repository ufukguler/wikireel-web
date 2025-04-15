import React, {useState} from 'react';
import {WikiItem} from "../services/wikipedia";

interface ContentCardProps {
  item: WikiItem;
  index: number;
  currentIndex: number;
}

const MAX_LINES = 8;
const LINE_HEIGHT = 1.5; // rem

export const ContentCard: React.FC<ContentCardProps> = ({item}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowReadMore = item.extract.split('\n').length > MAX_LINES;

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
        className="w-100 h-100"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
        }}
        itemProp="image"
      >
        <div
          className="position-absolute bottom-0 w-100 p-4 text-white"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <h2 className="mb-3 fw-bold" itemProp="headline">{item.title}</h2>
          <div
            className="mb-3"
            style={{
              maxHeight: isExpanded ? 'none' : `${MAX_LINES * LINE_HEIGHT}rem`,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-in-out',
            }}
            itemProp="articleBody"
          >
            <p className="mb-0">{item.extract}</p>
          </div>
          {shouldShowReadMore && (
            <button
              onClick={toggleExpand}
              className="btn btn-outline-light btn-sm rounded-pill px-3 hover-scale glass-effect"
              aria-expanded={isExpanded}
              aria-controls="article-content"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};