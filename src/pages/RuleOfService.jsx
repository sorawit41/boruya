import React from 'react';

// Import your images - Food Menu
import image1 from '../assets/Rules/ค่าปรับต่างๆ new-1.jpg';
import image2 from '../assets/Rules/ค่าปรับต่างๆ new-3.jpg';

const DrinkMenu = () => {
  // 1. Style สำหรับ Container หลัก
  const menuContainerStyle = {
    backgroundColor: '#ffffff', // เปลี่ยนเป็นสีขาว
    minHeight: '100vh',         // ให้ความสูงเต็มหน้าจอเสมอ
    padding: '60px 20px',       // เพิ่ม padding ให้เนื้อหาไม่ชิดขอบเกินไป
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Sarabun', 'Prompt', sans-serif", // (Optional) แนะนำให้ใช้ฟอนต์ไทยสวยๆ
  };

  // 2. เพิ่ม Style สำหรับหัวข้อ (Header Decoration)
  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',              // สีตัวอักษรเข้ม
    marginBottom: '40px',
    borderBottom: '3px solid #FFD700', // เส้นขีดสีทอง/เหลือง ด้านล่างเพื่อความสวยงาม
    paddingBottom: '10px',
    textAlign: 'center',
    letterSpacing: '1px',
  };

  // 3. ปรับปรุง Style ของรูปภาพ
  const imageStyle = {
    width: '100%',
    maxWidth: '700px',          // ปรับขนาดสูงสุดให้พอดิบพอดีสายตา
    height: 'auto',
    display: 'block',
    marginBottom: '30px',
    borderRadius: '12px',       // เพิ่มความมนให้มากขึ้นอีกนิด
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // เงาฟุ้งๆ นุ่มนวล
    border: '1px solid #f0f0f0', // เส้นขอบบางๆ ตัดกับพื้นขาว
  };

  return (
    <div style={menuContainerStyle}>
      
      {/* รูปที่ 1 */}
      <img src={image1} alt="Rules 1" style={imageStyle} />

      {/* รูปที่ 2 */}
      <img src={image2} alt="Rules 2" style={imageStyle} />

    </div>
  );
};

export default DrinkMenu;