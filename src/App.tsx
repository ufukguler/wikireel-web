import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import {fetchAndParseWikipediaContent, searchWikipedia, setWikipediaLanguage, WikiItem} from "./services/wikipedia";
import {ContentCard} from "./components/ContentCard";
import {NavigationButtons} from "./components/NavigationButtons";
import {LoadingSpinner} from "./components/LoadingSpinner";
import {MobileInstructions} from "./components/MobileInstructions";
import {LanguageSelector} from "./components/LanguageSelector";
import {HamburgerMenu} from "./components/HamburgerMenu";
import {preloadImage} from "./utils/imagePreloader";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import ReactGA from "react-ga4";

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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const hasFetched = useRef(false);
  const contentNodeRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setWikipediaLanguage(languageCode);
    setLoading(true);
    setItems([]);
    setCurrentIndex(0);
    hasFetched.current = false;

    try {
      const data = await fetchAndParseWikipediaContent();
      setItems(data);
      if (data.length > 0) {
        await preloadImage(data[0].imageUrl);
      }
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setIsSearchMode(true);
    try {
      const searchResults = await searchWikipedia(query);
      setItems(searchResults);
      setCurrentIndex(0);
      
      if (searchResults.length > 0) {
        await preloadImage(searchResults[0].imageUrl);
      }
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExitSearch = () => {
    setIsSearchMode(false);
    // Reset to random content
    hasFetched.current = false;
    fetchData();
  };

  const fetchData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      const data = await fetchAndParseWikipediaContent();
      setItems(data);

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
    ReactGA.initialize("G-LZ7F2X9Q9G");
    // Make the initial API call immediately
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, currentIndex, items.length]);

  return (
    <div
      className="vh-100 bg-dark text-white position-relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      <h1 className="visually-hidden">WikiReel - Wikipedia Content Explorer</h1>

      <LoadingSpinner isLoading={loading}/>
      <MobileInstructions show={isMobile && showInstructions}/>
      
      {isMobile ? (
        <div style={{ position: 'relative', zIndex: 1050 }}>
          <HamburgerMenu
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onSearch={handleSearch}
            onExitSearch={handleExitSearch}
            isSearchMode={isSearchMode}
          />
        </div>
      ) : (
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          isMobile={false}
        />
      )}

      <div className="position-relative w-100 h-100 overflow-hidden" style={{ zIndex: 1 }}>
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
              className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
            >
              <div
                className="content-container"
                style={{
                  width: isMobile ? '100%' : 'min(70vw, 800px)',
                  height: '100%'
                }}
              >
                <ContentCard
                  item={items[currentIndex]}
                  index={0}
                  currentIndex={0}
                />
              </div>
            </div>
          </CSSTransition>
        )}

        {!isMobile && (
          <NavigationButtons
            onPrev={prev}
            onNext={next}
            isPrevDisabled={currentIndex === 0 || isTransitioning}
            isNextDisabled={isTransitioning}
          />
        )}
      </div>
    </div>
  );
};

export default App;
