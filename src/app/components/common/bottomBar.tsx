// export default BottomMar;
'use client';

import Image from 'next/image';
import {useRouter, usePathname} from 'next/navigation';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menus = [
    {
      label: '고정표',
      activeSrc: '/images/icon_month_yellow.png',
      inactiveSrc: '/images/icon_month_gray.png',
      path: '/month',
    },
    {
      label: '모임',
      activeSrc: '/images/icon_group_yellow.png',
      inactiveSrc: '/images/icon_group_gray.png',
      path: '/group',
    },
    {
      label: '내 정보',
      activeSrc: '/images/icon_myPage_yellow.png',
      inactiveSrc: '/images/icon_myPage_gray.png',
      path: '/myPage',
    },
  ];

  return (
    <nav className="h-[70px] bg-white flex justify-around items-center">
      {menus.map((item) => {
        const isActive = pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src={isActive ? item.activeSrc : item.inactiveSrc}
              width={30}
              height={30}
              alt={item.label}
              className={`${isActive ? 'opacity-100' : 'opacity-40'}`}
            />
            <span
              className={`mt-1 text-sm ${
                isActive ? 'text-[#FFCA3A] font-semibold' : 'gray-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
