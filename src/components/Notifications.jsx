import React, { useState, useEffect } from 'react';
import { supabase } from '../pages/supabaseClient';
import { HiOutlineMegaphone, HiXMark } from "react-icons/hi2";

const Announcements = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, message, link')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const currentAnnouncement = data[0];
          const dismissedId = localStorage.getItem('dismissedAnnouncementId');

          if (dismissedId !== String(currentAnnouncement.id)) {
            setAnnouncement(currentAnnouncement);
            setIsVisible(true);
            setTimeout(() => setIsEntering(true), 100);
          }
        }
      } catch (error) {
        console.error("Error fetching announcements:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleClose = () => {
    if (announcement) {
      localStorage.setItem('dismissedAnnouncementId', announcement.id);
    }
    setIsEntering(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (loading || !isVisible || !announcement) {
    return null;
  }

  return (
    <aside
      role="banner"
      className={`bg-white text-gray-800 shadow-md border-b border-gray-200 z-50 transition-all duration-300 ease-in-out ${
        isEntering ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-3 min-h-[60px] relative">

          <div className="flex-grow flex items-center min-w-0 mr-4">
            <div className="flex-shrink-0 mr-4">
              {/* เปลี่ยนสีพื้นหลังไอคอนให้เข้ากับธีมขาว */}
              <div className="bg-sky-100 text-sky-600 p-2 rounded-full animate-subtle-pulse">
                <HiOutlineMegaphone 
                  className="h-6 w-6"
                  aria-hidden="true" 
                />
              </div>
            </div>

            {announcement.link ? (
              <a 
                href={announcement.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                // เปลี่ยนสีตัวอักษรและ focus ring
                className="text-sm sm:text-base font-semibold text-gray-700 truncate hover:text-sky-600 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md"
              >
                {announcement.message}
              </a>
            ) : (
              <p className="text-sm sm:text-base font-semibold text-gray-700 truncate">
                {announcement.message}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              aria-label="Dismiss"
              // เปลี่ยนสีปุ่มและ focus ring
              className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <HiXMark className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Announcements;