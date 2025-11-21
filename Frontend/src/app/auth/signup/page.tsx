'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/api';
import { saveStoredUser } from '@/lib/auth';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await createUser({ email, password, nickname });
      saveStoredUser({ id: user.id, email: user.email, nickname: user.nickname });
      router.push('/group');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = email && password && nickname;

  return (
    <div className="flex flex-col h-full bg-white px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-gray-500 mt-2">모임에 참여할 프로필을 만들어 주세요.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-semibold mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="모여요 유저"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
        >
          {isSubmitting ? '가입 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
