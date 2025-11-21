'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', { userId, password });
    // TODO: Implement actual login logic (API call)
    // On success, navigate to the main page
    router.push('/group');
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 py-8">
      {/* Header */}
      <header className="text-center my-12">
        <h1 className="text-4xl font-onepick text-yellow-main">모여요</h1>
        <p className="text-gray-400 mt-2">모임이 더 쉬워지는 순간</p>
      </header>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디 입력"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
            disabled={!userId || !password}
          >
            다음
          </button>

          <div className="text-center mt-6">
            <Link href="/auth/signup" className="text-sm text-gray-500">
              <span className="text-yellow-main font-bold">모여요</span> 회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}