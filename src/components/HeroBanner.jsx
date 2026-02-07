import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { supabase } from '../pages/supabaseClient'; // << ตรวจสอบว่า path ถูกต้อง

// Skeleton Loader Component สำหรับแสดงผลระหว่างรอโหลดข้อมูล
const SkeletonLoader = () => (
  <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-gray-100 dark:bg-gray-100 animate-pulse" />
);

const HeroBanner = () => {
  // ... (ส่วน state และ useEffect เหมือนเดิม) ...
  const [slidesData, setSlidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannerImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('hero_banners')
          .select('id, image_url, alt_text, link_url')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true });
        if (fetchError) throw fetchError;
        const formattedSlides = data.map(banner => ({
          id: banner.id,
          src: banner.image_url,
          alt: banner.alt_text,
          link: banner.link_url,
        }));
        setSlidesData(formattedSlides);
      } catch (err) {
        console.error("Error fetching banner images:", err);
        setError("ไม่สามารถโหลดข้อมูล Banner ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchBannerImages();
  }, []);

  // ... (ส่วนแสดงผล loading, error, no data เหมือนเดิม) ...
  if (loading) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto pt-10">
        <SkeletonLoader />
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto pt-10">
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-red-900 flex flex-col items-center justify-center text-center p-4 text-white">
          <p className="text-xl font-semibold">เกิดข้อผิดพลาด</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  if (!slidesData || slidesData.length === 0) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto pt-10">
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] bg-gray-800 flex items-center justify-center text-center p-4 text-white">
          <p className="text-xl">ไม่มีรูปภาพสำหรับ Banner ในขณะนี้</p>
        </div>
      </div>
    )
  }

  // 4. แสดงผล Carousel เมื่อมีข้อมูลพร้อมแล้ว
  return (
    <div className="relative w-full max-w-[1360px] mx-auto pt-10">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        interval={5000}
        emulateTouch={true}
      >
        {slidesData.map((slide, index) => (
          // ✅ เปลี่ยนพื้นหลังจาก bg-black เป็น bg-gray-200 dark:bg-gray-800
          <div 
            key={slide.id} 
            className="w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden bg-gray-200 dark:bg-gray-800"
          >
            {slide.link ? (
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-contain"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </a>
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-contain"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroBanner;