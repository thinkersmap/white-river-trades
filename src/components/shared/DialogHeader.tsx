import { ReactNode } from 'react';

interface DialogHeaderProps {
  onClose: () => void;
  onBack?: () => void;
  step?: number;
  totalSteps?: number;
}

export function DialogHeader({ onClose, onBack, step, totalSteps }: DialogHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {onBack && (
          <button 
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
        )}

        {step && totalSteps && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`h-1 w-8 rounded-sm transition-colors ${i + 1 <= step ? 'bg-black' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        )}

        <button 
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors ml-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}