import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/app/components/common/Tag';

const rooms = [
  {
    id: 1,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    date: '12월 4일',
  },
  {
    id: 2,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    date: '12월 4일',
  },
  {
    id: 3,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    date: '12월 4일',
  },
];

export default function GroupPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold font-onepick text-yellow-main">모여요</h1>
          <p className="text-gray-400">모임이 더 쉬워지는 순간</p>
        </div>
        <Image src="/images/img_alarm.png" alt="알람" width={40} height={40} />
      </header>

      {/* Invite Banner */}
      <div className="relative bg-yellow-main rounded-lg p-6 mb-8 text-black">
        <div className="relative z-10">
          <p className="font-bold text-lg mb-2">친구들을 초대해 볼까요?</p>
          <Link href="/group/create" className="inline-flex items-center bg-white px-4 py-2 rounded-full text-sm font-bold">
            <Image src="/images/ic_plus.png" alt="플러스 아이콘" width={16} height={16} className="mr-2" />
            모임 만들러 가기
          </Link>
        </div>
        <div className="absolute top-[-30px] right-0 z-0">
          <Image src="/images/img_animal.png" alt="동물 캐릭터" width={150} height={100} />
        </div>
      </div>

      {/* Room List */}
      <div>
        <h2 className="font-bold text-lg mb-4">방 목록</h2>
        <div className="space-y-4">
          {rooms.map((room) => (
            <Link href={`/group/${room.id}`} key={room.id} className="block">
              <div className="flex items-center justify-between p-4 border border-yellow-main rounded-lg">
                <div>
                  <h3 className="font-bold">{room.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                    <Tag text={room.tags[0]} />
                    <span>{room.participantCount}명 참여 중</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-300">모임 확정 날짜</span>
                  <div className="flex items-center">
                    <p className="text-red font-bold text-lg mr-2">{room.date}</p>
                    <Image src="/images/ic_next.png" alt="다음" width={12} height={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}