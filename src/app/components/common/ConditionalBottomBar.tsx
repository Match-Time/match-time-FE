'use client';

import { usePathname } from 'next/navigation';
import BottomBar from './bottomBar';

export default function ConditionalBottomBar() {
  const pathname = usePathname();

  const pathsWithBottomBar = ['/month', '/myPage', '/group'];
  
  const shouldShow = pathsWithBottomBar.includes(pathname);

  return shouldShow ? <BottomBar /> : null;
}
