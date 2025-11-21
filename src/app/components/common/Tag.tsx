import React from "react";

export type TagProps = {
  text: string;
  color?: string;
  textColor?: string;
};

const Tag = ({ text, color = "#F0C600", textColor = "text-black" }: TagProps) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${textColor}`}
      style={{
        backgroundColor: color,
      }}
    >
      {text}
    </span>
  );
};

export default Tag;