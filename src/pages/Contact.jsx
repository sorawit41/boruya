import React, { useState, useRef } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
// --- 1. Import Supabase Client และ ReCAPTCHA ---
import { supabase } from './supabaseClient'; // << ตรวจสอบว่า path ถูกต้อง
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
  // --- 2. เพิ่ม State สำหรับจัดการการส่งข้อมูล และ ReCAPTCHA ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef();
  
  // --- Site Key สำหรับ ReCAPTCHA ---
  const RECAPTCHA_SITE_KEY = '6LfTxV8rAAAAAIL8kp_sqm6KAUzrpo2UFgW-BcPC';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // --- 3. อัปเดตฟังก์ชัน handleSubmit ให้ส่งข้อมูลไปที่ Supabase ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
        setSubmitStatus({ success: false, message: 'กรุณายืนยันว่าคุณไม่ใช่บอท' });
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
        // **สำคัญ:** ตรวจสอบว่าคุณมีตารางชื่อ 'contacts' ใน Supabase
        // และมีคอลัมน์: firstName, lastName, email, subject, message
        const { error } = await supabase
            .from('contacts')
            .insert([{ 
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            }]);

        if (error) {
            throw error;
        }

        setSubmitStatus({ success: true, message: 'ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด' });
        // เคลียร์ฟอร์มหลังจากส่งสำเร็จ
        setFormData({
            firstName: '', lastName: '', email: '', subject: '', message: '',
        });
        recaptchaRef.current.reset(); // รีเซ็ต reCAPTCHA

    } catch (error) {
        console.error('Error submitting form:', error.message);
        setSubmitStatus({ success: false, message: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            ติดต่อเรา
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            เรายินดีรับฟังทุกความคิดเห็นและพร้อมให้ความช่วยเหลือ กรุณากรอกฟอร์มด้านล่างหรือติดต่อเราผ่านช่องทางอื่นๆ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ข้อมูลการติดต่อ</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <FaMapMarkerAlt className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">ที่อยู่</h3>
                  <p className="text-gray-600">444 ถ. พญาไท แขวงวังใหม่ Subdistrict   <br/> กรุงเทพมหานคร 10330 ไทย กรุงเทพมหานคร.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhoneAlt className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">โทรศัพท์</h3>
                  <p className="text-gray-600">064 232 8899</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">อีเมล</h3>
                  <p className="text-gray-600">Boruyasushi.mbk@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">ติดตามเราได้ที่</h3>
                <div className="flex space-x-4 mt-4">
                    <a href="https://www.facebook.com/Boruyasushi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                        <FaFacebook size={32} />
                    </a>
                    <a href="https://www.instagram.com/boruyasushi/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                        <FaInstagram size={32} />
                    </a>
                </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">ส่งข้อความถึงเรา</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* --- Fields ต่างๆ เหมือนเดิม --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อจริง</label>
                  <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">นามสกุล</label>
                  <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">หัวข้อ</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">ข้อความ</label>
                <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>

              {/* --- 4. เพิ่ม Component ReCAPTCHA ในฟอร์ม --- */}
              <div className="flex justify-center">
                 <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                />
              </div>
              
              <div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </div>

              {/* --- 5. เพิ่มส่วนแสดงผลลัพธ์การส่ง --- */}
              {submitStatus.message && (
                <p className={`text-center font-medium ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                    {submitStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
        
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">ตำแหน่งของเรา</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.551825866164!2d100.5612140758178!3d13.745672897217036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ee109dab6e1%3A0xfd1898c1a32a2203!2sTerminal%2021%20Asok!5e0!3m2!1sen!2sth!4v1726220087134!5m2!1sen!2sth" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;