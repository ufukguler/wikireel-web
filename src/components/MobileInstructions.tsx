import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface MobileInstructionsProps {
  show: boolean;
}

export const MobileInstructions: React.FC<MobileInstructionsProps> = ({ show }) => {
  const instructionsRef = React.useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="fade"
      unmountOnExit
      nodeRef={instructionsRef}
    >
      <div
        ref={instructionsRef}
        className="mobile-instructions position-fixed top-0 start-0 end-0 p-3 text-center bg-dark bg-opacity-75"
      >
        <div className="d-flex align-items-center justify-content-center gap-2">
          <i className="bi bi-arrow-up fs-4"></i>
          <span className="text-white">Swipe up/down to navigate</span>
          <i className="bi bi-arrow-down fs-4"></i>
        </div>
      </div>
    </CSSTransition>
  );
}; 