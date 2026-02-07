import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaRegNewspaper, FaPlay, FaMapMarkedAlt, FaChevronRight } from 'react-icons/fa';

const navItems = [
  { id: 'hero', label: 'หน้าหลัก', icon: <FaHome /> },
  { id: 'NewsAndEvent', label: 'ข่าวสาร', icon: <FaRegNewspaper /> },
  { id: 'Media', label: 'วิดีโอ', icon: <FaPlay /> },
  { id: 'Map', label: 'แผนที่', icon: <FaMapMarkedAlt /> },
];

const SideNav = () => {
  const [activeItem, setActiveItem] = useState('');
  const [isVisible, setIsVisible] = useState(true); // State ควบคุมการแสดงผล
  const timeoutRef = useRef(null); // Ref สำหรับเก็บ Timer

  // ฟังก์ชันแสดงเมนู และเริ่มนับเวลาถอยหลังเพื่อซ่อน
  const showNav = () => {
    setIsVisible(true);
    
    // เคลียร์ Timer เก่า (ถ้ามี)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // ตั้ง Timer ใหม่: อีก 3 วินาทีให้ซ่อน (setIsVisible เป็น false)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  // Scrollspy Logic + Auto Hide Trigger
  useEffect(() => {
    const handleScroll = () => {
      // 1. เรียกฟังก์ชันแสดงเมนูทุกครั้งที่ Scroll
      showNav();

      // 2. Logic เดิมสำหรับหา Active Section
      const centerScreen = window.scrollY + window.innerHeight / 2;
      let currentId = '';
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          if (element.offsetTop <= centerScreen && (element.offsetTop + element.offsetHeight) > centerScreen) {
            currentId = item.id;
            break; 
          }
        }
      }
      setActiveItem(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    
    // เรียกครั้งแรกตอนโหลดหน้า
    showNav();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    showNav(); // กดแล้วให้นับเวลาใหม่
  };

  return (
    // Wrapper หลัก: ใช้ pointer-events-none เมื่อซ่อน เพื่อไม่ให้บังการคลิกพื้นหลัง
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      
      {/* 1. ปุ่มเรียกเมนู (แสดงเมื่อเมนูซ่อนอยู่) */}
      <button
        onClick={showNav}
        className={`
          absolute top-1/2 -translate-y-1/2 -left-2
          w-10 h-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md
          rounded-full shadow-lg border border-white/20 text-rose-500
          flex items-center justify-center
          transition-all duration-500 ease-in-out
          hover:scale-110 hover:bg-white
          ${!isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-10 pointer-events-none'}
        `}
      >
        <FaChevronRight className="animate-pulse" />
      </button>

      {/* 2. ตัวเมนูหลัก */}
      <div 
        // เมื่อเอาเมาส์ชี้ (Hover) ให้ยกเลิกการซ่อนชั่วคราว
        onMouseEnter={() => {
          setIsVisible(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        // เมื่อเมาส์ออก ให้เริ่มนับเวลาซ่อนใหม่
        onMouseLeave={showNav}
        
        className={`
          flex flex-col gap-2 p-2 rounded-2xl
          bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md
          border border-white/20 dark:border-white/10
          shadow-2xl shadow-black/5
          transition-all duration-500 ease-in-out origin-left
          ${isVisible 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 -translate-x-20 scale-90 pointer-events-none'}
        `}
      >
        {navItems.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="relative group flex items-center justify-center"
            >
              {/* Icon Container */}
              <div 
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-100' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600'}
                `}
              >
                {item.icon}
              </div>

              {/* Tooltip Label */}
              <div className="absolute left-full pl-4 pointer-events-none overflow-hidden">
                <span className={`
                  block px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                  bg-slate-800 text-white dark:bg-white dark:text-slate-900
                  shadow-xl transition-all duration-300 transform
                  ${isVisible ? (isActive ? 'opacity-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0') : 'opacity-0'}
                `}>
                  {item.label}
                </span>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute -left-1 w-1 h-4 bg-rose-500 rounded-r-full" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;