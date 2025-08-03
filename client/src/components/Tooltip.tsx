// client\src\components\Tooltip.tsx
import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} w-[250px] sm:w-[280px] text-wrap rounded-md bg-gray-900 text-white px-3 py-2 text-xs sm:text-sm shadow-lg opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 z-50`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
