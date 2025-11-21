import React from "react";

export type TagProps = {
  text: string;
  bgColorClass?: string; // e.g., "bg-yellow-light"
  textColorClass?: string; // e.g., "text-yellow-dark-text"
};

const Tag = ({ text, bgColorClass = "bg-[#F0C600]", textColorClass = "text-black" }: TagProps) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${bgColorClass} ${textColorClass}`}
    >
      {text}
    </span>
  );
};

export default Tag;