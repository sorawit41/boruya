import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const qrRef = useRef();

  // ฟังก์ชันสำหรับดาวน์โหลด QR Code
  const handleDownload = () => {
    // ใช้ ref เพื่อเข้าถึง div ที่ครอบ canvas อยู่
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      // แปลงภาพบน canvas เป็นไฟล์ PNG ในรูปแบบ data URL
      const image = canvas.toDataURL('image/png');
      
      // สร้าง link element ชั่วคราวขึ้นมา
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = 'qrcode.png'; // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
      
      // เพิ่ม link เข้าไปในหน้าเว็บ, สั่งให้คลิก, แล้วลบออก
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">QR Code Generator</h2>
        <p className="text-gray-500 mb-6">ป้อน URL ที่ต้องการเพื่อสร้าง QR Code</p>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full max-w-sm p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ส่วนที่แสดง QR Code */}
        <div ref={qrRef} className="inline-block p-4 bg-white border rounded-lg">
          <QRCodeCanvas
            value={url || 'https://www.facebook.com/Boruyasushi'} // ถ้าไม่มี URL จะใช้ค่าเริ่มต้น
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={true}
          />
        </div>

        {/* ปุ่มดาวน์โหลด */}
        <button
          onClick={handleDownload}
          className="mt-6 w-full max-w-sm bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
