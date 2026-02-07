import React, { useState, useEffect } from 'react';
import { Header, Footer, BackToTopBtn,  Navbar2 } from '../components';
import { FaCookieBite } from 'react-icons/fa';

const DefaultLayout = ({ children }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    // แสดง banner ถ้ายังไม่เคยให้ความยินยอม หรือเคยปฏิเสธไปแล้ว (อาจจะอยากให้แสดงอีกครั้งหลังเวลาผ่านไป)
    // ในที่นี้จะแสดงถ้ายังไม่มีการตั้งค่าใดๆ
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieConsent(false);
    // คุณอาจต้องการเพิ่ม logic อื่นๆ ที่นี่ หากผู้ใช้ปฏิเสธ เช่น ปิดการใช้งานฟีเจอร์บางอย่าง
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300"
      id="myHeader" // คง id ไว้หากมีการใช้งานจากส่วนอื่น เช่น BackToTopBtn
    >
      
       <Header />

      {/* เพิ่ม <main> tag เพื่อความหมายทาง HTML ที่ดีขึ้น และจัด layout content ตรงกลาง */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <BackToTopBtn /> {/* ตรวจสอบให้แน่ใจว่าปุ่มนี้มีสไตล์ที่มองเห็นได้ชัดเจนทั้งใน light และ dark mode */}
{showCookieConsent && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl z-50">
    <div className="bg-white dark:bg-neutral-800 rounded-full shadow-2xl border border-slate-100 dark:border-neutral-700 p-2 pr-2 sm:pr-2 pl-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      
      <div className="flex items-center gap-3 flex-1 py-2 sm:py-0">
        <FaCookieBite className="text-yellow-500 text-xl shrink-0" />
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center sm:text-left">
          เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์และปรับปรุงประสบการณ์ของคุณ{' '}
          {/* เพิ่มส่วนลิงก์ตรงนี้ครับ */}
          <a 
            href="/TermsOfService" // ตรวจสอบ path ว่าตรงกับ route ของคุณหรือไม่
            className="whitespace-nowrap font-semibold underline underline-offset-2 text-slate-800 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors ml-1"
          >
            ดูรายละเอียด
          </a>
        </p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto pb-2 sm:pb-0 justify-center">
        <button
          onClick={handleDecline}
          className="px-5 py-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          ปฏิเสธ
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-black rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-transform hover:scale-105"
        >
          ยอมรับ
        </button>
      </div>
    </div>
  </div>
)}

      {/* หาก Map เป็นส่วนเนื้อหาหลัก ควรอยู่ใน <main> หรือถ้าเป็นส่วนเสริม อาจวางไว้ตำแหน่งนี้ */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      {/* <Map /> */}
      {/* </div> */}
      
      {/* ตรวจสอบให้แน่ใจว่า Message component มีสไตล์ที่ทันสมัยและรองรับ dark mode */}
      
      <Navbar2 /> {/* พิจารณาตำแหน่งของ Navbar2 หากเป็น navigation หลัก มักจะอยู่รวมกับ Header */}
                  {/* หากเป็น bottom bar หรือ utility bar ตำแหน่งปัจจุบันก็เหมาะสมแล้ว และควรปรับสไตล์ให้เข้ากัน */}

    </div>
  );
};

export default DefaultLayout;