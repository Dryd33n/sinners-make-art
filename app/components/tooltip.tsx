'use client';

import React, { useState } from "react";

import { ReactNode } from "react";

const Tooltip = ({ children }: { children: ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Question Mark */}
      <span
        className="text-lg font-bold text-grey-600 cursor-pointer bg-white rounded-full w-5 h-5 flex items-center justify-center m-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        ?
      </span>

      {/* Tooltip Content */}
      {isHovered && (
        <div className="absolute left-0 mt-2 w-[450] bg-grey-800 text-white rounded-lg shadow-lg p-3 border">
          {children}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
