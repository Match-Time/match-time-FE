import React from "react";

export type TagProps = {
  text: string;
  color?: string;
};

const Tag = ({ text, color = "#FFE983" }: TagProps) => {
  return (
    <span
      className="px-4 py-1.5 rounded-full text-xs font-semibold text-yellow-dark-text"
      style={{
        backgroundColor: color,
      }}
    >
      {text}
    </span>
  );
};

export default Tag;
