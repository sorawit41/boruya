import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaFacebookSquare, FaTiktok, FaPlayCircle, FaVideoSlash } from 'react-icons/fa';
import { supabase } from '../pages/supabaseClient'; // << ตรวจสอบว่า path ไปยัง supabaseClient ถูกต้อง

// --- Helper Component สำหรับแสดงโครงร่างตอนโหลด (Skeleton) ---
const VideoSkeleton = () => (
    <div className="animate-pulse">
        <div className="relative bg-gray-200 rounded-md aspect-video"></div>
    </div>
);

// --- Helper Component สำหรับแสดงข้อความเมื่อไม่มีวิดีโอ ---
const NoVideosMessage = () => (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center text-center">
        <FaVideoSlash className="text-5xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">ไม่พบวิดีโอ</h3>
        <p className="text-gray-500 mt-1">ยังไม่มีวิดีโอในหมวดหมู่นี้</p>
    </div>
);


const VideoGrid = ({ videos, title, facebook = false, tiktok = false, loading = false }) => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        // ให้ animation ทำงานเมื่อโหลดเสร็จแล้วเท่านั้น
        if (!loading) {
            const timer = setTimeout(() => setFadeIn(true), 100); // ลด delay ลงเล็กน้อย
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // ถ้าไม่มีวิดีโอและโหลดเสร็จแล้ว ให้แสดง Component NoVideosMessage
    if (!loading && videos.length === 0) {
        return (
             <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                    {facebook ? <FaFacebookSquare className="mr-2 text-blue-600" /> :
                        tiktok ? <FaTiktok className="mr-2 text-black" /> :
                            null}
                    {title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NoVideosMessage />
                </div>
            </div>
        );
    }

    return (
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                {facebook ? <FaFacebookSquare className="mr-2 text-blue-600" /> :
                    tiktok ? <FaTiktok className="mr-2 text-black" /> :
                        null}
                {title}
            </h3>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}>
                {loading ? (
                    // แสดง Skeleton 6 อันขณะโหลด
                    Array.from({ length: 6 }).map((_, index) => <VideoSkeleton key={index} />)
                ) : (
                    videos.map((video, index) => (
                        <div
                            key={video.id}
                            className={`transform transition-all duration-700 ease-out   
                            ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}  
                            hover:scale-[1.03]`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className={`relative overflow-hidden bg-white rounded-md shadow-lg border border-gray-100
                                ${facebook || tiktok ? 'aspect-[9/16]' : 'aspect-video'}`}>

                                {facebook ? (
                                    <div className="w-full aspect-[9/16] relative">
                                        <iframe
                                            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=0&width=360`}
                                            className="absolute top-0 left-0 w-full h-full rounded-md"
                                            style={{ border: 'none', overflow: 'hidden', objectFit: 'cover' }}
                                            scrolling="no"
                                            frameBorder="0"
                                            allowFullScreen
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        ></iframe>
                                    </div>
                                ) : tiktok ? (
                                    <iframe
                                        src={video.url}
                                        className="absolute top-0 left-0 w-full h-full"
                                        style={{ objectFit: 'cover' }}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        title={`TikTok Video ${video.id}`}
                                    />
                                ) : (
                                    <ReactPlayer
                                        controls
                                        url={video.url}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-md"
                                    />
                                )}
                                {!(facebook || tiktok) && <FaPlayCircle className="absolute top-2 right-2 text-white text-xl drop-shadow" />}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const Media = () => {
    const [source, setSource] = useState('facebook');
    const [facebookVideos, setFacebookVideos] = useState([]);
    const [tiktokVideos, setTiktokVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error: dbError } = await supabase
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (dbError) throw dbError;

                if (data) {
                    setFacebookVideos(data.filter(v => v.platform === 'facebook'));
                    setTiktokVideos(data.filter(v => v.platform === 'tiktok'));
                }
            } catch (err) {
                console.error('Error fetching videos:', err.message);
                setError('เกิดข้อผิดพลาดในการโหลดวิดีโอ');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // แสดงข้อความ Error หากการดึงข้อมูลล้มเหลว
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <div className="max-w-7xl mx-auto py-8 pt-40 px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">วิดีโอเกี่ยวกับร้าน</h2>

                <div className="flex justify-center mb-10 gap-1">
                    <button
                        className={`px-6 py-2 text-lg font-semibold rounded-l-full transition-colors duration-300 ${
                            source === 'facebook' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        onClick={() => setSource('facebook')}
                    >
                        <FaFacebookSquare className="inline mr-2" />
                        Facebook
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-semibold rounded-r-full transition-colors duration-300 ${
                            source === 'tiktok' ? 'bg-black text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        onClick={() => setSource('tiktok')}
                    >
                        <FaTiktok className="inline mr-2" />
                        TikTok
                    </button>
                </div>

                {source === 'facebook' && <VideoGrid videos={facebookVideos} title="วิดีโอ Facebook" facebook loading={loading} />}
                {source === 'tiktok' && <VideoGrid videos={tiktokVideos} title="วิดีโอ TikTok" tiktok loading={loading} />}
            </div>
        </div>
    );
};

export default Media;