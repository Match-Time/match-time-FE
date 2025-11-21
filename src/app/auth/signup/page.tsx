'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image'; // Added Image import
import {createUser} from '@/lib/api';
import {saveUser} from '@/lib/userStorage';
import {getErrorMessage} from '@/lib/utils';

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
    } catch (err) {
      setError(getErrorMessage(err, '회원가입에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !email || !password || !nickname || loading;

  return (
    <div className="flex flex-col h-full bg-white py-7">
      {' '}
      {/* Added py-7 to match login page layout */}
      <header className="px-2 text-left mt-10 mb-8">
        {' '}
        {/* Adjusted mt-20 to mt-10 for signup page */}
        <Image
          src="/images/모여요.png"
          alt="모여요 로고"
          width={82}
          height={22}
          priority
        />
        <p className="text-gray-dark text-xl mt-2">회원가입</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
        </div>

        <div className="mt-8">
          {error && <p className="text-sm text-red-main mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold text-white rounded-xl ${
              isButtonDisabled
                ? 'bg-gray-light'
                : 'bg-gradient-to-r from-yellow-main to-yellow-light'
            }`}
            disabled={isButtonDisabled}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
