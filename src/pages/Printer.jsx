// src/pages/OrderPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // import Supabase Client ของคุณ

// Import Component ลูกทั้งสอง
import MenuOrder from '../components/MenuOrder';
import PrintButton from '../components/PrintButton';

const OrderPage = () => {
    // State สำหรับเก็บข้อมูลออเดอร์ทั้งหมด
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect จะทำงานครั้งเดียวตอนเปิดหน้านี้ เพื่อดึงข้อมูลออเดอร์
    useEffect(() => {
        const fetchOrder = async () => {
            // สมมติว่าเราต้องการดึงข้อมูลออเดอร์ ID หมายเลข 123
            const orderIdToFetch = 123;

            const { data, error } = await supabase
                .from('orders')
                .select(`*, order_items(*, products(*))`)
                .eq('id', orderIdToFetch)
                .single();

            if (error) {
                setError(error.message);
                console.error("Error fetching order:", error);
            } else {
                setOrderData(data);
            }
            setLoading(false);
        };

        fetchOrder();
    }, []); // ใส่ [] เพื่อให้ทำงานแค่ครั้งเดียว

    if (loading) return <p>กำลังโหลดข้อมูลออเดอร์...</p>;
    if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;
    if (!orderData) return <p>ไม่พบข้อมูลออเดอร์</p>

    return (
        <div className="order-container">
            <h1>รายละเอียดออเดอร์ #{orderData.id}</h1>

            {/* ส่งข้อมูลออเดอร์ทั้งหมดไปให้ MenuOrder เพื่อ "แสดงผล" */}
            <MenuOrder order={orderData} />

            <hr />

            {/* ส่งแค่ "ID" ของออเดอร์ไปให้ PrintButton */}
            <PrintButton orderId={orderData.id} />
        </div>
    );
};

export default OrderPage;