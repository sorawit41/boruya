import { FaFacebookMessenger } from 'react-icons/fa';

const FloatingMessengerButton = () => {

  return (
    // ปรับตำแหน่งปุ่มให้ใกล้เข้ามาเล็กน้อย
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className={`
        absolute bottom-1/2 right-full -translate-y-1/2 mr-3 px-4 py-2
        bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-lg
        whitespace-nowrap transition-all duration-300 ease-in-out
        transform opacity-0 group-hover:opacity-100
      `}>
        สอบถามทาง Messenger
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-800 transform rotate-45"></div>
      </div>

      {/* Messenger Button */}
      <a
        href="https://m.me/61576826248467"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          relative w-14 h-14 flex items-center justify-center {/* <-- ปรับขนาดปุ่ม */}
          bg-gradient-to-br from-blue-500 to-purple-600 text-white
          rounded-full shadow-2xl cursor-pointer
          transform transition-all duration-300 ease-in-out
          hover:scale-110
          animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]
          opacity-100 translate-y-0
        `}
        aria-label="ติดต่อเราผ่าน Facebook Messenger"
      >
        <FaFacebookMessenger className="text-2xl" /> {/* <-- ปรับขนาดไอคอน */}
        
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 block h-3 w-3 {/* <-- ปรับขนาดจุด */}
          bg-red-500 border-2 border-white rounded-full
          animate-ping"></span>
        <span className="absolute top-0 right-0 block h-3 w-3 {/* <-- ปรับขนาดจุด */}
          bg-red-500 border-2 border-white rounded-full"></span>
      </a>
    </div>
  );
};

export default FloatingMessengerButton;