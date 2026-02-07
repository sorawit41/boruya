import React, { useState } from 'react';

// เช็ค Path รูปภาพให้ถูกต้องตาม Project ของคุณนะครับ
import image1 from '../assets/menu/MENU1.png';
import image2 from '../assets/menu/MENU2.png';
import image3 from '../assets/menu/MENU3.png';
import image4 from '../assets/menu/Set_menu.jpg';

const galleries = {
  buffet: [image1, image2, image3],
  setMenu: [image4]
};

const Menu = () => {
  const [activeGallery, setActiveGallery] = useState(null);
  const [modalSlide, setModalSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const openGallery = (galleryName) => {
    setActiveGallery(galleryName);
    setModalSlide(0);
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const getImages = () => galleries[activeGallery] || [];

  const nextModalSlide = () => {
    const images = getImages();
    setModalSlide(modalSlide === images.length - 1 ? 0 : modalSlide + 1);
  };

  const prevModalSlide = () => {
    const images = getImages();
    setModalSlide(modalSlide === 0 ? images.length - 1 : modalSlide - 1);
  };

  // --- Styles ---
  const menuContainerStyle = {
    backgroundColor: '#ffffff', // แก้ไข: เปลี่ยนจาก #f9f9f9 เป็น #ffffff (สีขาว)
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    transition: 'filter 0.3s ease-in-out',
    filter: activeGallery ? 'blur(5px)' : 'none',
  };

  const contentWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1500px',
    alignItems: 'stretch', 
  };

  const columnStyle = {
    flex: 1,
    minWidth: '320px',
    padding: '0 20px',
    display: 'flex', 
  };

  const cardStyle = {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    cursor: 'pointer',
    margin: '20px 0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
    display: 'flex',       
    flexDirection: 'column' 
  };

  const cardImageStyle = {
    width: '100%',
    height: 'auto', 
    display: 'block',
    flexGrow: 1, 
    objectFit: 'cover', 
  };

  const cardContentStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
    padding: '25px',
    textAlign: 'left',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    zIndex: 2, 
  };

  const cardTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 5px 0',
    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
  };

  const cardSubtitleStyle = {
    fontSize: '1rem',
    color: '#e0e0e0',
    margin: 0,
    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
  };

  const hoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    opacity: activeGallery ? 1 : 0,
    pointerEvents: activeGallery ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
  };

  const modalContentStyle = {
    position: 'relative',
    width: '90%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    transform: activeGallery ? 'scale(1)' : 'scale(0.95)',
    transition: 'transform 0.3s ease',
    backgroundColor: '#000', 
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    lineHeight: '1',
    transition: 'background-color 0.2s ease',
  };

  const modalTrackStyle = {
    display: 'flex',
    transform: `translateX(-${modalSlide * 100}%)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  const modalImageStyle = {
    width: '100%',
    flexShrink: 0,
    display: 'block',
    maxHeight: '90vh',
    objectFit: 'contain',
  };

  const arrowStyle = (direction) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    ...(direction === 'left' ? { left: '15px' } : { right: '15px' }),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    fontSize: '1.8rem',
    color: '#333',
    cursor: 'pointer',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  });

  const dotsContainerStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 2,
  };

  const dotStyle = (isActive) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(0,0,0,0.1)',
    cursor: 'pointer',
  });

  return (
    <div style={{ width: '100%' }}>
      
      <div style={menuContainerStyle}>
        <div style={contentWrapperStyle}>

          {/* --- CARD 1: BUFFET --- */}
          <div style={columnStyle}>
            <div
              style={{
                ...cardStyle,
                ...(hoveredCard === 'buffet' ? hoverStyle : {})
              }}
              onMouseEnter={() => setHoveredCard('buffet')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => openGallery('buffet')}
            >
              <img src={image1} alt="Buffet" style={cardImageStyle} />
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>บุฟเฟ่ต์</h3>
                <p style={cardSubtitleStyle}>คลิกเพื่อดูเมนู ({galleries.buffet.length} รูป)</p>
              </div>
            </div>
          </div>

          {/* --- CARD 2: SET MENU --- */}
          <div style={columnStyle}>
            <div
              style={{
                ...cardStyle,
                ...(hoveredCard === 'setMenu' ? hoverStyle : {})
              }}
              onMouseEnter={() => setHoveredCard('setMenu')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => openGallery('setMenu')}
            >
              <img 
                src={image4} 
                alt="Set Menu" 
                style={{
                    ...cardImageStyle, 
                    height: '100%',    
                    objectFit: 'cover' 
                }} 
              />
              
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>เซตเมนู</h3>
                <p style={cardSubtitleStyle}>คลิกเพื่อดูเมนู ({galleries.setMenu.length} รูป)</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL --- */}
      {activeGallery && (
        <div 
          style={modalOverlayStyle} 
          onClick={closeGallery}
        >
          <div 
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            
            <button 
              style={closeButtonStyle} 
              onClick={closeGallery}
              aria-label="Close menu"
            >
              &times;
            </button>
            
            <div style={modalTrackStyle}>
              {getImages().map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Menu ${index + 1}`}
                  style={modalImageStyle}
                />
              ))}
            </div>

            {getImages().length > 1 && (
              <>
                <button style={arrowStyle('left')} onClick={prevModalSlide}>‹</button>
                <button style={arrowStyle('right')} onClick={nextModalSlide}>›</button>
                
                <div style={dotsContainerStyle}>
                  {getImages().map((_, index) => (
                    <div
                      key={index}
                      style={dotStyle(index === modalSlide)}
                      onClick={() => setModalSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;