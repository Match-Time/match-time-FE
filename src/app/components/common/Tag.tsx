import React from "react";

export type TagProps = {
  text: string;
  color?: string;
};

const Tag = ({ text, color = "#F0C600" }: TagProps) => {
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-semibold text-black"
      style={{
        backgroundColor: color,
      }}
    >
      {text}
    </span>
  );
};

export default Tag;