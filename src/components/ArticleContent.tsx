import React, {useState} from 'react';
import {WikiItem} from '../services/wikipedia';

interface ArticleContentProps {
  item: WikiItem;
}

const MAX_LINES = 8;
const LINE_HEIGHT = 1.5;

export const ArticleContent: React.FC<ArticleContentProps> = ({item}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowReadMore = item.extract.split('\n').length > MAX_LINES;

  return (
    <div
      className="position-absolute bottom-0 w-100 p-4 text-white"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 fw-bold" itemProp="headline">{item.title}</h2>
        {item.fullurl && (
          <a
            href={item.fullurl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm rounded-pill px-3 hover-scale glass-effect"
          >
            Read more
            <i className="bi bi-box-arrow-up-right ms-2"></i>
          </a>
        )}
      </div>
      <div
        className="mb-3"
        style={{
          maxHeight: isExpanded ? 'none' : `${MAX_LINES * LINE_HEIGHT}rem`,
          overflow: isExpanded ? 'hidden' : 'auto',
          transition: 'max-height 0.3s ease-in-out',
        }}
        itemProp="articleBody"
      >
        <p className="mb-0" dangerouslySetInnerHTML={{__html: item.extract}}></p>
      </div>
      {/*{shouldShowReadMore && (*/}
      {/*  <button*/}
      {/*    onClick={toggleExpand}*/}
      {/*    className="btn btn-outline-light btn-sm rounded-pill px-3 hover-scale glass-effect"*/}
      {/*    aria-expanded={isExpanded}*/}
      {/*    aria-controls="article-content"*/}
      {/*  >*/}
      {/*    {isExpanded ? 'Show Less' : 'Read More'}*/}
      {/*    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>*/}
      {/*  </button>*/}
      {/*)}*/}
    </div>
  );
}; 