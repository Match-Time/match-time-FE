'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUsers } from '@/lib/api';
import { loadStoredUser, saveStoredUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = loadStoredUser();
    if (stored) {
      router.replace('/group');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const users = await fetchUsers();
      const matched = users.find(
        (user) => user.email === userId.trim() && user.password === password
      );

      if (!matched) {
        setError('아이디 또는 비밀번호를 확인해 주세요.');
        return;
      }

      saveStoredUser({
        id: matched.id,
        email: matched.email,
        nickname: matched.nickname,
      });

      router.push('/group');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했어요.');
    } finally {
      setIsLoading(false);
    }
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
            placeholder="아이디(이메일) 입력"
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
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
            disabled={!userId || !password || isLoading}
          >
            {isLoading ? '로그인 중...' : '다음'}
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
