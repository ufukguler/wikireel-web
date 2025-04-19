import React from 'react';
import {CSSTransition} from 'react-transition-group';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({isLoading}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={isLoading}
      timeout={300}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </CSSTransition>
  );
}; 