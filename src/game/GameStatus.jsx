import React from 'react';

function GameStatus({ hearts, timeLeft, score, highScore, onExitToMenu }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = ('0' + (timeLeft % 60)).slice(-2);

  return (
    // เปลี่ยนเป็น Flexbox เพื่อจัดเป็น 2 กลุ่มใหญ่ (ซ้าย-ขวา)
    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center gap-4">
      
      {/* กลุ่มที่ 1: ชื่อเกมและปุ่มออก */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">🍣 Sushi Rush</h1>
        <button 
          onClick={onExitToMenu} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-lg text-sm transition-colors"
        >
          กลับเมนู
        </button>
      </div>

      {/* กลุ่มที่ 2: สถานะทั้งหมดรวมกัน */}
      <div className="flex items-center gap-4 md:gap-6 text-lg md:text-xl">
        <div>
          <span className="text-2xl">🏆</span>: <span className="font-bold text-amber-500">{highScore}</span>
        </div>
        <div>
          <span className="text-2xl">⭐</span>: <span className="font-bold text-yellow-500">{score}</span>
        </div>
        
        {/* เส้นคั่นเพื่อความสวยงาม */}
        <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block"></div>
        
        <div>
          <span className="text-2xl">❤️</span>: <span className="font-bold text-red-500">{hearts}</span>
        </div>
        <div>
          <span className="text-2xl">⏱️</span>: <span className="font-bold text-blue-600">{minutes}:{seconds}</span>
        </div>
      </div>
      
    </div>
  );
}

export default GameStatus;