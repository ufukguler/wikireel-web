import React from 'react';

interface Language {
  name: string;
  nativeName: string;
  code: string;
}

const languages: Language[] = [
  { name: 'English', nativeName: 'English', code: 'en' },
  { name: 'German', nativeName: 'Deutsch', code: 'de' },
  { name: 'French', nativeName: 'Français', code: 'fr' },
  { name: 'Portuguese', nativeName: 'Português', code: 'pt' },
  { name: 'Spanish', nativeName: 'Español', code: 'es' },
  { name: 'Ukrainian', nativeName: 'українська', code: 'uk' },
  { name: 'Italian', nativeName: 'italiano', code: 'it' },
  { name: 'Turkish', nativeName: 'Türkçe', code: 'tr' },
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  isMobile: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange, isMobile }) => {
  return (
    <div 
      className={`language-selector position-absolute ${isMobile ? 'top-0 end-0 m-3' : 'top-0 end-0 m-3'}`}
      style={{ zIndex: 1000 }}
    >
      <select
        className={`form-select form-select-sm glass-effect text-white ${isMobile ? 'w-auto' : ''}`}
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        aria-label="language"
        style={{ cursor: 'pointer' }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {isMobile ? lang.code.toUpperCase() : `${lang.nativeName} (${lang.name})`}
          </option>
        ))}
      </select>
    </div>
  );
}; 