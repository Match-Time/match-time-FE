'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', {userId, password});
    // TODO: Implement actual login logic (API call)
    // On success, navigate to the main page
    router.push('/group');
  };

  return (
    <div className="flex flex-col h-full bg-white py-7">
      {/* Header */}
      <header className="px-2 text-left mt-20 mb-8">
        <Image
          src="/images/모여요.png"
          alt="모여요 로고"
          width={82} // Adjust based on visual estimation for text-4xl size
          height={22} // Adjust based on visual estimation for text-4xl size
          priority // Since this is a logo at the top of the page, it should be prioritized
        />
        <p className="text-gray-dark mt-2">모임이 더 쉬워지는 순간</p>
      </header>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="flex-grow flex flex-col justify-between"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디 입력"
            className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full mt-8 py-4 text-lg text-white rounded-xl bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
            disabled={!userId || !password}
          >
            다음
          </button>

          <div className="text-center mt-6">
            <Link href="/auth/signup" className="text-sm text-gray-500">
              <Image
                src="/images/모여요.png"
                alt="모여요 로고"
                width={44} // Smaller size for link context
                height={22} // Smaller size for link context
                className="inline-block align-middle mr-2 mb-1" // Add some styling to align it with text
              />
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
