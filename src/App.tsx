import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import {fetchAndParseWikipediaContent, WikiItem} from "./services/wikipedia";
import {ContentCard} from "./components/ContentCard";
import {preloadImage} from "./utils/imagePreloader";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const App: React.FC = () => {
  const [items, setItems] = useState<WikiItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showInstructions, setShowInstructions] = useState(true);

  const hasFetched = useRef(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentNodeRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);

  const fetchMoreData = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const newData = await fetchAndParseWikipediaContent();
      setItems(prevItems => [...prevItems, ...newData]);
      
      // Preload the first image of the new batch
      if (newData.length > 0) {
        await preloadImage(newData[0].imageUrl);
      }
    } catch (error) {
      console.error('Error fetching more Wikipedia data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const data = await fetchAndParseWikipediaContent();
        setItems(data);
        
        // Preload the first image after data is loaded
        if (data.length > 0) {
          await preloadImage(data[0].imageUrl);
        }
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
      } finally {
        setLoading(false);
        setIsInitialRender(false);
      }
    };

    fetchData();
  }, []);

  // Check if we need to fetch more data when current index changes
  useEffect(() => {
    const checkAndFetchMore = async () => {
      const remainingItems = items.length - currentIndex - 1;
      if (remainingItems <= 5) {
        await fetchMoreData();
      }
    };

    if (items.length > 0) {
      checkAndFetchMore();
    }
  }, [currentIndex, items, fetchMoreData]);

  // Preload next image when current index changes
  useEffect(() => {
    const preloadNextImage = async () => {
      if (currentIndex < items.length - 1 && !isTransitioning) {
        try {
          await preloadImage(items[currentIndex + 1].imageUrl);
        } catch (error) {
          console.error('Error preloading image:', error);
        }
      }
    };

    if (items.length > 0) {
      preloadNextImage();
    }
  }, [currentIndex, items, isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientY;
    const diff = touchStart - currentTouch;

    // Only trigger if the swipe is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe up - go to next
        next();
      } else {
        // Swipe down - go to previous
        prev();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isMobile, showInstructions]);

  const next = async () => {
    if (currentIndex < items.length - 1) {
      setDirection('next');
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setIsTransitioning(false);
    }
  };

  const prev = async () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setIsTransitioning(false);
    }
  };

  return (
    <>
      <div
        className="vh-100 bg-dark text-white position-relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <h1 className="visually-hidden">WikiReel - Wikipedia Content Explorer</h1>
        
        {isMobile && showInstructions && (
          <CSSTransition
            in={showInstructions}
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={instructionsRef}
          >
            <div
              ref={instructionsRef}
              className="position-fixed top-0 start-0 end-0 p-3 text-center bg-dark bg-opacity-75"
              style={{ zIndex: 1000 }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-arrow-up fs-4"></i>
                <span className="text-white">Swipe up/down to navigate</span>
                <i className="bi bi-arrow-down fs-4"></i>
              </div>
            </div>
          </CSSTransition>
        )}

        <CSSTransition
          in={loading}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div 
            ref={nodeRef}
            className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          >
            <div className="spinner-border text-primary loading-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </CSSTransition>

        <div className="position-relative w-100 h-100 overflow-hidden">
          {items.length > 0 && (
            <CSSTransition
              in={!isInitialRender}
              timeout={300}
              classNames={direction === 'next' ? 'slide' : 'slide-reverse'}
              key={currentIndex}
              nodeRef={contentNodeRef}
              appear={!isInitialRender}
            >
              <div 
                ref={contentNodeRef}
                className="position-absolute w-100 h-100"
              >
                <ContentCard
                  item={items[currentIndex]}
                  index={0}
                  currentIndex={0}
                />
              </div>
            </CSSTransition>
          )}

          {!isMobile && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-4 d-flex flex-column gap-3">
              <button
                onClick={prev}
                disabled={currentIndex === 0 || isTransitioning}
                className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-2 shadow-sm hover-scale glass-effect"
              >
                <i className="bi bi-chevron-left fs-5"></i>
                <span>Previous</span>
              </button>
              <button
                onClick={next}
                disabled={isTransitioning}
                className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-2 shadow-sm hover-scale glass-effect"
              >
                <span>Next</span>
                <i className="bi bi-chevron-right fs-5"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
