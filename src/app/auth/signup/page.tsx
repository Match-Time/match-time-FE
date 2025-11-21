'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createUser} from '@/lib/api';
import {saveUser} from '@/lib/userStorage';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await createUser({email, password, nickname});
      saveUser({id: user.id, email: user.email, nickname: user.nickname});
      router.push('/group');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <h1 className="text-2xl font-bold mb-8">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:border-yellow-main focus:ring-1 focus:ring-yellow-main"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:border-yellow-main focus:ring-1 focus:ring-yellow-main"
          required
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:border-yellow-main focus:ring-1 focus:ring-yellow-main"
          required
        />
        {error && <p className="text-sm text-red-main">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
          disabled={loading}
        >
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
