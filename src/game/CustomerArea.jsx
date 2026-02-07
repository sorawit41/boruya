import React from 'react';

const Customer = ({ customer }) => {
  // เราจะใช้ชื่อ order เพื่อสร้าง path ไปยังรูปภาพ
  const orderImage = `/images/${customer.order}_order.png`;

  return (
    <div className="customer">
      <div className="order-bubble">
        <img src={orderImage} alt={customer.order} />
      </div>
      {/* สามารถเพิ่มรูปตัวละครลูกค้าตรงนี้ได้ */}
      <div className="customer-sprite"></div>
      <div className="tea"></div>
    </div>
  );
};


const CustomerArea = ({ customers }) => {
  return (
    <div className="customer-area">
      <div className="counter-top"></div>
      <div className="customer-seats">
        {customers.map((customer) => (
          <Customer key={customer.id} customer={customer} />
        ))}
      </div>
      <div className="counter-bottom"></div>
    </div>
  );
};

export default CustomerArea;