import React from 'react';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}) => {
  return (
    <div className="position-absolute end-0 top-50 translate-middle-y me-4 d-flex flex-column gap-3">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-2 shadow-sm hover-scale glass-effect"
      >
        <i className="bi bi-chevron-left fs-5"></i>
        <span>Previous</span>
      </button>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-2 shadow-sm hover-scale glass-effect"
      >
        <span>Next</span>
        <i className="bi bi-chevron-right fs-5"></i>
      </button>
    </div>
  );
}; 