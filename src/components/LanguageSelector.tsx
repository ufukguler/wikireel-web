import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  isMobile: boolean;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isMobile
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className={`language-selector ${isMobile ? 'mobile' : ''}`}>
      <div className="dropdown">
        <button
          className="btn btn-outline-light dropdown-toggle w-100"
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <i className="bi bi-translate me-2"></i>
          {languages.find(lang => lang.code === currentLanguage)?.name || 'Select Language'}
        </button>
        {isOpen && (
          <ul className="dropdown-menu show" style={{ display: 'block' }}>
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  className={`dropdown-item ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleSelect(language.code)}
                >
                  {language.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 