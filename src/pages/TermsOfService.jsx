import React, { useState, useEffect } from 'react';
import { BsFileTextFill } from 'react-icons/bs';

const TermsOfService = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // --- Using the same Boruyasushi theme for consistency ---
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
        <BsFileTextFill style={iconStyle} />
        <h1 style={heading1Style}>ข้อกำหนดและเงื่อนไขการให้บริการ</h1>
      </div>
      <p style={lastUpdatedStyle}>
        ปรับปรุงแก้ไขล่าสุด: 14 กันยายน 2568
      </p>

      <p style={paragraphStyle}>
        ขอต้อนรับสู่ <strong style={strongStyle}>Boruyasushi.com</strong> ข้อกำหนดและเงื่อนไขการให้บริการฉบับนี้ ("ข้อกำหนด") มีผลบังคับใช้กับการเข้าถึงและการใช้บริการเว็บไซต์ รวมถึงบริการอื่นใดที่เกี่ยวข้อง ("บริการ") ของเรา โปรดศึกษาข้อกำหนดเหล่านี้อย่างละเอียดถี่ถ้วน การที่ท่านเข้าถึงหรือใช้บริการของเรา ย่อมถือว่าท่านได้ยอมรับข้อผูกพันตามข้อกำหนดฉบับนี้ทุกประการ
      </p>

      <h2 style={heading2Style}>1. การยอมรับข้อกำหนด</h2>
      <p style={paragraphStyle}>
        การเข้าใช้บริการเว็บไซต์นี้ ถือเป็นการยืนยันว่าท่านได้อ่าน ทำความเข้าใจ และยอมรับข้อผูกพันตามข้อกำหนดและเงื่อนไขที่ระบุไว้ หากท่านไม่เห็นด้วยกับข้อกำหนดดังกล่าว กรุณายุติการเข้าใช้งานเว็บไซต์นี้โดยทันที
      </p>

      <h2 style={heading2Style}>2. ทรัพย์สินทางปัญญา</h2>
      <p style={paragraphStyle}>
        บรรดาเนื้อหาที่ปรากฏบนเว็บไซต์ ซึ่งรวมถึงแต่ไม่จำกัดเพียง ข้อความ, กราฟิก, โลโก้, รูปภาพ, และซอฟต์แวร์ ถือเป็นทรัพย์สินของ <strong style={strongStyle}>Boruyasushi.com</strong> หรือผู้ให้อนุญาต และอยู่ภายใต้ความคุ้มครองของกฎหมายทรัพย์สินทางปัญญาแห่งราชอาณาจักรไทยและกฎหมายระหว่างประเทศ ห้ามมิให้ทำซ้ำ, แจกจ่าย, ดัดแปลง, หรือสร้างสรรค์ผลงานต่อเนื่องจากเนื้อหาส่วนหนึ่งส่วนใด โดยปราศจากความยินยอมเป็นลายลักษณ์อักษรจากเรา
      </p>

      <h2 style={heading2Style}>3. ขอบเขตการใช้งาน</h2>
      <p style={paragraphStyle}>
        ท่านตกลงที่จะใช้เว็บไซต์นี้เพื่อวัตถุประสงค์ที่ชอบด้วยกฎหมายเท่านั้น และจะละเว้นจากการกระทำใดๆ ที่อาจก่อให้เกิดความเสียหาย หรือส่งผลกระทบต่อการทำงานของเซิร์ฟเวอร์หรือเครือข่ายของเรา ท่านจะต้องไม่พยายามเข้าถึงส่วนใดของเว็บไซต์ บัญชีผู้ใช้อื่น หรือระบบคอมพิวเตอร์โดยไม่ได้รับอนุญาต
      </p>

      <h2 style={heading2Style}>4. ข้อจำกัดความรับผิด</h2>
      <p style={paragraphStyle}>
        เว็บไซต์และบริการทั้งหมดมีให้ "ตามสภาพที่เป็น" <strong style={strongStyle}>Boruyasushi.com</strong> มิอาจรับประกันได้ว่าเว็บไซต์จะสามารถใช้งานได้อย่างต่อเนื่องหรือปราศจากข้อผิดพลาด เราจะไม่รับผิดต่อความเสียหายใดๆ อันเป็นผลสืบเนื่องมาจากการใช้งานหรือการไม่สามารถใช้งานเว็บไซต์ของเราได้
      </p>

      <h2 style={heading2Style}>5. การเปลี่ยนแปลงข้อกำหนด</h2>
      <p style={paragraphStyle}>
        เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลาตามดุลยพินิจของเราแต่เพียงผู้เดียว การเปลี่ยนแปลงดังกล่าวจะมีผลบังคับใช้ทันทีเมื่อประกาศลงบนเว็บไซต์ การที่ท่านยังคงใช้งานเว็บไซต์ต่อไปภายหลังการเปลี่ยนแปลง ย่อมถือว่าท่านยอมรับข้อกำหนดฉบับปรับปรุงแล้ว
      </p>

      <h2 style={heading2Style}>6. ช่องทางการติดต่อ</h2>
      <p style={paragraphStyle}>
        หากท่านมีข้อสงสัยเกี่ยวกับข้อกำหนดฉบับนี้ ท่านสามารถติดต่อเราได้ที่:
      </p>
      <p style={paragraphStyle}>
        <strong style={strongStyle}>อีเมล:</strong> contact@boruyasushi.com
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '40px 0' }} />
      <p style={{ ...paragraphStyle, textAlign: 'center', fontSize: '0.9rem', color: '#7f8c8d' }}>
        
      </p>
    </div>
  );
};

export default TermsOfService;