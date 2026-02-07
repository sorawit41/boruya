import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaCalendarAlt, FaTimes, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { supabase } from '../pages/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONSTANTS ---
const ALL_MONTHS_ORDER = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// --- SUB-COMPONENTS ---

const InfoPill = ({ icon, text }) => (
  <div className="flex items-center space-x-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
    {icon && <span>{icon}</span>}
    <span>{text}</span>
  </div>
);

const EventCard = ({ event, onClick }) => {
  const dateObj = new Date(event.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      onClick={() => onClick(event)}
      className="group cursor-pointer bg-white flex flex-col h-full rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

        {/* Floating Date Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm text-center">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
            {dateObj.toLocaleDateString('th-TH', { month: 'short' })}
          </span>
          <span className="block text-2xl font-light text-gray-900 leading-none mt-1">
            {dateObj.getDate()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <InfoPill text={dateObj.toLocaleDateString('th-TH', { year: 'numeric' })} />
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-gray-600 transition-colors leading-snug">
          {event.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
          {event.shortDescription}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase group-hover:text-gray-900 transition-colors duration-300">Read More</span>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
            <FaArrowRight size={10} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl relative flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-800 transition-all shadow-sm"
          >
            <FaTimes />
          </button>

          {/* Hero Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto">
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">
              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                {new Date(event.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 leading-tight">
              {event.title}
            </h2>

            <div className="prose prose-gray max-w-none text-gray-600 font-light leading-loose whitespace-pre-wrap text-sm md:text-base">
              {event.fullDescription}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MAIN COMPONENT ---

const NewsAndEventNavBar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMonth, setActiveMonth] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
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
            image: event.image_url || 'https://via.placeholder.com/600x400?text=No+Image', // Should replace with a better default
            fullDescription: event.description,
            shortDescription: shortDesc,
          };
        });

        setEvents(processedEvents);

        // Logic to clear set active month
        if (processedEvents.length > 0) {
          const currentMonthName = new Date().toLocaleDateString('th-TH', { month: 'long' });
          const hasCurrentMonth = processedEvents.some(e => e.month === currentMonthName);
          setActiveMonth(hasCurrentMonth ? currentMonthName : processedEvents[0].month);
        } else {
          setActiveMonth(new Date().toLocaleDateString('th-TH', { month: 'long' }));
        }

      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
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

  const availableMonths = useMemo(() => {
    const monthSet = new Set(events.map(e => e.month));
    return ALL_MONTHS_ORDER.filter(m => monthSet.has(m));
  }, [events]);

  const displayedEvents = groupedEvents[activeMonth] || [];

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <FaSpinner className="animate-spin text-gray-300 text-2xl" />
    </div>
  );

  if (error) return null;

  return (
    <section className="bg-white min-h-screen py-24 font-sans selection:bg-black selection:text-white">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Updates</span>
          <h2 className="text-4xl md:text-6xl font-extralight text-gray-900 tracking-tight">
            News & Events
          </h2>
        </div>

        {/* HORIZONTAL FILTER */}
        <div className="mb-16 overflow-x-auto no-scrollbar border-b border-gray-100">
          <div className="flex space-x-8 pb-4 min-w-max">
            {(availableMonths.length > 0 ? availableMonths : ALL_MONTHS_ORDER).map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`text-sm tracking-widest uppercase transition-all duration-300 relative py-2 ${activeMonth === month
                    ? 'text-gray-900 font-bold'
                    : 'text-gray-400 font-medium hover:text-gray-600'
                  }`}
              >
                {month}
                {activeMonth === month && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          <AnimatePresence mode='popLayout'>
            {displayedEvents.length > 0 ? (
              displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={setSelectedEvent}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <p className="text-gray-300 font-light text-xl">ไม่มีกิจกรรมในเดือนนี้</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Detail Modal */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

      </div>
      <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none; 
            scrollbar-width: none; 
          }
      `}</style>
    </section>
  );
};

export default NewsAndEventNavBar;