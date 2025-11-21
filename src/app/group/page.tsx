import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/app/components/common/Tag';

const rooms = [
  {
    id: 1,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    date: '12-4',
  },
  {
    id: 2,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    // date: '12월 4일', // Removed date for testing conditional rendering
  },
  {
    id: 3,
    title: '걸스나잇 해요',
    tags: ['친구 모임'],
    participantCount: 3,
    date: '12-4',
  },
];

export default function GroupPage() {
  return (
    <>
      {/* Header */}
      <header className="px-3 flex justify-between items-center my-12">
        <div>
          <Image
            src="/images/모여요.png"
            alt="모여요 로고"
            width={82} // Adjust based on visual estimation for text-4xl size
            height={22} // Adjust based on visual estimation for text-4xl size
            priority // Since this is a logo at the top of the page, it should be prioritized
          />
          <p className="text-gray-dark mt-2">모임이 더 쉬워지는 순간</p>
        </div>
      </header>

      {/* Animal Image */}
      <div className="flex justify-end">
        <Image
          src="/images/img_animal.png"
          alt="동물 캐릭터"
          width={216}
          height={106}
          className="-mb-5 z-10 relative"
        />
      </div>

      {/* Invite Banner */}
      <div className="relative bg-gradient-to-r from-yellow-gradient to-white rounded-2xl pl-6 py-8 mb-9 overflow-hidden">
        <div className="relative z-10">
          <p className="font-bold text-242424 text-base mb-2">
            친구들을 초대해 볼까요?
          </p>
          <Link
            href="/group/create"
            className="inline-flex items-center bg-white px-4 py-2 rounded-full text-sm font-bold"
          >
            <Image
              src="/images/ic_plus.png"
              alt="플러스 아이콘"
              width={16}
              height={16}
              className="mr-2"
            />
            <span className="text-yellow-dark">모임 만들러 가기</span>
          </Link>
        </div>

        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-0">
          <Image
            src="/images/img_alarm.png"
            alt="알람"
            width={145}
            height={100}
          />
        </div>
      </div>

      {/* Room List */}
      <div>
        <h2 className="font-bold text-xl text-black mb-4">방 목록</h2>
        <div className="space-y-4">
          {rooms.map((room) => (
            <Link href={`/group/${room.id}`} key={room.id} className="block">
              <div className="flex items-center justify-between py-3 px-4 border-2 border-yellow-main rounded-2xl">
                <div>
                  {/* 방 제목 */}
                  <h3 className="font-bold text-yellow-main">{room.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                    {/* 방 특징 */}
                    <Tag text={room.tags[0]} textColor="text-white" />
                    {/* 참여 인원 수 */}
                    <span className="text-gray-dark">
                      {room.participantCount}명 참여 중
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {room.date && (
                    <div className="text-right mr-2">
                      <span className="text-sm text-gray-dark">
                        모임 확정 날짜
                      </span>

                      {/* 날짜 영역 */}
                      <div className="flex items-center justify-end w-full text-lg font-bold">
                        {(() => {
                          const [month, day] = room.date.split('-');

                          return (
                            <>
                              <span className="text-red-main">{month}</span>
                              <span className="text-black">월</span>

                              <span className="text-red-main ml-1">{day}</span>
                              <span className="text-black">일</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <Image
                    className="ml-3"
                    src="/images/ic_next.png"
                    alt="다음"
                    width={12}
                    height={12}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
