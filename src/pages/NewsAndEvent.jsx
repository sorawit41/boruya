import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaChevronDown, FaTimes, FaCalendarAlt, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '../pages/supabaseClient'; // Path เดิมของคุณ

// --- CONSTANTS ---
const ALL_MONTHS_ORDER = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// --- SUB-COMPONENTS ---

const EventCard = ({ event, onCardClick, opacity }) => (
  <div
    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    style={{ opacity: opacity }}
    onClick={() => onCardClick(event)}
  >
    {/* Image Section - Fixed Height, No Pulse */}
    <div className="relative h-56 shrink-0 bg-gray-100 border-b border-gray-100">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Formal Date Badge - Square & Minimal */}
      <div className="absolute top-0 left-0 bg-white border-r border-b border-gray-200 px-4 py-3 flex flex-col items-center min-w-[70px]">
        <span className="text-sm font-semibold uppercase text-slate-500 tracking-wide">
          {new Date(event.date).toLocaleDateString('th-TH', { month: 'short' })}
        </span>
        <span className="text-2xl font-bold text-slate-800 leading-none mt-1">
          {new Date(event.date).getDate()}
        </span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
           EVENT
        </span>
        <span className="text-xs text-gray-400">
           {new Date(event.date).toLocaleDateString('th-TH', { year: 'numeric' })}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-blue-800 transition-colors">
        {event.title}
      </h3>
      
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-normal">
        {event.shortDescription}
      </p>

      <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-end">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
          อ่านต่อ
          <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);

const EventDetailPopup = ({ event, onClose }) => {
  if (!event) return null;

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in relative border border-gray-200"
        onClick={handleContentClick}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-10">
            <h4 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">รายละเอียดกิจกรรม</h4>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
                <FaTimes size={20} />
            </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar bg-white flex flex-col md:flex-row">
            {/* Image Side (Left or Top) */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Side */}
            <div className="w-full md:w-3/5 p-8 md:p-10">
                <div className="flex items-center gap-2 text-blue-800 mb-4 font-medium text-sm">
                    <FaCalendarAlt />
                    {new Date(event.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                    {event.title}
                </h3>

                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {event.fullDescription}
                </div>
            </div>
        </div>
        
        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
             <button 
               onClick={onClose}
               className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
               ปิดหน้าต่าง
             </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const NewsAndEventNavBar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeMonth, setActiveMonth] = useState("");
  const [contentOpacity, setContentOpacity] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('id, title, description, short_description, image_url, event_date')
          .order('event_date', { ascending: false });

        if (fetchError) throw fetchError;

        const processedEvents = data.map(event => {
          const dateObj = new Date(event.event_date);
          const month = dateObj.toLocaleDateString('th-TH', { month: 'long' }); 
          const shortDesc = event.short_description || (event.description ? event.description.substring(0, 100) + '...' : 'ไม่มีรายละเอียด');
          return {
            id: event.id,
            title: event.title,
            date: event.event_date,
            month: month,
            image: event.image_url || 'https://via.placeholder.com/600x400?text=No+Image',
            fullDescription: event.description,
            shortDescription: shortDesc,
          };
        });

        setEvents(processedEvents);

        if (processedEvents.length > 0) {
            const currentMonthName = new Date().toLocaleDateString('th-TH', { month: 'long' });
            const hasCurrentMonth = processedEvents.some(e => e.month === currentMonthName);
            setActiveMonth(hasCurrentMonth ? currentMonthName : processedEvents[0].month);
        } else {
             setActiveMonth(new Date().toLocaleDateString('th-TH', { month: 'long' }));
        }

      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูล Event ได้');
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const groupedEvents = useMemo(() => {
    if (!events.length) return {};
    return events.reduce((acc, event) => {
      (acc[event.month] = acc[event.month] || []).push(event);
      return acc;
    }, {});
  }, [events]);

  const eventsForActiveMonth = useMemo(() => groupedEvents[activeMonth] || [], [activeMonth, groupedEvents]);
  
  const availableMonths = useMemo(() => {
    const monthSet = new Set(events.map(e => e.month));
    return ALL_MONTHS_ORDER.filter(m => monthSet.has(m));
  }, [events]);

  const handleMonthChange = useCallback((month) => {
    if (month === activeMonth) {
        setIsDropdownOpen(false);
        return;
    }
    setContentOpacity(0); 
    setTimeout(() => {
        setActiveMonth(month);
        setIsDropdownOpen(false);
    }, 200); 
  }, [activeMonth]);

  const openEventPopup = useCallback((event) => {
    setSelectedEvent(event);
    setShowPopup(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeEventPopup = useCallback(() => {
    setShowPopup(false);
    setTimeout(() => setSelectedEvent(null), 300);
    document.body.style.overflow = 'auto'; 
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setContentOpacity(1), 100); 
    return () => clearTimeout(timer);
  }, [activeMonth, eventsForActiveMonth]); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.month-selector-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);
  
  // --- STATES ---

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-4">
        {/* Simple spinner, no pulse */}
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
            <div className="text-red-500 mb-4 flex justify-center"><FaTimes size={32}/></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">ขออภัย เกิดข้อผิดพลาด</h3>
            <p className="text-slate-500 mb-6 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white min-h-screen py-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* HEADER SECTION - Clean & Formal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-100 pb-6">
          <div className="text-left">
             <h4 className="text-blue-800 text-sm font-bold uppercase tracking-widest mb-2">
                News & Events
             </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              ข่าวสารและกิจกรรม
            </h2>
          </div>

          {/* MONTH SELECTOR - Standard Input Style */}
          <div className="relative month-selector-wrapper w-full md:w-64 z-20">
            <button
              type="button"
              className={`w-full flex items-center justify-between bg-white border border-gray-300 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${isDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-gray-400" />
                <span>{activeMonth || "เลือกเดือน"}</span>
              </div>
              <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
                 <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                    {(availableMonths.length > 0 ? availableMonths : ALL_MONTHS_ORDER).map((month) => (
                    <button
                        type="button"
                        key={month}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            activeMonth === month 
                            ? 'bg-blue-50 text-blue-700 font-semibold' 
                            : 'text-slate-600 hover:bg-gray-50'
                        }`}
                        onClick={() => handleMonthChange(month)}
                    >
                        {month}
                    </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div 
            className="transition-opacity duration-300 ease-out min-h-[300px]"
            style={{ opacity: contentOpacity }}
        >
            {eventsForActiveMonth.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {eventsForActiveMonth.map((item) => (
                <EventCard
                    key={item.id} 
                    event={item}
                    onCardClick={openEventPopup}
                    opacity={contentOpacity} 
                />
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-gray-300 mb-4">
                    <FaCalendarAlt size={40} />
                </div>
                <h3 className="text-lg font-semibold text-slate-600">ไม่มีกิจกรรมในเดือน {activeMonth}</h3>
            </div>
            )}
        </div>

        {/* MODAL */}
        {showPopup && selectedEvent && ( 
            <EventDetailPopup
              event={selectedEvent}
              onClose={closeEventPopup}
            />
        )}
      </div>
      
      {/* Styles */}
      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
};

export default NewsAndEventNavBar;