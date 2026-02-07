import React, { useState, useEffect } from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // --- Boruyasushi theme ---
  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.7s ease-in-out',
    padding: '50px 40px',
    maxWidth: '960px',
    margin: '60px auto',
    lineHeight: '1.8',
    fontSize: '1rem',
    color: '#34495e',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    fontFamily: "'Noto Sans Thai', 'Helvetica', 'Arial', sans-serif",
    borderTop: '5px solid #16a085',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '25px',
  };

  const iconStyle = {
    fontSize: '2.8rem',
    marginRight: '20px',
    color: '#16a085',
  };

  const headingStyle = {
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: "'Noto Sans Thai', sans-serif",
  };

  const heading1Style = {
    ...headingStyle,
    fontSize: '2.4rem',
    margin: '0',
  };

  const heading2Style = {
    ...headingStyle,
    fontSize: '1.75rem',
    marginTop: '45px',
    marginBottom: '20px',
    paddingBottom: '10px',
  };

  const ulStyle = {
    listStyleType: 'disc',
    paddingLeft: '25px',
    marginBottom: '20px',
  };

  const liStyle = {
    marginBottom: '12px',
  };

  const paragraphStyle = {
    marginBottom: '20px',
  };

  const lastUpdatedStyle = {
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: '30px',
    textAlign: 'right',
    fontSize: '0.9rem',
  };

  const strongStyle = {
    color: '#16a085',
    fontWeight: '700',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <BsPatchCheckFill style={iconStyle} />
        <h1 style={heading1Style}>นโยบายความเป็นส่วนตัว</h1>
      </div>
      <p style={lastUpdatedStyle}>
        ปรับปรุงแก้ไขล่าสุด: 14 กันยายน 2568
      </p>

      <p style={paragraphStyle}>
        เว็บไซต์ <strong style={strongStyle}>Boruyasushi.com</strong> ("เรา" หรือ "เว็บไซต์") ตระหนักและเคารพในสิทธิความเป็นส่วนตัวของผู้ใช้บริการทุกท่าน นโยบายความเป็นส่วนตัวฉบับนี้ ("นโยบาย") จัดทำขึ้นเพื่อชี้แจงแนวทางการเก็บรวบรวม, การใช้, และการจัดการข้อมูลของท่าน
      </p>

      <h2 style={heading2Style}>1. ข้อมูลที่เราเก็บรวบรวม</h2>
      <p style={paragraphStyle}>เว็บไซต์ของเราอาจมีการใช้คุกกี้ (Cookies) และเทคโนโลยีอื่นที่คล้ายคลึงกัน เพื่อเก็บรวบรวมข้อมูลการเข้าใช้บริการของท่านโดยอัตโนมัติ ซึ่งอาจประกอบด้วย:</p>
      <ul style={ulStyle}>
        <li style={liStyle}><strong style={strongStyle}>ข้อมูลการใช้งาน (Usage Data):</strong> รายละเอียดปฏิสัมพันธ์ระหว่างท่านกับเว็บไซต์ อาทิ หน้าเว็บที่เข้าชม, ระยะเวลาที่ใช้ในแต่ละหน้า, ลำดับการเข้าชม, และลิงก์ที่คลิก</li>
        <li style={liStyle}><strong style={strongStyle}>ข้อมูลอุปกรณ์ (Device Data):</strong> ข้อมูลจำเพาะทางเทคนิคของอุปกรณ์ที่ใช้ในการเข้าถึงบริการ เช่น หมายเลขที่อยู่ไอพี (IP Address), ประเภทและเวอร์ชันของระบบปฏิบัติการและเบราว์เซอร์</li>
      </ul>

      <h2 style={heading2Style}>2. วัตถุประสงค์ในการประมวลผลข้อมูล</h2>
      <p style={paragraphStyle}>เราจะใช้ข้อมูลที่เก็บรวบรวมมาเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>เพื่อวิเคราะห์และทำความเข้าใจพฤติกรรมการใช้งาน เพื่อนำไปสู่การปรับปรุงเนื้อหา, การออกแบบ, และประสิทธิภาพของเว็บไซต์</li>
        <li style={liStyle}>เพื่อตรวจสอบและวิเคราะห์ข้อมูลเชิงสถิติเกี่ยวกับจำนวนผู้เข้าชมและแนวโน้มการใช้งานโดยรวม</li>
        <li style={liStyle}>เพื่อยกระดับความปลอดภัยของระบบและป้องกันการกระทำอันมิชอบด้วยกฎหมาย</li>
      </ul>
      <p style={paragraphStyle}>
        โดยทั่วไป ข้อมูลที่ถูกเก็บรวบรวมผ่านคุกกี้จะไม่สามารถใช้ระบุถึงตัวตนของท่านได้โดยตรง เว้นแต่ท่านจะได้ให้ข้อมูลส่วนบุคคลแก่เราผ่านช่องทางอื่น
      </p>

      <h2 style={heading2Style}>3. การจัดการคุกกี้</h2>
      <p style={paragraphStyle}>
        ท่านสามารถควบคุมและจัดการการตั้งค่าคุกกี้ได้โดยตรงผ่านเบราว์เซอร์ของท่าน ซึ่งท่านสามารถเลือกที่จะยอมรับ, ปฏิเสธ, หรือลบคุกกี้ได้ อย่างไรก็ตาม การปิดใช้งานคุกกี้บางประเภทอาจส่งผลกระทบต่อการทำงานของเว็บไซต์ และฟังก์ชันบางอย่างอาจไม่สามารถใช้งานได้อย่างสมบูรณ์
      </p>

      <h2 style={heading2Style}>4. ช่องทางการติดต่อ</h2>
      <p style={paragraphStyle}>
        หากท่านมีข้อสงสัยหรือข้อเสนอแนะเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ กรุณาติดต่อเราผ่านช่องทางดังต่อไปนี้:
      </p>
      <p style={paragraphStyle}>
        <strong style={strongStyle}>อีเมล:</strong> contact@boruyasushi.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;