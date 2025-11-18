import React from "react";

export type TagProps = {
  color: string;
  shadowColor: string;
  text: string;
};

const Tag = ({ color, shadowColor, text }: TagProps) => {
  // HEX -> RGBA 변환
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const innerShadow = `inset 0 2px 4px 0 ${hexToRgba(shadowColor, 0.3)}`;

  return (
    <span
      className="px-3 py-1 rounded-2xl border border-gray-200 text-[15px] cursor-pointer"
      style={{
        backgroundColor: color,
        boxShadow: innerShadow,
        filter: `drop-shadow(0 2px 2px ${hexToRgba(shadowColor, 0.3)})`,
      }}
    >
      <span className="font-extralight font-onepick text-main-green">#</span>{" "}
      {text}
    </span>
  );
};

export default Tag;
