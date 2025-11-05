
import React, { useState, useRef, useEffect } from 'react';
import { Status } from '../../types';
import { STATUSES } from '../../constants';

interface StatusSelectorProps {
  currentStatus: Status;
  onSelect: (status: Status) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (status: Status) => {
    onSelect(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          type="button"
          className={`inline-flex justify-center w-full rounded-md border border-slate-600 shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${currentStatus.color} ${currentStatus.textColor}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentStatus.emoji} <span className="ml-2">{currentStatus.label}</span>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-700 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.values(STATUSES).map((status) => (
              <button
                key={status.id}
                onClick={() => handleSelect(status)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                role="menuitem"
              >
                {status.emoji} <span className="ml-2">{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelector;
