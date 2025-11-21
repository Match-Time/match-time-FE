'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {fetchUsers} from '@/lib/api';
import {saveUser} from '@/lib/userStorage';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const users = await fetchUsers();
      const user = users.find(
        (u) => u.email === email.trim() && u.password === password.trim()
      );

      if (!user) {
        setError('계정이 없어요. 회원가입 후 다시 시도해 주세요.');
        return;
      }

      saveUser({id: user.id, email: user.email, nickname: user.nickname});
      router.push('/group');
    } catch (err: Error) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !email || !password || loading;

  return (
    <div className="flex flex-col h-full bg-white py-7">
      <header className="px-2 text-left mt-20 mb-8">
        <Image
          src="/images/모여요.png"
          alt="모여요 로고"
          width={82}
          height={22}
          priority
        />
        <p className="text-gray-dark mt-2">모임이 더 쉬워지는 순간</p>
      </header>

      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:border-yellow-main focus:ring-1 focus:ring-yellow-main"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full p-3 border-2 text-sm border-gray-light rounded-xl focus:outline-none focus:border-yellow-main focus:ring-1 focus:ring-yellow-main"
            required
          />
          {error && <p className="text-sm text-red-main">{error}</p>}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full mt-8 py-4 text-lg text-white rounded-xl ${
              isButtonDisabled
                ? 'bg-gray-light'
                : 'bg-gradient-to-r from-yellow-main to-yellow-light'
            }`}
            disabled={isButtonDisabled}
          >
            {loading ? '로그인 중...' : '다음'}
          </button>

          <div className="text-center mt-6">
            <Link href="/auth/signup" className="text-sm text-gray-500">
              <Image
                src="/images/모여요.png"
                alt="모여요 로고"
                width={44}
                height={22}
                className="inline-block align-middle mr-2 mb-1"
              />
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
