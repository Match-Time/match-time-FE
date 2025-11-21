'use client';

import React from 'react';
import Image from 'next/image';

const SettingMenuItem = ({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center w-full text-left p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
  >
    <div className="mr-4 w-6 h-6 flex items-center justify-center">{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <Image src="/images/ic_next.png" alt="go" width={12} height={12} />
  </button>
);

export default SettingMenuItem;
