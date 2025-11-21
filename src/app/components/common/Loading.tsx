// // ver1. 동그라미 세개 가로로
// export default function Loading() {
//   return (
//     <div className="flex items-center justify-center h-screen space-x-2">
//       <div className="w-4 h-4 rounded-full bg-main-green animate-bounce" style={{ animationDelay: '0s' }}></div>
//       <div className="w-4 h-4 rounded-full bg-main-green animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//       <div className="w-4 h-4 rounded-full bg-main-green animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//     </div>
//   );
// }

// ver2. 동그라미들이 돌아감
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-24 h-24 animate-[spin-slow_2s_linear_infinite]">
        {" "}
        {/* 이 div가 전체를 회전시킵니다 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-start justify-center" // 각 동그라미의 '스포크'를 만듭니다
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: "center center",
            }}
          >
            <div
              className="w-4 h-4 bg-main-green rounded-full animate-[dot-scale_1s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.125}s` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
