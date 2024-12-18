'use client'

import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ExpandableSection({ title, children }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => setIsOpen(!isOpen);

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-grey-800 m-5">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <button 
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
