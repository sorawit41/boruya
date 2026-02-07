// src/components/UnifiedFooter.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import companyLogo from "../assets/logo/Boruya Logo.png"; 

const UnifiedFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinkGroups = [
    {
      title: "เมนูหลัก",
      links: [
        { name: "เกี่ยวกับ", href: "/" },
        { name: "กิจกรรมทางร้าน", href: "/NewsAndEvent" },
        { name: "เกมส์ทางร้าน", href: "/Game" },
        { name: "รับสมัครพนักงาน", href: "/register" },
      ],
    },
    {
      title: "เมนู & ไอเทม",
      links: [
        { name: "เมนูอาหาร", href: "/Menu" },
        { name: "เมนูเครื่องดื่ม", href: "/Menu" }, 
      ]
    },
    {
        title: "ช่วยเหลือ",
        links: [
          { name: "ติดต่อเรา", href: "/contact" },
          { name: "คำถามที่พบบ่อย", href: "/contact" }, 
        ]
      }
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: "ศูนย์การค้า MBK Center, แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330" },
    { icon: <FaPhone />, text: "064 232 8899" },
    { icon: <FaEnvelope />, text: "Boruyasushi.mbk@gmail.com" },
  ];

  const openingHours = [
    { icon: <FaClock />, days: "ทุกวัน", hours: "11.00 น. - 05.00 น." },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=61576826248467" },
    { name: "Instagram", icon: <FaInstagram />, href: "https://www.instagram.com/boruyasushi/" },
    { name: "TikTok", icon: <FaTiktok />, href: "#" },
  ];
  
  const legalLinks = [
    { name: "นโยบายความเป็นส่วนตัว", href: "/PrivacyPolicy" },
    { name: "ข้อกำหนดการให้บริการ", href: "/TermsOfService" },
  ];

  return (
    // ✨ MODIFIED: ปรับเป็นสีแดงเข้ม #991b1b
    <footer className="bg-[#991b1b]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* --- Main Footer Content --- */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
          
          {/* Column 1: Logo and Business Info */}
          <div className="md:col-span-2 xl:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src={companyLogo}
                alt="Boruya Sushi Logo"
                className="h-16 w-auto" // ไม่ใส่ grayscale
              />
            </Link>
            <p className="text-white max-w-sm">
              ร้านซูชิสไตล์ญี่ปุ่นที่พร้อมมอบประสบการณ์สุดพิเศษใจกลางกรุงเทพฯ ที่ MBK Center
            </p>
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-3">เวลาทำการ</h4>
              {openingHours.map((item, index) => (
                <div key={index} className="flex items-center text-white">
                  <span className="text-white mr-3">{item.icon}</span>
                  <span><strong>{item.days}:</strong> {item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Groups Columns */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-white hover:text-red-200 hover:translate-x-1 block transition-all duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column for Contact Information */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">ติดต่อเรา</h3>
            <ul className="space-y-4">
               {contactInfo.map((item, index) => (
                   <li key={index} className="flex items-start">
                       <span className="text-white mr-3 mt-1 flex-shrink-0">{item.icon}</span>
                       <span className="text-white">{item.text}</span>
                   </li>
               ))}
            </ul>
         </div>
        </div>
      </div>
        
      {/* --- Sub-Footer: Copyright and Socials --- */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
                
                {/* Copyright */}
                <div className="text-sm text-white text-center md:text-left">
                    &copy; {currentYear} Boruya Sushi. All Rights Reserved.
                </div>

                {/* Legal Links */}
                <div className="flex items-center gap-x-6">
                    {legalLinks.map((link) => (
                        <Link key={link.name} to={link.href} className="text-xs text-white hover:text-red-200 transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center gap-x-3">
                    {socialLinks.map((social) => (
                    <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`เยี่ยมชม ${social.name} ของ Boruya Sushi`}
                        // ✨ MODIFIED: เมื่อ Hover เปลี่ยนเป็นสีแดงเข้ม #991b1b
                        className="group w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white transition-all duration-300"
                    >
                        <span className="text-white group-hover:text-[#991b1b] transition-colors duration-300">
                          {React.cloneElement(social.icon, { className: "w-4 h-4" })}
                        </span>
                    </a>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default UnifiedFooter;