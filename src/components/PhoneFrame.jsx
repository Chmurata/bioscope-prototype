export default function PhoneFrame({ children }) {
  return (
    <div className="h-screen flex items-center justify-center py-4 flex-shrink-0">
      <div
        className="relative bg-bg rounded-[50px] shadow-2xl border-[8px] border-gray-900 overflow-hidden ring-4 ring-gray-800/50 box-content"
        style={{
          width: '360px',
          height: 'min(780px, calc(100vh - 32px))',
          aspectRatio: '360 / 780',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[30px] bg-gray-900 rounded-b-[18px] z-50" />
        {/* Screen content */}
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
