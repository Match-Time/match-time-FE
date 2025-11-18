"use client";

import { Files, House, MapPin, MessageSquareMore, PenLine } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const BottomMar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const iconProps = {
    size: 30,
    className: "cursor-pointer",
  };

  const icons = [
    { Component: House, path: "/" },
    { Component: PenLine, path: "/write" },
    { Component: MapPin, path: "/map" },
    { Component: Files, path: "/feed" },
  ];

  return (
    <nav className="flex items-center justify-around px-4 w-full h-[70px] max-w-sm bg-background">
      {icons.map(({ Component, path }, idx) => (
        <Component
          key={path}
          {...iconProps}
          onClick={() => router.push(path)}
          color={pathname === path ? "#6FCF97" : "#B7E0C2"}
        />
      ))}
    </nav>
  );
};

export default BottomMar;
