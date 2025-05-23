import React, { useState, useRef, useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { CSSTransition } from 'react-transition-group';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface HamburgerMenuProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  onSearch: (query: string) => void;
  onExitSearch: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  currentLanguage,
  onLanguageChange,
  onSearch,
  onExitSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const nodeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    console.info(`handleSearch: ${searchQuery.trim()}`);
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setIsOpen(false);
    }
  };

  const handleExitSearch = () => {
    console.info('handleExitSearch');
    onExitSearch();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button
        className="hamburger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <i className={`bi bi-${isOpen ? 'x' : 'list'}`}></i>
      </button>

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="menu"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div 
          className="menu-content"
          ref={nodeRef}
        >
          <div className="menu-content-wrapper">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-light"
                  placeholder="Search Wikipedia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => {
                      setSearchQuery('');
                      handleExitSearch();
                    }}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
                <button
                  className="btn btn-outline-light"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
          
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={(code) => {
              onLanguageChange(code);
              setIsOpen(false);
            }}
            isMobile={true}
          />
        </div>
      </CSSTransition>
    </div>
  );
}; 